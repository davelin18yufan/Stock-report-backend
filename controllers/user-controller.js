const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { getUser } = require('../_helpers')
const imgurFileHandler = require('../helpers/file-helpers')
const jwt = require('jsonwebtoken')

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      // 檢查使用者輸入
      if (name?.trim().length === 0 || email.trim()?.length === 0 || password?.trim().length === 0) throw new Error('還有欄位沒填')
      if (password !== passwordCheck) throw new Error('密碼與確認密碼不同!')
      if (name && name.length > 50) throw new Error('暱稱上限50字!')
      // 檢查是否重複註冊
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { name } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) throw new Error('名稱已有人使用!')
      if (userEmail) throw new Error('email 已重複註冊!')
      // 創建新使用者
      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name,
        email,
        // avatar: avatar || `https://loremflickr.com/320/320/headshot/?random=${Math.random() * 100}`,
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
      delete user.password
      delete user.isAdmin
      // jwt
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
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
      nest: true,
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('此使用者不存在!')
        delete user.password
        delete user.isAdmin
        return res.json({
          status: 'success',
          data: user
        })
      })
      .catch(err => next(err))
  },
  editUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const currentUser = getUser(req)
      // 檢查點擊的使用者
      if (Number(userId) !== currentUser.id) throw new Error('無權限修改其他使用者資料')
      const { name, email, password, checkPassword } = req.body
      const { Avatar } = req.files || {}
      // 檢查表單欄位
      if (name?.trim().length === 0 || email?.trim().length === 0 || password?.trim().length === 0) throw new Error('還有欄位沒填')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不一樣!')
      if (name && name.length > 50) throw new Error('暱稱上限50字!')

      const [user, userEmail, filePathAvatar] = await Promise.all([
        User.findByPk(userId),
        email ? User.findOne({ where: { email } }) : Promise.resolve(null),
        Avatar ? imgurFileHandler(Avatar[0]) : Promise.resolve(null)
      ])

      if (userEmail && userEmail?.toJSON().email === user.email) throw new Error('信箱已經註冊過!')
      const updateUser = await user.update({
        name,
        email,
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
