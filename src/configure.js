const path = require('path')
const debug = require('debug')('jssdk:configure')
const {createSdk, Config} = require('./lib')
const cors = require('./middlewares/cors')
const router = require('./router')

module.exports = function configure(app) {
  const file = process.env.APP_CONFIG || path.join(__dirname, '..', 'config.json')
  debug(`load config from: ${file}`)
  const config = Config.load(file)
  const sdk = createSdk(config)
  app.use(cors(config))

  app.use((req, _, next) => {
    req.wxjssdk = sdk
    next()
  })

  app.use('/', router(config))
}