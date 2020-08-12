const passport = require('passport')
require('../strategies/jwt')
module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      console.log('ejecutando authenticate estrategia jwt')
      //! si hubo un error relacionado con la validez del token (error en su firma, caducado, etc)
      if (info) {
        return res.status(400).json({ msg: 'Token invalido' })
      }

      //! si hubo un error en la consulta a la base de datos
      if (err) {
        return res.status(400).json({ msg: 'Error en el servidor' })
      }

      //! si el usuario esta registrado o no, pasa al siguiente
      if (user) {
        req.user = user
        return next()
      }
    })(req, res, next)
  } else return next()
}
