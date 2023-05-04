const { Post, User } = require('../models')
const { getUser } = require('../_helpers')
const imgurFileHandler = require('../helpers/file-helpers')

const postController = {
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
      .then(posts => res.json({ data: posts }))
      .catch(err => next(err))
  },
  getPost: (req, res, next) => {
    Post.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: {
          exclude: ['password', 'isAdmin', 'createdAt', 'updatedAt', 'email']
        }
      }]
    })
      .then(post => {
        if (!post) throw new Error('此貼文不存在')
        return res.json({
          status: 'success',
          data: post
        })
      })
      .catch(err => next(err))
  },
  post: async (req, res, next) => {
    const { title, post } = req.body
    if (!title || title.trim().length === 0) throw new Error('標題不可空白')
    if (!post || post.trim().length === 0) throw new Error('內容不可空白')
    if (title.length > 20) throw new Error('標題超過字數上限20')
    if (post.length > 140) throw new Error('內容超過字數上限140')
    const { Image } = req.files || {}
    const [imageFilePath] = await Promise.all([
      Image ? imgurFileHandler(Image[0]) : null
    ])

    Post.create({
      title,
      post,
      image: imageFilePath,
      userId: getUser(req) ? getUser(req).id : req.user.id
    }
    )
      .then(newPost => res.json({
        status: 'success',
        data: newPost
      }))
      .catch(err => next(err))
  }
}

module.exports = postController
