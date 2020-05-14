const {readFile, writeFile} = require('fs').promises

module.exports = function fileStore(jsonFile) {
  if('string' !== typeof jsonFile || jsonFile.trim() === '') {
    throw new Error('argument must be path string')
  }
  
  let data, loaded = false

  const load = async () => {
    if(loaded) {
      return data || {}
    }
    try {
      data = await readFile(jsonFile, 'utf-8')
      data = JSON.parse(data)
    }catch(e){
      data = {}
    }
    loaded = true
    return data || {}
  }

  const dump = async () => {
    await writeFile(jsonFile, JSON.stringify(data), 'utf-8')
    return true
  }

  return {
    name: 'file',
    async getItem(key) {
      const cache = await load()
      return cache[key]
    },
    
    async setItem(key, value) {
      const cache = await load()
      cache[key] = value
      return await dump()
    }
  }
}