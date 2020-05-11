module.exports = (store) => {
  const getTick = (offset = 0) => {
    return ~~((Date.now() + offset * 1000) / 1000)
  }

  return {
    async get(key){
      const item = await store.getItem(key).catch(() => null)
      if(item && item.__expires >= getTick()){
        return item.value
      }
    },

    // ttl in seconds
    async put(key, value, ttl = 7200){
      const expires_at = getTick(ttl)
      const item = await store.setItem(key, Object.assign({}, {value, __expires: expires_at})).catch(() => null)
      return !!item
    },

    async remove(key) {
      const result = await store.removeItem(key).catch(() => null)
      return !!result
    }
  }
}