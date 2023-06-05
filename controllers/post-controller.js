const { Post, User, Favorite } = require('../models')
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
      .then(posts => res.json({ status: 'success', data: posts }))
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
        if (!post) return res.status(404).json({ status: 'error', message: '此貼文不存在' })
        return res.json({
          status: 'success',
          data: post
        })
      })
      .catch(err => next(err))
  },
  post: async (req, res, next) => {
    const { title, post } = req.body
    if (!title || title.trim().length === 0) return res.status(404).json({ status: 'error', message: '標題不可空白' })
    if (!post || post.trim().length === 0) return res.status(404).json({ status: 'error', message: '內容不可空白' })
    if (title.length > 40) return res.status(404).json({ status: 'error', message: '標題超過字數上限40' })
    if (post.length > 1000) return res.status(404).json({ status: 'error', message: '內容超過字數上1000' })
    const { image } = req.files || {}
    const [imageFilePath] = await Promise.all([
      image ? imgurFileHandler(image[0]) : null
    ])

    Post.create({
      title,
      post,
      image: imageFilePath,
      userId: getUser(req) ? getUser(req).id : req.user.id
    })
      .then(newPost => {
        return res.json({
          status: 'success',
          data: newPost
        })
      })
      .catch(err => next(err))
  },
  favoritePost: (req, res, next) => {
    Promise.all([
      Post.findByPk(req.params.id),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          postId: req.params.id
        }
      })
    ])
      .then(([post, favorite]) => {
        if (!post) return res.status(404).json({ status: 'error', message: '此貼文不存在' })
        if (favorite) return res.status(404).json({ status: 'error', message: '你已經收藏過此篇貼文！' })

        return Favorite.create({
          userId: req.user.id,
          postId: req.params.id
        })
      })
      .then(result => res.json({
        status: 'success',
        data: result
      }))
      .catch(err => next(err))
  },
  removeFavoritePost: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        postId: req.params.id
      }
    })
      .then(favorite => {
        if (!favorite) return res.status(404).json({ status: 'error', message: '並未收藏此貼文..' })
        favorite.destroy()
        return res.json({
          status: 'success',
          data: favorite
        })
      })
      .catch(err => next(err))
  },
  deletePost: (req, res, next) => {
    Post.findOne({ where: { id: req.params.id } })
      .then(post => {
        if (!post) return res.status(404).json({ status: 'error', message: '此貼文不存在' })
        if (req.user.id !== post.user_id) return res.status(404).json({ status: 'error', message: '不可刪除不是您的貼文' })
        post.destroy()
      })
      .then(result => res.json({
        status: 'success',
        data: result
      }))
      .catch(err => next(err))
  }
}

module.exports = postController
