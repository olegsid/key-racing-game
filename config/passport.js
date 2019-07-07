const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const users = require('../db/users')

const opts = {
  secretOrKey: 'secret',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      console.log('entered')
      const user = users.find(userFromDB => {
        if (userFromDB.login === payload.login) {
          return userFromDB
        }
      })
      return user ? done(null, user) : done({ status: 401, message: 'uyjghhjhj' }, null)
    } catch (err) {
      return done(err)
    }
  })
)
