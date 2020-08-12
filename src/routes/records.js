const express = require('express')
const router = express.Router()
const recordsControllers = require('../controllers/recordsControllers')
const auth = require('../auth/middleware/auth')

router.post('/', auth, recordsControllers.uploadFile)

router.get(
  '/:file',
  recordsControllers.downloadFile,
  recordsControllers.deleteFile
)
module.exports = router
