const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')

const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) throw new Error('此信箱不存在！')
        bcrypt.compare(password, user.password).then(isAuth => {
          if (!isAuth) return cb(null, false, { message: '信箱或密碼錯誤！' })
          return cb(null, user)
        })
      })
      .catch(err => cb(err))
  })
)

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'jwtsecret'
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
