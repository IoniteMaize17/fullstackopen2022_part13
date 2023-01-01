const { Op } = require("sequelize");
const router = require('express').Router()
const { userExtractor, blogFinder } = require('../util/middleware')
const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      [Op.or]: {
        title: {
          [Op.like]: req.query.search ? `%${req.query.search}%` : '%',
        },
        author: {
          [Op.like]: req.query.search ? `%${req.query.search}%` : '%',
        }
      }
    },
    order: [
      ['likes', 'DESC'],
    ]
  })
  res.json(blogs)
})

router.post('/', userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      userId: req.user.id
    })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', blogFinder, userExtractor, async (req, res) => {
  if (req.blog && req.blog.userId === req.user.id) {
    await req.blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router