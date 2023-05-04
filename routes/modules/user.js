const express = require('express')
const router = express.Router()
const { userController } = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.get('/:id/posts', userController.getUserPosts)
router.get('/:id', userController.getUserInfo)
router.put('/:id', upload.single('image'), userController.editUser)

module.exports = router
