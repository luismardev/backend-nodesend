const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
const Users = require('../../models/User')

passport.use(
  new Strategy({
    secretOrKey: process.env.SECRETA,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, async (payload, cb) => {
    try {
      console.log('ejecutando JwtStrategy')

      //! buscar usuario
      const user = await Users.findOne({ _id: payload.sub }).select('-password')

      //! no existe el usuario
      if (!user) return cb(null, false)

      return cb(null, user)
    } catch (error) {
      cb(error)
    }
  })
)
