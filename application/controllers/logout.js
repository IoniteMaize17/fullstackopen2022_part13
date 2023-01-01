const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const { userExtractor } = require('../util/middleware')

const { SECRET } = require('../util/config')
const { User, ActiveSession } = require('../models')

router.delete('/', userExtractor, async (request, response) => {
  const ass = await ActiveSession.findOne({
    where: {
      token: request.token,
      userId: request.user.id
    }
  });
  if (ass) {
    await ass.destroy();
    response
    .status(200).end();
  } else {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
})

module.exports = router