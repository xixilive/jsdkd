module.exports = function memoStore(initData) {
  const data = Object.assign({}, initData)
  return {
    name: 'memo',
    async getItem(key) {
      return data[key]
    },
    
    async setItem(key, value) {
      data[key] = value
      return true
    }
  }
}