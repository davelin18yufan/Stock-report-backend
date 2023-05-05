const express = require('express')
const router = express.Router()
const reportController = require('../../controllers/report-controller')

router.post('', reportController.postReport)
router.get('/:id', reportController.getReport)
router.get('', reportController.getAllReports)

module.exports = router
