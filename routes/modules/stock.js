const express = require('express')
const router = express.Router()
const stockController = require('../../controllers/stock-controller')

router.get('/:symbol', stockController.getStock)
router.get('', stockController.getAllStocks)

module.exports = router
