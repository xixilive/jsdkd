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