const User = require("../models/User")

const { compare } = require('bcryptjs')
    
async function login(req, res, next) {
    
    const { email, password} = req.body

    // CHECK IF THE USER IS REGISTERED
    const user = await User.findOne({ where: {email} })

    if (!user) return res.render('session/login', {
        user: req.body,
        error: 'Usuário não cadastrado.'
    })

    // CHECK IF PASSWORD MATCH
    const passed = await compare(password, user.password)

    if (!passed) return res.render('session/login', {
        user: req.body,
        error: 'Senha incorreta.'
    })

    // PUT THE USER IN REQ.SESSION (LOGADO)
    req.user = user

    next()
}

async function forgot(req, res, next) {
    
    const { email } = req.body

    try {
        // CHECK IF THE USER IS REGISTERED
        const user = await User.findOne({ where: {email} })

        if (!user) return res.render('session/forgot-password', {
            user: req.body,
            error: 'E-mail não cadastrado.'
        })

        req.user = user

        next()
    }
    catch(err) { 
        console.error(err)
    }
}

async function reset(req, res, next) {

    const { email, password, passwordRepeat, token } = req.body

    // CHECK IF THE USER IS REGISTERED (BY E-MAIL)
    const user = await User.findOne({ where: {email} })

    if (!user) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Usuário não cadastrado.'
    })

    // CHECK IF PASSWORD MATCH
    if (password != passwordRepeat) {
        return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'A senha e a repetição de senha estão incorretas.'
        })
    }

    // CHECK IF TOKEN MATCH
    if (token != user.reset_token) {
        return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Token inválido! Solicite uma nova recuperação de senha.'
        }) 
    }

    // CHECK IF TOKEN HAS EXPIRED
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) {
        return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Token expirado! Solicite uma nova recuperação de senha.'
        }) 
    }

    req.user = user

    next()
}

module.exports = {
    login,
    forgot,
    reset
}