const { User, Post, Report, Stock } = require('../models')
const Sequelize = require('sequelize')

const adminController = {
  getUsers: (req, res, next) => {
    User.findAll({
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT(*) FROM Posts WHERE Posts.user_id = User.id)'), 'PostsCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Reports WHERE Reports.user_id = User.id)'), 'ReportsCount']
        ]
      },
      next: true,
      raw: true
    })
      .then(users => {
        // 刪除敏感資料
        const newUsers = users.map(user => {
          delete user.password
          return user
        })
        return newUsers
      })
      .then(users => res.json({
        data: users
      }))
      .catch(err => next(err))
  },
  getPosts: (req, res, next) => {
    Post.findAll({
      include: [{
        model: User,
        attributes: {
          exclude: ['password', 'isAdmin', 'createdAt', 'updatedAt', 'email']
        }
      }],
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(posts => res.json({ status: 'success', data: posts }))
      .catch(err => next(err))
  },
  deletePost: (req, res, next) => {
    Post.findOne({ where: { id: req.params.id } })
      .then(post => {
        if (!post) throw new Error('此貼文不存在')
        post.destroy()
      })
      .then(result => res.json({
        status: 'success',
        data: result
      }))
      .catch(err => next(err))
  },
  getReports: (req, res, next) => {
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
        if (!reports) throw new Error('請求失敗')
        return res.json({
          status: 'success',
          data: reports
        })
      })
      .catch(err => next(err))
  },
  deleteReport: (req, res, next) => {
    Report.findOne({ where: { id: req.params.id } })
      .then(report => {
        if (!report) throw new Error('此報告不存在')
        report.destroy()
      })
      .then(result => res.json({
        status: 'success',
        data: result
      }))
      .catch(err => next(err))
  }
}

module.exports = adminController
