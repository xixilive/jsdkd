const FileStore = function(jsonFile) {
  return {
    async getItem(key) {
      
    },
    
    async setItem(key, value) {

    },

    async removeItem(key) {

    }
  }
}

const MemoStore = function(initData = {}) {
  return {
    async getItem(key) {
      return initData[key];
    },
    
    async setItem(key, value) {
      initData[key] = value
      return true
    },

    async removeItem(key) {
      delete initData[key]
      return true
    }
  }
}

module.exports = function getStore(type, options) {
  switch(type) {
    case 'file':
      return FileStore(options)
    default:
      return MemoStore(options)
  }
}