const { User } = require('../models')
// const Sequelize = require('sequelize')

const adminController = {
  getUsers: (req, res, next) => {
    User.findAll({
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
        data: {
          users
        }
      }))
      .catch(err => next(err))
  }
}

module.exports = adminController
