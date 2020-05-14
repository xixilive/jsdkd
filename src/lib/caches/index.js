const local = require('./local')
const redis = require('./redis')

const instances = {}
module.exports = function createCache(type, options) {
  switch(type) {
  case 'redis':
    return instances['redis'] || (instances['redis'] = redis(options))
  default:
    return instances['local'] || (instances['local'] = local(options))
  }
}