const express = require('express')
const router = express.Router()
const postController = require('../../controllers/post-controller')
const upload = require('../../middleware/multer')

router.get('', postController.getPosts)
router.post('', upload.fields([{ name: 'Image', maxCount: 1 }]), postController.post)
router.get('/:id', postController.getPost)

module.exports = router
