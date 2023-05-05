const { Report, Stock } = require('../models')

const reportController = {
  getAllReports: (req, res, next) => {
    Report.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(stocks => {
        if (!stocks) throw new Error('請求失敗')
        return res.json({
          status: 'success',
          data: stocks
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
        if (!report) throw new Error('無此報告')
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
    if (!title || !report) throw new Error('標題或內容空白')
    if (title.length > 50) throw new Error('標題字數超過上限！')
    if (publishDate.length !== 8) throw new Error('日期格式錯誤')
    // 檢查有沒有輸入股票代號
    Stock.findOne({ where: { symbol: stock } })
      .then(stock => {
        const stockId = stock ? stock.id : null
        return Report.create({
          title,
          report,
          from,
          publish_date: publishDate,
          stockId
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
