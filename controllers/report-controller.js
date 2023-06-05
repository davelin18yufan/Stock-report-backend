const { Report, Stock } = require('../models')
const { getUser } = require('../_helpers')

const reportController = {
  getAllReports: (req, res, next) => {
    Report.findAll({
      include: {
        model: Stock,
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt']
        }
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(reports => {
        if (!reports) res.status(404).json({ status: 'error', message: '請求失敗' })
        return res.json({
          status: 'success',
          data: reports
        })
      })
      .catch(err => next(err))
  },
  getReport: (req, res, next) => {
    Report.findByPk(req.params.id, {
      include: {
        model: Stock,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      },
      raw: true,
      nest: true
    })
      .then(report => {
        if (!report) res.status(404).json({ status: 'error', message: '無此報告' })
        return res.json({
          status: 'success',
          data: report
        })
      })
      .catch(err => next(err))
  },
  postReport: (req, res, next) => {
    const { title, from, report, publishDate, stock } = req.body
    // 檢查輸入資料
    if (!title || !report) res.status(404).json({ status: 'error', message: '標題或內容空白' })
    if (title.length > 100) res.status(404).json({ status: 'error', message: '標題字數超過上限！' })
    if (publishDate.length !== 8) res.status(404).json({ status: 'error', message: '日期格式錯誤' })
    // 檢查有沒有輸入股票代號
    Stock.findOne({ where: { symbol: stock }, raw: true })
      .then(foundStock => {
        if (!foundStock) return res.status(404).json({ status: 'error', message: '無此股票代號' })
        const stockId = foundStock ? foundStock.id : null
        const stockName = foundStock ? foundStock.name : null
        console.log(foundStock.name)
        return Report.create({
          title,
          report,
          from,
          publish_date: publishDate,
          stockId,
          stock_name: stockName,
          userId: getUser(req) ? getUser(req).id : req.user.id,
          user_name: getUser(req) ? getUser(req).name : req.user.name
        })
      })
      .then(result => res.json({
        status: 'success',
        data: result
      }))
      .catch(err => next(err))
  }
}

module.exports = reportController
