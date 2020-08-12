const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { check } = require('express-validator')

router.post(
  '/',
  [
    check('name', 'el nombre es obligatorio').not().isEmpty(),
    check('email', 'agrega un email valido').isEmail(),
    check('password', 'el password debe tener al menos 6 caracteres').isLength({
      min: 6
    })
  ],
  userController.newUser
)

module.exports = router
