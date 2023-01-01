const Blog = require('./blog')
const User = require('./user')
const UserReadingBlogs = require('./user_reading_blog')
const ActiveSession = require('./active_sessions')

User.hasMany(Blog)
User.hasMany(ActiveSession)
ActiveSession.belongsTo(User)
Blog.belongsTo(User)

User.belongsToMany(Blog, { as: 'readings', through: UserReadingBlogs })
Blog.belongsToMany(User, { as: 'readers', through: UserReadingBlogs })

User.hasMany(UserReadingBlogs, { as: 'readerList'})
Blog.hasMany(UserReadingBlogs, { as: 'readingLists', foreignKey: 'user_id'})

module.exports = {
  Blog, User, UserReadingBlogs, ActiveSession
}