const redis = require('redis')
const {promisify} = require('util')

module.exports = function redisCache (options) {
  const client = redis.createClient(options)
  const get = promisify(client.get).bind(client)
  const setex = promisify(client.setex).bind(client)
  
  return {
    name: 'redis',
    async get(key) {
      const value = await get(key).catch(() => null)
      if(value) {
        return JSON.parse(value)
      }
    },
    
    async put(key, value, ttl) {
      await setex(key, ttl, JSON.stringify(value)).catch(() => null)
      return true
    }
  }
}