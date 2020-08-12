const bcrypt = require('bcrypt')
const { BasicStrategy } = require('passport-http')
const Users = require('../../models/User')
const passport = require('passport')

passport.use(
  new BasicStrategy(
    async (email, password, cb) => {
      try {
        console.log('Ejecutando BasicStrategy')
        //! buscar usuario
        const user = await Users.findOne({ email })

        //! el usuario no existe
        if (!user) return cb(null, false)

        //! no coincide la password
        if (!bcrypt.compareSync(password, user.password)) return cb(null, false)

        //! eliminar contraseña
        user.password = undefined
        return cb(null, user) //! login ok
      } catch (error) {
        return cb(error)
      }
    }
  )
)
