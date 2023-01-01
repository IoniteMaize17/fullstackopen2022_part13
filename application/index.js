const express = require('express')
const app = express()
const { errorHandler, unknownEndpoint, tokenExtractor } = require('./util/middleware')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogRouter = require('./controllers/blog')
const authorRouter = require('./controllers/author')
const readingListRouter = require('./controllers/reading-list')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')

app.use(express.json())
app.use(tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readingListRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)

app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()