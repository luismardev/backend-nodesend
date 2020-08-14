const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const Users = require('../../models/User')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await Users.findOne({ googleId: profile.id })
        if (user) {
          if (user.email === profile.emails[0].value) {
            const updateUser = await Users.findOneAndUpdate(
              { _id: user.id },
              { googleId: profile.id },
              {
                new: true
              }
            )
            done(null, updateUser)
          } else {
            done(null, user)
          }
        } else {
          const newUser = await new Users({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id
          }).save()
          done(null, newUser)
        }
      } catch (error) {
        console.log(error)
      }
    }
  )
)
