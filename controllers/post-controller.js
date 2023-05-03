const { Post, User } = require('../models')
const { getUser } = require('../_helpers')

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
  post: (req, res, next) => {
    const { title, post, image } = req.body
    if (!post || post.trim().length === 0) throw new Error('內容不可空白')
    if (post.length > 140) throw new Error('字數超過140')
    Post.create({
      title,
      post,
      image: image || 'https://loremflickr.com/320/320/headshot/?random=61.1109824400514',
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
