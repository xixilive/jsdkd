const assert = require('assert')
const path = require('path')
const fs = require('fs')

const jsconfig = require('./middlewares/jsconfig')

const loadConfig = () => {
  const configFile = process.env.APP_CONFIG || path.join(__dirname, '..', 'config.json')
  const data = fs.readFileSync(configFile, 'utf-8')
  const config = JSON.parse(data)
  assert(config && Array.isArray(config.apps) && config.apps.length > 0, 'invalid config')
  return config
}

module.exports = function configure(app) {
  const config = loadConfig()

  // GET /MP_verify_*
  app.get(/\/MP_verify_([\w]+?)\.txt$/i, (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.end(req.params[0]);
  })

  // POST /jsconfig/:appid
  app.post('/jsconfig/:appid', jsconfig(config))
}