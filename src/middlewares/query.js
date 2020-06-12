const {httpError} = require('./utils')

const allowedKeys = ['token', 'ticket']
module.exports = (req, res, next) => {
  const {appid} = req.params
  const {key = 'token'} = req.query
  if(!allowedKeys.includes(key)) {
    return next(httpError(400, 'unknown key'))
  }
  
  const {getAccessToken, getTicket, config} = req.jsdkd
  const app = config.getApp(appid)
  if(!app) {
    return next(httpError(400, 'unknown app'))
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
}