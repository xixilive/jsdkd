const path = require('path')
const fetch = require('node-fetch')

process.env.APP_CONFIG = path.join(__dirname, 'config.dummy.json')

const app = require('../src/app')

const testServer = {
  start: async () => {
    return new Promise(resolve => {
      this.server = app.listen(13030, () => {
        console.log('e2e test server started')
        resolve()
      })
    })
  },

  stop: async () => {
    return new Promise(resolve => {
      this.server.close(() => {
        console.log('e2e test server closed')
        resolve()
      })
    })
  }
}

const BASE = 'http://localhost:13030'
const http = {
  get: async (url) => {
    return await fetch(BASE + url).then(res => {
      if(!res.ok) {
        throw new Error('request not ok')
      }
      if(res.headers.get('content-type').indexOf('application/json') !== -1) {
        return res.json()
      }
      return res.text()
    })
  },
  post: async (url, data) => {
    return await fetch(BASE + url, {
      method: 'POST', 
      body: JSON.stringify(data), 
      headers: {'Content-Type': 'application/json'}
    }).then(res => {
      if(!res.ok) {
        throw new Error('request not ok')
      }
      return res.json()
    })
  }
}

module.exports = {
  testServer, http
}