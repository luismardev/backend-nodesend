const Users = require('../models/User')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

exports.newUser = async (req, res) => {
  //! validar si faltan arametros
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  //! validar existencia de usuario
  let user = await Users.findOne({ email })
  if (user) {
    return res.status(400).json({ msg: 'El usuario ya existe' })
  }

  //! crea el nuevo usuario
  user = new Users(req.body)

  //! hashear el password
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(password, salt)

  try {
    await user.save()
    res.json({ msg: 'Usuario registrado correctamente' })
  } catch (error) {
    res.status(400).json({ msg: 'hubo un error' })
  }
}
