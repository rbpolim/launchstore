const Mask = {
    apply(input, func) {

        setTimeout(function() {

            input.value = Mask[func](input.value)

        }, 1)
    },
    formatBRL(value) {
        
        value = value.replace(/\D/g, '')

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value/100)
    },
    cpfCnpj(value) {

        value = value.replace(/\D/g, '')

        // LIMITAR P/ QUE O USUÁRIO NÃO ADD MAIS DO QUE 14 CARACTERES
        if (value.length > 14) {
            value = value.slice(0, -1)
        }

        // CHECK IF CNPJ - 11.222.333/4444-55
        if (value.length > 11) {
            
            // 11.222333444455
            value = value.replace(/(\d{2})(\d)/, "$1.$2")

            // 11.222.333444455
            value = value.replace(/(\d{3})(\d)/, "$1.$2")

            // 11.222.333/444455
            value = value.replace(/(\d{3})(\d)/, "$1/$2")

            // 11.222.333/4444-55
            value = value.replace(/(\d{4})(\d)/, "$1-$2")

        } else {
            // CHECK IF CPF - 111.222.333-44

            // 111.22233344
            value = value.replace(/(\d{3})(\d)/, "$1.$2")

            // 111.222.33344
            value = value.replace(/(\d{3})(\d)/, "$1.$2")

            // 111.222.333-44
            value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }

        return value
    },
    cep(value) {

        value = value.replace(/\D/g, '')

        // LIMITAR P/ QUE O USUÁRIO NÃO ADD MAIS DO QUE 14 CARACTERES
        if (value.length > 8) {
            value = value.slice(0, -1)
        }

        // CEP 12345-123 
        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    },
}

const PhotosUpload = {
    input: '',
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {

        const { files: fileList } = event.target //Aqui contêm os arquivos de fotos selecionadas

        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return 

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file) //Add o file no array files = [],

            const reader = new FileReader() //Constructor que lê arquivos

            reader.onload = () => {
                const image = new Image() //Constructor Image() -> Cria uma tag HTML <img/>
                image.src = String(reader.result) //Aqui terá o arquivo -> readAsDataURL(file)

                const div = PhotosUpload.getContainer(image)
                document.querySelector('#photos-preview').appendChild(div) //Fazer a adição da div p/ dentro de #photos-preview
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()

    },
    hasLimit(event) {
        
        const { uploadLimit, input, preview } = PhotosUpload //Extraindo o uploadLimit p/ poder utilizar 
        const { files: fileList } = input

        //Validação p/ até 6 fotos
        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault() //Bloquear o evento 
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == 'photo')
            photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert('Você atingiu o limite máximo de fotos')
            event.preventDefault() //Bloquear o evento 
            return true
        }

        return false
    },
    getAllFiles() {

        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files

    },
    getContainer(image) {
        
        const div = document.createElement('div') //Construtor de uma <div>
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto
        
        div.appendChild(image) //Colocando a image p/ dentro da div

        div.appendChild(PhotosUpload.getRemoveButton()) //Colocando o elemento <i> p/ dentro da div

        return div
    },
    getRemoveButton() {

        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'delete_forever'
        return button

    },
    removePhoto(event) {

        const photoDiv = event.target.parentNode // <div class="photo"
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1) // Tirando um elemento dos files
        PhotosUpload.input.files = PhotosUpload.getAllFiles() // Atualizar o input com os meus dados

        photoDiv.remove()
    },
    removeOldPhoto(event) {

        const photoDiv = event.target.parentNode

        if (photoDiv.id) {

            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    },
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {

        const { target } = e 

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        
        target.classList.add('active')
        
        ImageGallery.highlight.src = target.src
    },
}

const Validate = {
    apply(input, func) {

        Validate.clearErrors(input)
      
        let results = Validate[func](input.value)
        input.value = results.value

        if (results.error)
            Validate.displayError(input, results.error)

    },
    displayError(input, error) {

        // CRIANDO UMA 'DIV' COM O ERRO DENTRO | RECEBENDO DO 'APPLY'
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)

        input.focus()
    },
    clearErrors(input) {

        // PEGANDO A 'DIV' DO DISPLAY ERROR
        const errorDiv = input.parentNode.querySelector('.error')

        if (errorDiv)
            errorDiv.remove()

    },
    isEmail(value) {

        let error = null 

        // EXPRESSÃO REGULAR VALIDAÇÃO DE E-MAIL
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat))
            error = "E-mail inválido"

        return {
            error,
            value
        }
    },
    isCpfCnpj(value) {

        let error = null

        const cleanValues = value.replace(/\D/g, '')

        if (cleanValues.length > 11 && cleanValues.length !== 14) {
            error = 'CNPJ Inválido'
        }
        else if (cleanValues.length < 12 && cleanValues.length !== 11) {
            error = 'CPF Inválido'
        }

        return {
            error,
            value
        }
    },
    isCep(value) {

        let error = null

        const cleanValues = value.replace(/\D/g, '')

        if (cleanValues.length !== 8) {
            error = 'CEP Inválido'
        }

        return {
            error,
            value
        }
    },
}