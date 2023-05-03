const express = require('express')
const router = express.Router()
const { userController } = require('../../controllers/user-controller')

router.get('/:id', userController.getUserInfo)
router.post('/:id', userController.editUser)

module.exports = router
