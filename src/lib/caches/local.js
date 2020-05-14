module.exports = function localCache(store){
  const getTick = (offset = 0) => {
    return Math.floor((Date.now() + offset * 1000) / 1000)
  }

  return {
    name: store.name,
    async get(key){
      const item = await store.getItem(key).catch(() => null)
      if(item && item.__expires >= getTick()){
        return item.value
      }
    },

    // ttl in seconds
    async put(key, value, ttl = 7200){
      const __expires = getTick(ttl)
      const item = await store.setItem(key, Object.assign({}, {value, __expires})).catch(() => null)
      return !!item
    }
  }
}