const { Stock, Report, User } = require('../models')

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
    Stock.findAll({
      where: { symbol: req.params.symbol },
      include: [{
        model: Report,
        attributes: {
          exclude: ['updatedAt']
        },
        order: [['publishDate', 'DESC']],
        include: [{
          model: User,
          attributes: { exclude: ['password', 'isAdmin', 'createdAt', 'updatedAt', 'avatar', 'email'] }
        }]
      }],
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      raw: true,
      nest: true
    })
      .then(stock => {
        if (!stock) return res.status(404).json({ status: 'error', message: '無此股票..' })
        return res.json({
          status: 'success',
          data: stock
        })
      })
      .catch(err => next(err))
  }
}

module.exports = stockController
