const jwt = require('jsonwebtoken')
const { Blog, User, UserReadingBlogs, ActiveSession } = require('../models')
const { SECRET } = require('../util/config')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === "SequelizeUniqueConstraintError") {
    return response.status(400).json({ error: error.errors.map(m => m.message) });
  }
  if (error.name === "SequelizeValidationError") {
    return response.status(400).json({ error: error.errors.map(m => m.message) });
  }
  next(error)

}
const tokenExtractor = (request, response, next) => {
  // code that extracts the token
  request.token = getTokenFrom(request)
  next()
}

const userExtractor = async (request, response, next) => {
  try {
    if (!request.token) response.status(401).json({ error: 'token missing or invalid' })
    const decodedToken = jwt.verify(request.token, SECRET)
    if (!decodedToken.id) {
      response.status(401).json({ error: 'token missing or invalid' })
    } else {
      const user = await User.findByPk(decodedToken.id)
      if (user) {
        request.user = user
        if (user.disabled) {
          return response.status(401).json({
            error: 'account disabled, please contact admin'
          })
        }
        
        const ass = await ActiveSession.findOne({
          where: {
            token: request.token,
            userId: request.user.id
          }
        });

        if (!ass) {
          return response.status(401).json({
            error: 'token missing or invalid'
          })
        }
        next()
      } else {
        response.status(401).json({ error: 'token missing or invalid' })
      }
    }
  } catch (exception) {
    next(exception)
  }
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (req.blog) {
    next()
  } else {
    return res.status(404).end();
  }
}

const readingFinder = async (req, res, next) => {
  req.user_reading_blog = await UserReadingBlogs.findByPk(req.params.id)
  if (req.user_reading_blog) {
    next()
  } else {
    return res.status(404).end();
  }
}
module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  blogFinder,
  readingFinder
}