const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { getUser } = require('../_helpers')
const jwt = require('jsonwebtoken')

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck, avatar } = req.body
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
        avatar: avatar || `https://loremflickr.com/320/320/headshot/?random=${Math.random() * 100}`,
        password: hash
      })
      const user = newUser.toJSON()
      delete newUser.password
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
  }
}

module.exports = {
  userController
}
