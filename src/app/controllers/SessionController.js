const User = require('../models/User')

const crypto = require('crypto')
const mailer = require('../../lib/mailer')

const { hash } = require('bcryptjs')

module.exports = {
    loginForm(req, res) {

        return res.render('session/login')  

    },
    login(req, res) {

        req.session.userId = req.user.id

        return res.redirect('/users')

    },
    logout(req, res) {

        req.session.destroy()

        return res.redirect('/')
    },
    forgotForm(req, res) {

        return res.render('session/forgot-password')  

    },
    async forgot(req, res) {

        try{
            const user = req.user

            // CRIAR UM TOKEN PARA O USUÁRIO
            const token = crypto.randomBytes(20).toString('hex')
    
            // CRIAR UMA EXPIRAÇÃO PARA O TOKEN
            let now = new Date()
            now = now.setHours(now.getHours() + 1)
    
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })
    
            // ENVIAR UM E-MAIL COM O LINK DE RECUPERAÇÃO DE SENHA
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de Senha',
                html: `<h2>Perdeu a chave?</h2>
                <p>Não se preocupe, click no link para recuperar a sua senha.</p>
                <p>
                    <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
                `,
            })
    
            // AVISAR AO USUÁRIO QUE ENVIAMOS O E-MAIL
            return res.render('session/forgot-password', {
                success: 'Verifique o seu e-mail para recuperar a sua senha.'
            })
        }
        catch(err){

            console.error(err)

            return res.render('session/forgot-password', {
                error: 'Erro inesperado, tente novamente.'
            })
        }
    },
    resetForm(req, res) {

        return res.render('session/password-reset', {
            token: req.query.token
        })
        
    },
    async reset(req, res) {

        const user = req.user
        const { password, token } = req.body
        
        try{
            // CREATE NEW HASH PASSWORD 
            const newPassword = await hash(password, 8)

            // ATUALIZA O USUÁRIO
            await User.update(user.id, {
                password: newPassword,
                reset_token: '',
                reset_token_expires: '',
            })

            // AVISA O USUÁRIO QUE ELE TEM UMA NOVA SENHA 
            return res.render('session/login', {
                user: req.body,
                success: 'Senha atualizada com sucesso. Faça seu login.'
            })

        }
        catch(err) {

            console.error(err)

            return res.render('session/password-reset', {
                user: req.body,
                token,
                error: 'Erro inesperado, tente novamente.'
            })
        }
    },
}