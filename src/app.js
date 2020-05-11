const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const configure = require('./configure')

const corsOrigin = (origin, cb) => {
  if(!origin || /^https?:\/\/(127|192)\./.test(origin) || /h5\.brainet-ai\.com/i.test(origin)) {
    cb(null, true)
  }else{
    cb('not allowed')
  }
}

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(helmet())
app.use(cors({origin: corsOrigin}))

configure(app)

app.use((req, res,next, err) => {
  res.status(500).end()
})

module.exports = app