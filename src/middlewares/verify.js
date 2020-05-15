const debug = require('debug')('jssdk:verify')
module.exports = function(diff = 3e5){ // 5 min
  return (req, res, next) => {
    const {verifyRealmSign, config} = req.jsdkd
    const {realm: realmKey, nonce, ts, sign} = req.query
    const realm = config.getRealm(realmKey)
    if(!realm) {
      debug(`unknown realm: ${realmKey}`)
      return next('unknown realm')
    }
  
    const _ts = parseInt(ts, 10) || 0, now = Date.now()
    if(diff > 0 && Math.abs(_ts - Date.now()) > diff) {
      debug(`timestamp expired: ${_ts}, now is: ${now}`)
      return next('bad timestamp')
    }
  
    if(verifyRealmSign(realm.key, `realm=${realmKey}&nonce=${nonce}&ts=${ts}`, sign) !== true){
      return next('invalid signature')
    }
    
    next()
  }
}