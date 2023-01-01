const Sequelize = require('sequelize')
const sequelize = require('../util/db')
const bcrypt = require('bcrypt')
const router = require('express').Router()

const { User, Blog, UserReadingBlogs } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'disabled'] },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { 
          exclude: ['userId', 'createdAt', 'updatedAt']
        },
        through: {
          attributes: []
        },
        include: [
          {
            model: UserReadingBlogs,
            as: 'readingLists',
            attributes: ['id', 'read']
          }
        ]
      }
    ]
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const listBlog = await UserReadingBlogs.findAll({
    where: Object.prototype.hasOwnProperty.call(req.query, 'read') ? {
      userId: req.params.id,
      read: req.query.read
    } : {
      userId: req.params.id
    },
    attributes: ['blogId']
  })
  const blogs = await Blog.findAll({
    where: {
      id: {
        [Sequelize.Op.in]: listBlog.map(m => m.blogId)
      }
    }
  })
  res.json(blogs)
});

router.post('/', async (req, res, next) => {
  try {
    const user_obj = { ...req.body }
    if (user_obj.password && user_obj.password.length > 0) {
      const saltRounds = 10
      user_obj.password = await bcrypt.hash(user_obj.password, saltRounds)
    }
    const user = await User.create(user_obj)
    res.json(user)
  } catch (error) {
    next(error);
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username
      }
    })
    if (user) {
      user.username = req.body.username ? req.body.username : user.username;
      user.name = req.body.name ? req.body.name : user.username;
      if (req.body.password && req.body.password.length) {
        user.password = await bcrypt.hash(req.body.password, saltRounds)
      }
      await user.save();
      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error);
  }
})

module.exports = router