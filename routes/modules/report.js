const express = require('express')
const router = express.Router()
const reportController = require('../../controllers/report-controller')

router.delete('/:id', reportController.deleteReport)
router.get('/:id', reportController.getReport)
router.post('', reportController.postReport)
router.get('', reportController.getAllReports)

module.exports = router
