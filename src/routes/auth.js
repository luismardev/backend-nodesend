const express = require('express')
const passport = require('passport')
const router = express.Router()
const authController = require('../controllers/authController')
const auth = require('../auth/middleware/auth')
const { config } = require('../config/index')
const jwt = require('jsonwebtoken')

router.post('/', authController.authUser)
router.get('/', auth, authController.getAuthUser)

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const { _id: id, name, email } = req.user

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
  res.redirect(`${process.env.FRONTEND_URL}`)
})
module.exports = router
