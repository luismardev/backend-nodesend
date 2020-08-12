const express = require('express')
// const passport = require('passport')
const router = express.Router()
const authController = require('../controllers/authController')
const auth = require('../auth/middleware/auth')

router.post('/', authController.authUser)
router.get('/', auth, authController.getAuthUser)

// router.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// )

// router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//   res.redirect('/')
// })
module.exports = router
