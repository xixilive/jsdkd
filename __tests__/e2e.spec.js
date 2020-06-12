const {createHash} = require('crypto')
const {mock} = require('@ultramedia/jssdk')
const {testServer, http} = require('./helper')

describe('e2e', () => {
  let unmock
  beforeAll(async () => {
    unmock = mock()
    await testServer.start()
  })
  
  afterAll(async () => {
    unmock()
    await testServer.stop()
  })

  it('GET /ping', async () => {
    const res = await http.get('/ping')
    expect(typeof res.pong).toEqual('number')
  })

  it('GET /MP_verify_randomString.txt', async () => {
    const res = await http.get('/MP_verify_randomString.txt')
    expect(res).toEqual('randomString')
  })

  it('POST /jsapi/:appid/config', async () => {
    const res = await http.post('/jsapi/dummy_app_key/config', {any: 'data'})
    expect(res.appId).toEqual('dummy_app_key')
    expect(typeof res.timestamp).toBe('number')
    expect(typeof res.nonceStr).toBe('string')
    expect(typeof res.signature).toBe('string')
    expect(res.any).toEqual('data')
  })

  describe('GET /jsapi/:appid/query', () => {
    it('query token by default', async () => {
      const qs = `realm=dummy_realm_key&nonce=nonce&ts=${Date.now()}`
      const sign = createHash('md5').update(qs + '.dummy_realm_secret').digest('hex')
      const res = await http.get(`/jsapi/dummy_app_key/query?${qs}&sign=${sign}`)
      expect(res).toEqual({key: 'token', value: 'access_token'})
    })

    it('query token', async () => {
      const qs = `realm=dummy_realm_key&nonce=nonce&ts=${Date.now()}`
      const sign = createHash('md5').update(qs + '.dummy_realm_secret').digest('hex')
      const res = await http.get(`/jsapi/dummy_app_key/query?key=token&${qs}&sign=${sign}`)
      expect(res).toEqual({key: 'token', value: 'access_token'})
    })

    it('query ticket', async () => {
      const qs = `realm=dummy_realm_key&nonce=nonce&ts=${Date.now()}`
      const sign = createHash('md5').update(qs + '.dummy_realm_secret').digest('hex')
      const res = await http.get(`/jsapi/dummy_app_key/query?key=ticket&${qs}&sign=${sign}`)
      expect(res).toEqual({key: 'ticket', value: 'ticket'})
    })
  })
})