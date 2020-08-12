const express = require('express')
const router = express.Router()
const linksController = require('../controllers/linksController')
const auth = require('../auth/middleware/auth')

const { check } = require('express-validator')

router.post(
  '/',
  auth,
  check('original_name', 'error falta nombre original del documento')
    .not()
    .isEmpty(),
  check('name', 'error falta nombre generado').not().isEmpty(),
  linksController.newLink
)

router.get('/', linksController.allLinks)
router.get('/:url', linksController.getLinkAndPassword)
router.post('/:url', linksController.verifyPassword)

module.exports = router
