const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { userController } = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const admin = require('./modules/admin')
const post = require('./modules/post')
const user = require('./modules/user')

router.get('/', (req, res) => {
  res.send('Project init!')
})
router.post('/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/signup', userController.signUp)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/post', authenticated, authenticatedUser, post)
router.use('/user', authenticated, authenticatedUser, user)
router.use('/', apiErrorHandler)

module.exports = router
