const assert = require('assert')
const fs = require('fs')

const validate = (config) => {
  return config && Array.isArray(config.apps) && config.apps.length > 0 
    && Object.keys(config.cache).length > 0
}

const normalizeConfig = (config) => {
  if('string' === typeof config.cors) {
    config.cors = [config.cors]
  }

  if(!Array.isArray(config.cors)) {
    config.cors = []
  }

  if(!Array.isArray(config.realms)) {
    config.realms = []
  }
  
  config.cache = Object.assign({}, config.cache)
  if(Object.keys(config.cache).length === 0) {
    Object.assign(config.cache, {memo: {}})
  }
  return config
}

function Config(data) {
  const config = normalizeConfig(data)
  assert(validate(config), 'invalid config')
  return {
    get apps(){ return config.apps },
    get realms(){ return config.realms },
    get cache(){
      const [type] = Object.keys(config.cache).slice(0,1)
      return {type, options: config.cache[type]}
    },
    getApp(appid) {
      return config.apps.find(x => x.key === appid)
    },

    getRealm(key) {
      return config.realms.find(x => x.key === key)
    },
    
    isAllowedOrigin(origin) {
      if(config.cors.length === 0 || config.cors.includes('*')) {
        return true
      }
      if(/^https?:\/\/(0\.0\.|127\.0|192\.168\.|172\.16\.|10\.)/.test('' + origin)){
        return true
      }
      return !!config.cors.find(pattern => new RegExp(pattern, 'i').test(origin))
    }
  }
}

Config.load = function(file) {
  if('string' !== typeof file) {
    throw new Error('file must be string')
  }
  const data = fs.readFileSync(file, 'utf-8')
  return Config(JSON.parse(data))
}

module.exports = Config