const express = require('express')
const helmet = require('helmet')

const configure = require('./configure')

const app = express()
app.enable('trust proxy')
app.disable('x-powered-by')
app.use(express.json())
app.use(helmet())

configure(app)

// handler errors
app.use((err, req, res, next) => { /* eslint no-unused-vars: 0 */
  console.error(req.path, err)
  res.status(err.code || 500).end()
})

module.exports = app