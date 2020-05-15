const debug = require('debug')('jsdkd:middleware:config')
const {httpError} = require('./utils')

module.exports = (req, res, next) => {
  const {appid} = req.params
  const {createConfig, config} = req.jsdkd
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
}