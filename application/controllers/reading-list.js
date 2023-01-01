const router = require('express').Router()
const { UserReadingBlogs } = require('../models')
const { readingFinder, userExtractor } = require('../util/middleware');

router.post('/', async (req, res) => {
    try {
      const reading_info = req.body;
      const readingObj = await UserReadingBlogs.create(reading_info)
      res.json(readingObj)
    } catch (error) {
      next(error)
    }
})

router.put('/:id', readingFinder, userExtractor, async (req, res) => {
  try {
    if (req.user_reading_blog.userId === req.user.id) {
      req.user_reading_blog.read = req.body.read;
      await req.user_reading_blog.save()
      res.json(req.user_reading_blog)
    } else {
      res.status(401).send('Authentication');
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router