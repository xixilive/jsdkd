const path = require('path')
const fetch = require('node-fetch')
const {createHash} = require('crypto')

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

describe('e2e', () => {
  beforeAll(testServer.start)
  afterAll(testServer.stop)

  it('GET /ping', async () => {
    const res = await http.get('/ping')
    expect(typeof res.pong).toEqual('number')
  })

  it('GET /MP_verify_randomString.txt', async () => {
    const res = await http.get('/MP_verify_randomString.txt')
    expect(res).toEqual('randomString')
  })

  it('POST /jsapi/config/dummy_app_key', async () => {
    const res = await http.post('/jsapi/config/dummy_app_key', {any: 'data'})
    expect(res.appId).toEqual('dummy_app_key')
    expect(typeof res.timestamp).toBe('number')
    expect(typeof res.nonceStr).toBe('string')
    expect(typeof res.signature).toBe('string')
    expect(res.any).toEqual('data')
  })

  it('GET /jsapi/query/token', async () => {
    const qs = `realm=dummy_realm_key&nonce=nonce&ts=${Date.now()}`
    const sign = createHash('md5').update(qs + '.dummy_realm_secret').digest('hex')
    const res = await http.get(`/jsapi/query/token?appid=dummy_app_key&${qs}&sign=${sign}`)
    expect(res).toEqual({key: 'token', value: 'access_token'})
  })

  it('GET /jsapi/query/ticket', async () => {
    const qs = `realm=dummy_realm_key&nonce=nonce&ts=${Date.now()}`
    const sign = createHash('md5').update(qs + '.dummy_realm_secret').digest('hex')
    const res = await http.get(`/jsapi/query/ticket?appid=dummy_app_key&${qs}&sign=${sign}`)
    expect(res).toEqual({key: 'ticket', value: 'ticket'})
  })

})