const cors = require('cors')

module.exports = function(config) {
  return cors({
    origin: (origin, cb) => {
      if(!origin || config.isAllowedOrigin(origin)) {
        return cb(null, true)
      }
      return cb('not allowed')
    }
  })
}