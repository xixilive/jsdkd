const path = require('path')
const debug = require('debug')('jsdkd:configure')
const {Sdk, Config} = require('@ultramedia/jssdk')
const middlewares = require('./middlewares')

module.exports = function configure(app) {
  const file = process.env.APP_CONFIG || path.join(__dirname, '..', 'jsdkd.json')
  debug(`load config from: ${file}`)
  const config = Config.load(file)
  debug(`use cache strategy: ${config.cache.type}`)
  const sdk = Sdk(config)

  app.use(middlewares.cors(config))
  app.use((req, _, next) => {
    req.jsdkd = {...sdk, config}
    next()
  })

  // GET /ping
  app.get('/ping', middlewares.pong)

  // GET /MP_verify_*
  app.get(/\/MP_verify_([\w]+?)\.txt$/i, middlewares.echo)

  // POST /jsapi/config/:appid
  app.post('/jsapi/:appid/config', middlewares.config)

  // GET /jsapi/:appid/query?key=[token,ticket]&realm=&nonce=&ts=&sign=
  app.get('/jsapi/:appid/query', middlewares.verify(3e5), middlewares.query)
}