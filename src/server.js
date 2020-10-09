const express = require('express') // importando a biblioteca do express
const nunjucks = require('nunjucks') // importando a biblioteca do nunjucks
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session')

const server = express() // a const server instancia o express

server.use(session)

server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

server.use(express.urlencoded({ extended: true })) // faz com que funcione req.body
server.use(express.static('public')) // o express irá observar a pasta Public para servir os arq. estáticos (CSS)
server.use(methodOverride('_method')) //necessário colocar acima do 'server.use(routes)' / está sobrescrevendo o metodo
server.use(routes)
 
server.set('view engine', 'njk') // setar qual é o motor de views da app, qual é a extensão dos arquivos para abrir 

nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})

/* server.use(function(req, res) {
    res.status(404).render("deu ruim");
}) */

server.listen(5000, function(){
    console.log('server is running')
})