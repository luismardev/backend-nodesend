//! subida de archivos
const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')
const Links = require('../models/Links')

exports.uploadFile = async (req, res) => {
  const settingsMulter = {
    limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, `${__dirname}/../uploads`)
      },
      filename: (_req, file, cb) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf('.'),
          file.originalname.length
        )
        cb(null, `${shortid.generate()}${extension}`)
      }
    })
  }
  const upload = multer(settingsMulter).single('records')

  upload(req, res, async (error) => {
    if (!error && req.file) {
      res.json({ file: req.file.filename })
    } else {
      res.status(400).json({ msg: 'hubo un error' })
    }
  })
}

exports.downloadFile = async (req, res, next) => {
  //! validar la existencia de la url
  const link = await Links.findOne({ name: req.params.file })

  fs.renameSync(`${__dirname}/../uploads/${link.name}`, `${__dirname}/../uploads/${link.originalName}`)

  const file = `${__dirname}/../uploads/${link.originalName}`

  res.download(file)

  //! eliminando archivo
  const { downloads, id, originalName } = link

  //! eliminar si es menor a 1
  if (downloads === 1) {
    //! eliminar archivo
    req.file = originalName

    //! eliminar data
    await Links.findOneAndRemove(id)

    return next()
  } else {
    fs.renameSync(`${__dirname}/../uploads/${link.originalName}`, `${__dirname}/../uploads/${link.name}`)
    link.downloads--
    await link.save()
  }
}

exports.deleteFile = async (req, res) => {
  try {
    fs.unlinkSync(`${__dirname}/../uploads/${req.file}`)
  } catch (error) {
    res.status(400).json({ msg: 'hubo un error' })
  }
}
