const express = require('express')
const router = express.Router()
const postController = require('../../controllers/post-controller')

router.get('', postController.getPosts)
router.post('', postController.post)
router.get('/:id', postController.getPost)

module.exports = router
