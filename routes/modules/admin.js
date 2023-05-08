const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.delete('/post/:id', adminController.deletePost)
router.delete('/report/:id', adminController.deleteReport)
router.get('/post', adminController.getPosts)
router.get('/report', adminController.getReports)
router.get('/users', adminController.getUsers)

module.exports = router
