const express = require('express')
require('dotenv').config({ path: '.env' })
const passport = require('passport')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const conectarDB = require('./config/database')
require('./auth/strategies/google-auth')

//! conectar db
conectarDB()
//! crear el servidor
const app = express()

//! habilitar cors
const options = {
  origin: process.env.FRONTEND_URL
}
app.use(cors(options))

//! parser
app.use(express.json())
app.use(cookieParser())

//! passport
app.use(passport.initialize())

//! habilitar carpeta publica
app.use(express.static('uploads'))

//! rutas de la app
app.use('api/users', require('./routes/users'))
app.use('api/auth', require('./routes/auth'))
app.use('api/links', require('./routes/links'))
app.use('api/records', require('./routes/records'))

//! arrancar la app
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log('el servidor esta funcionando en el puerto:', port)
})
