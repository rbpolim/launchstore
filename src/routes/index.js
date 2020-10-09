const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

const users = require('./users')
const products = require('./products')

//HOME ROUTE
routes.get('/', HomeController.index)

//USERS ROUTES
routes.use('/users', users)

//PRODUCTS ROUTES
routes.use('/products', products)

//ALIAS (ATALHOS)
routes.get('/ads/create', function(req, res){
    return res.redirect("/products/create")
})

routes.get('/accounts', function(req, res){
    return res.redirect("/users/login")
})

module.exports = routes