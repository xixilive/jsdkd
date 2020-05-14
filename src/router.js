const debug = require('debug')('jssdk:router')
const Router = require('express')
const verify = require('./middlewares/verify')

const httpError = (code, message) => {
  return Object.assign(new Error(message), {code})
}

module.exports = function(config) {
  const router = Router()

  router.get('/ping', (_, res) => {
    res.json({pong: Date.now()})
  })

  // GET /MP_verify_*
  router.get(/\/MP_verify_([\w]+?)\.txt$/i, (req, res) => {
    res.set('Content-Type', 'text/plain')
    res.end(req.params[0])
  })

  // POST /jsconfig/:appid
  router.post('/jsapi/config/:appid', (req, res, next) => {
    const {appid} = req.params
    const {createConfig} = req.wxjssdk
    const wxapp = config.getApp(appid)

    if(!wxapp) {
      return next(httpError(404, `unknown app: ${appid}`))
    }
    
    createConfig(wxapp.key, wxapp.secret, req.body)
      .then(data => res.json(data))
      .catch(err => {
        debug('createConfig failed', err)
        next(httpError(500, 'create config failed'))
      })
  })

  // GET /query/:key?appid=&realm=&nonce=&ts=&sign=
  const allowedKeys = ['token', 'ticket']
  router.get('/jsapi/query/:key', verify(3e5), (req, res, next) => {
    const {key} = req.params
    if(!allowedKeys.includes(key)) {
      return next(httpError(400, 'unknown key'))
    }
    
    const {getAccessToken, getTicket, config} = req.wxjssdk
    const app = config.getApp(req.query.appid)
    if(!app) {
      return next(httpError(404, 'unknown app'))
    }

    let task = null
    switch(key) {
    case 'token':
      task = getAccessToken(app.key, app.secret)
      break
    case 'ticket':
      task = getTicket(app.key, app.secret)
      break
    default:
      break
    }

    if(!task) {
      return next(httpError(500, 'query failed'))
    }
    
    task.then(value => res.json({key, value}))
  })

  return router
}