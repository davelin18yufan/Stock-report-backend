const { User, Post, Report } = require('../models')
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
        const generalUsers = users.filter(user => user.isAdmin === 0)
        // 刪除敏感資料
        const newUsers = generalUsers.map(user => {
          delete user.password
          delete user.isAdmin
          return user
        })
        return newUsers
      })
      .then(users => res.json({
        status: 'success',
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
        if (!post) res.status(404).json({ status: 'error', message: '此貼文不存在' })
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
        model: User,
        attributes: {
          exclude: ['email', 'password', 'isAdmin', 'createdAt', 'updatedAt']
        }
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(reports => {
        if (!reports)res.status(404).json({ status: 'error', message: '請求失敗' })
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
        if (!report) res.status(404).json({ status: 'error', message: '此報告不存在' })
        report.destroy()
      })
      .then(result => res.json({
        status: 'success',
        data: result
      }))
      .catch(err => next(err))
  },
  deleteUser: (req, res, next) => {
    User.findOne({ where: { id: req.params.id } })
      .then(user => {
        if (!user) res.status(404).json({ status: 'error', message: '此使用者不存在' })
        user.destroy()
      })
      .then(result => res.json({
        status: 'success',
        data: result
      }))
      .catch(err => next(err))
  }
}

module.exports = adminController
