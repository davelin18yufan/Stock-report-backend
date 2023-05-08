const { Stock, Report } = require('../models')

const stockController = {
  getAllStocks: (req, res, next) => {
    Stock.findAll({
      order: [['symbol', 'ASC']],
      raw: true,
      nest: true
    })
      .then(stocks => res.json({
        status: 'success',
        data: stocks
      }))
      .catch(err => next(err))
  },
  getStock: (req, res, next) => {
    Stock.findOne({ where: { symbol: req.params.symbol } }, {
      include: {
        model: Report,
        attributes: {
          exclude: ['updatedAt']
        },
        order: [['publishDate', 'DESC']]
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      raw: true,
      nest: true
    })
      .then(stock => {
        if (!stock) throw new Error('無此股票..')

        return res.json({
          status: 'success',
          data: stock
        })
      })
      .catch(err => next(err))
  }
}

module.exports = stockController
