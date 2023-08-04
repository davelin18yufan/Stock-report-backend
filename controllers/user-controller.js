const bcrypt = require('bcryptjs')
const { User, Post, Report, Sequelize, Stock } = require('../models')
const { getUser } = require('../_helpers')
const imgurFileHandler = require('../helpers/file-helpers')
const jwt = require('jsonwebtoken')

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, email, password } = req.body
      // 檢查使用者輸入
      if (name?.trim().length === 0 || email.trim()?.length === 0 || password?.trim().length === 0) return res.status(404).json({ status: 'error', message: '還有欄位沒填' })
      if (name?.trim().length > 50) return res.status(404).json({ status: 'error', message: '暱稱上限50字!' })
      // 檢查是否重複註冊
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { name } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) return res.status(404).json({ status: 'error', message: '名稱已有人使用!' })
      if (userEmail) return res.status(404).json({ status: 'error', message: 'email 已重複註冊!' })
      // 創建新使用者
      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name,
        email,
        avatar: `https://loremflickr.com/320/320/headshot/?random=${Math.random() * 100}`,
        password: hash
      })
      const user = newUser.toJSON()
      delete newUser.password
      delete newUser.isAdmin
      return res.json({
        status: 'success',
        data: user
      })
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      const user = getUser(req).toJSON()
      if (!user) return res.status(404).json({ message: '信箱或密碼錯誤' })
      delete user.password
      delete user.isAdmin
      // jwt
      const token = jwt.sign(user, process.env.JWT_SECRET || 'jwtsecret', { expiresIn: '30d' })
      return res.json({
        status: 'success',
        data: {
          token,
          user
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUserInfo: (req, res, next) => {
    User.findByPk(req.params.id, {
      include: [
        {
          model: Post,
          as: 'FavoritePosts',
          include: {
            model: User,
            attributes: {
              exclude: ['password', 'isAdmin', 'createdAt', 'updatedAt']
            }
          },
          order: [['createdAt', 'DESC']],
          attributes: {
            exclude: ['Favorite', 'createdAt', 'user_id']
          }
        }
      ],
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT(*) FROM Posts WHERE Posts.user_id = User.id )'), 'posts_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Reports WHERE Reports.user_id = User.id )'), 'reports_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Favorites WHERE Favorites.user_id = User.id )'), 'beingFavorite_count']
        ]
      },
      nest: true
    })
      .then(user => {
        user = user.toJSON()
        if (!user) return res.status(404).json({ status: 'error', message: '此使用者不存在!' })
        delete user.password
        delete user.isAdmin
        return res.json({
          status: 'success',
          data: user
        })
      })
      .catch(err => next(err))
  },
  getUserPosts: (req, res, next) => {
    const userId = req.params.id
    Post.findAll({
      where: { userId },
      include: {
        model: User,
        attributes: ['id', 'name', 'email', 'avatar']
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(posts => {
        if (!posts) return res.status(404).json({ status: 'error', message: '無符合貼文！' })
        return res.json({
          status: 'success',
          data: posts
        })
      })
      .catch(err => next(err))
  },
  getUserReports: (req, res, next) => {
    const userId = req.params.id
    Report.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Stock,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
      ],
      raw: true,
      nest: true
    })
      .then(reports => {
        if (!reports) return res.status(404).json({ status: 'error', message: '無符合報告！' })
        return res.json({
          status: 'success',
          data: reports
        })
      })
      .catch(err => next(err))
  },
  editUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const currentUser = getUser(req)
      // 檢查點擊的使用者
      if (Number(userId) !== currentUser.id) return res.status(403).json({ status: 'error', message: '無權限修改其他使用者資料' })
      const { name, email, password, passwordCheck } = req.body
      const { avatar } = req.files || {}
      // 檢查表單欄位
      // if (name?.trim().length === 0 || email?.trim().length === 0 || password?.trim().length === 0) return res.status(404).json({ status: 'error', message: '還有欄位沒填' })
      if (password !== passwordCheck) return res.status(404).json({ status: 'error', message: '密碼與確認密碼不一樣!' })
      if (name?.trim().length > 15) return res.status(404).json({ status: 'error', message: '暱稱上限15字!' })

      const [user, userEmail, filePathAvatar] = await Promise.all([
        User.findByPk(userId),
        email ? User.findOne({ where: { email } }) : Promise.resolve(null),
        avatar ? imgurFileHandler(avatar[0]) : Promise.resolve(null)
      ])

      if (userEmail?.toJSON().email === user.email) return res.status(404).json({ status: 'error', message: '信箱已經使用!' })
      const updateUser = await user.update({
        name: name || user.name,
        email: email || user.email,
        avatar: filePathAvatar || user.avatar,
        password: password ? bcrypt.hashSync(password, 10) : user.password
      })
      const newUser = updateUser.toJSON()
      delete newUser.password
      delete newUser.isAdmin
      return res.json({
        status: 'success',
        data: newUser
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  userController
}
