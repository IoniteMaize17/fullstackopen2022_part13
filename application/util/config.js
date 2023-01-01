require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.AUTH_SECRET || 'RZDurOVpscuEnNKPma3iZ3YsdZPMAPbD'
}