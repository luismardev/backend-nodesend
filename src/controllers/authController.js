const Users = require('../models/User')
const passport = require('passport')
const jwt = require('jsonwebtoken')
require('../auth/strategies/basic')
const { config } = require('../config/index')

exports.authUser = async (req, res, next) => {
  passport.authenticate('basic', (error, user) => {
    console.log('Ejecutando authenticate para BasicStrategy')
    try {
      if (error || !user) return res.status(401).json({ msg: 'Error de autentificacion' })

      req.login(user, { session: false }, async (error) => {
        if (error) next(error)

        console.log('Ejecutando generacion token')

        const { _id: id, name, email } = user

        const payload = {
          sub: id,
          name,
          email
        }

        const token = jwt.sign(payload, process.env.SECRETA, {
          expiresIn: '15m'
        })

        res.cookie('token', token, {
          maxAge: 900000,
          httpOnly: !config.dev,
          secure: !config.dev
        })
        res.json({ token })
      })
    } catch (error) {
      next(error)
    }
  })(req, res, next)
}

exports.getAuthUser = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id).select('-password')
    res.json({ user })
  } catch (error) {
    res.status(500).json({ msg: 'el usuario no existe' })
  }
}
