const express = require('express')
const router = express.Router()
const postController = require('../../controllers/post-controller')
const upload = require('../../middleware/multer')

router.post('/favorite/:id', postController.favoritePost)
router.delete('/favorite/:id', postController.removeFavoritePost)
router.get('/:id', postController.getPost)
router.get('', postController.getPosts)
router.post('', upload.fields([{ name: 'image', maxCount: 1 }]), postController.post)

module.exports = router
