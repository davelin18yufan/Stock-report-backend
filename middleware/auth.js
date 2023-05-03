const passport = require('../config/passport')
const { getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user.dataValues
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (getUser(req) && getUser(req).isAdmin) return next()

  return res.status(403).json({ status: 'error', message: '權限不符' })
}

const authenticatedUser = (req, res, next) => {
  if (getUser(req) && !getUser(req).isAdmin) return next()

  return res.status(403).json({ status: 'error', message: '權限不符' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
