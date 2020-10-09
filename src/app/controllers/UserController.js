const { formatCpfCnpj, formatCep } = require('../../lib/utils')

const User = require("../models/User")

module.exports = {
    registerForm(req, res) {

        return res.render('user/register')

    },
    async show(req, res) {

        const { user } = req

        // TRATANDO OS DADOS PARA MOSTRAR 
        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('user/index', { user })

    },
    async post(req, res) {

        const userId = await User.create(req.body)

        req.session.userId = userId

        return res.redirect(`/users`)
    },
    async update(req, res) {

        try{

            // EXTRAINDO {USER} DO REQ PELO ARQ. VALIDATORS/USER.JS
            const { user } = req

            // EXTRAINDO DO REQ.BODY
            let { name,  email, cpf_cnpj, cep, address } = req.body

            // CORRIGINDO OS CAMPOS PARA SALVAR NO DB
            cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
            cep = cep.replace(/\D/g, '')

            await User.update(user.id, {
                name,
                email,
                cpf_cnpj,
                cep,
                address
            })

            return res.render('user/index', {
                user: req.body,
                success: 'A sua conta foi atualizada com sucesso.'
            })

        }
        catch(err){
            console.error(err)
            return res.render('user/index', {
                error: 'Algum erro aconteceu.'
            })
        }
    },
    async delete(req, res) {

        try{
            
            await User.delete(req.body.id)

            req.session.destroy()

            return res.render('session/login', {
                success: 'Conta deletada com sucesso.'
            })


        } catch(err) {
            console.error(err)
            return res.render('user/index', {
                user: req.body,
                error: 'Erro ao tentar deletar a sua conta.'
            })
        }
    }
}