const crypto = require('crypto')
const debug = require('debug')('jsdkd:middleware:challenge')
const {httpError} = require('./utils')

module.exports = function challenge(req, res, next) {
  const appid = req.get('x-wechat-appid')
  const {signature, timestamp, nonce, echostr} = req.query

  if(!appid || !signature) {
    debug('missing appid and signature, skip challenge middleware')
    return next()
  }

  debug('challenge middleware, appid=%s', appid)

  const wxapp = req.jsdkd.config.getApp(appid)
  if(!wxapp || !wxapp.token) {
    return next(httpError(500, 'token missing'))
  }

  const s = [wxapp.token, timestamp, nonce].map(s => String(s)).sort().join('')
  const sign = crypto.createHash('sha1').update(s).digest('hex')

  if(sign !== signature) {
    return next(httpError(500, 'invalid signature'))
  }

  res.type('text/plain').send(echostr)
}