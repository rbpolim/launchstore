const User = require("../models/User")

const { compare } = require('bcryptjs')

// FUNCTION OF CHECK IF HAS ALL FIELDS
function checkAllFields(body){
    
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Preencha todos os campos disponíveis'
            }
        }
    }
}
    
async function show(req, res, next) {
    
    const { userId: id } = req.session

    const user = await User.findOne({ where: {id} })

    if (!user) return res.render('user/register', {
        error: 'Usuário não encontrado.'
    })

    req.user = user

    next()
}

async function post(req, res, next) {

    //CHECK IF HAS ALL FIELDS
    const fillAllFields = checkAllFields(req.body)
    
    if (fillAllFields) {
        return res.render('user/register', fillAllFields)
    }

    //CHECK IF USER ALREADY EXISTS [E-MAIL, CPF E CNPJ]
    let { email, cpf_cnpj, password, passwordRepeat } = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, '') 

    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })

    if (user) return res.render('user/register', {
        user: req.body,
        error: 'Usuário já cadastrado'
    })

    //CHECK IF PASSWORD MATCH
    if (password != passwordRepeat) {
        return res.render('user/register', {
            user: req.body,
            error: 'A senha e a repetição de senha estão incorretas.'
        })
    }

    next()
}

async function update(req, res, next) {

    // CHECK IF FILL ALL FIELDS
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('user/index', fillAllFields)
    }

    // CHECK IF HAS PASSWORD
    const { id, password } = req.body

    if (!password) return res.render('user/index', {
        user: req.body,
        error: 'Coloque a sua senha para atualizar seu cadastro.'
    })

    // CHECK IF PASSWORD MATCH
    const user = await User.findOne({ where: {id} })

    const passed = await compare(password, user.password)

    if (!passed) return res.render('user/index', {
        user: req.body,
        error: 'Senha incorreta.'
    })

    req.user = user

    next()  
}

module.exports = {
    post,
    show,
    update
}