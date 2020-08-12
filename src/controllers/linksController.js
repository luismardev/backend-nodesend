/* eslint-disable camelcase */
const Links = require('../models/Links')
const shortid = require('shortid')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

exports.newLink = async (req, res) => {
  const { original_name, name } = req.body
  //! revisar si hay errores
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  //! crear un objeto de enlaces
  const links = new Links()
  links.url = shortid.generate()
  links.name = name
  links.original_name = original_name

  //! si el usuario esta autentificado
  if (req.user) {
    const { password, downloads } = req.body

    //! asignar numero de descargas
    if (downloads) {
      links.downloads = downloads
    }

    //! asignar un password
    if (password) {
      const salt = await bcrypt.genSalt(10)
      links.password = await bcrypt.hash(password, salt)
    }

    links.author = req.user._id
  }
  //! almacenar en la DB
  try {
    await links.save()
    return res.json({ msg: `${links.url}` })
  } catch (error) {
    res.json({ msg: 'hubo un error' })
  }
}

exports.getLinkAndPassword = async (req, res) => {
  const { url } = req.params

  //! validar la existencia de la url
  const link = await Links.findOne({ url })

  if (!link) {
    return res.status(404).json({ msg: 'este enlace no existe' })
  }

  //! si tiene password enviarla
  if (link.password) {
    return res.json({ password: true, file: link.name, url: link.url })
  } else {
    //! enviar url si no tiene password
    return res.json({ password: false, file: link.name, url: link.url })
  }
}

exports.allLinks = async (_, res) => {
  try {
    const links = await Links.find({}).select('url -_id')
    res.json({ links })
  } catch (error) {
    console.log(error)
  }
}

exports.verifyPassword = async (req, res) => {
  const { url } = req.params
  const { password } = req.body
  //! validar la existencia de la url
  const link = await Links.findOne({ url })

  if (!link) {
    return res.status(404).json({ msg: 'este enlace no existe' })
  }

  if (bcrypt.compareSync(password, link.password)) {
    return res.json({ password: false })
  } else {
    return res.status(401).json({ msg: 'contraseña incorrecta' })
  }
}
