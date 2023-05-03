const express = require('express')
const router = express.Router()
const { userController } = require('../controllers/user-controller')

router.get('/', (req, res) => {
  res.send('Project init!')
})
router.post('/signup', userController.signUp)

module.exports = router
