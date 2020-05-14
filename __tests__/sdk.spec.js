const createSdk = require('../src/lib/sdk')
const createCache = require('../src/lib/caches')
const createStore = require('../src/lib/stores')

const memoCache = {}

const mockCache = {
  get: jest.fn(() => Promise.resolve('')),
  put: jest.fn(() => Promise.resolve(''))
}

const mockStore = {
  getItem: jest.fn(() => Promise.resolve('')),
  setItem: jest.fn(() => Promise.resolve(true))
}

jest.mock('../src/lib/caches', () => jest.fn(() => mockCache))
jest.mock('../src/lib/stores', () => jest.fn(() => mockStore))

const config = {
  apps: [
    {key: 'key', secret: 'secret'}
  ],
  realms: [
    {key: 'key', secret: 'secret'}
  ],
  cache: {type: 'memo', options: memoCache}
}
config.getApp = jest.fn(() => config.apps[0])
config.getRealm = jest.fn(() => config.realms[0])

describe('sdk', () => {
  const sdk = createSdk(config)

  afterAll(() => {
    expect(createStore).toHaveBeenCalledWith('memo', memoCache)
    expect(createCache).toHaveBeenCalledWith('memo', mockStore)
    expect(createStore).toHaveBeenCalledTimes(1)
    expect(createCache).toHaveBeenCalledTimes(1)
  })

  afterEach(() => {
    mockCache.get.mockClear()
    mockCache.put.mockClear()
    mockStore.getItem.mockClear()
    mockStore.setItem.mockClear()
    config.getApp.mockClear()
    config.getRealm.mockClear()
  })

  it('members', () => {
    expect(sdk.config).toEqual(config)
  })

  it('getAccessToken', async () => {
    const token = await sdk.getAccessToken('key', 'secret')
    expect(token).toEqual('access_token')
    expect(mockCache.get).toHaveBeenCalledWith('key.token')
    expect(mockCache.put).toHaveBeenCalledWith('key.token', 'access_token', 7200)
  })

  it('getTicket', async () => {
    const ticket = await sdk.getTicket('key', 'secret')
    expect(ticket).toEqual('ticket')
    expect(mockCache.get).toHaveBeenCalledWith('key.ticket')
    expect(mockCache.put).toHaveBeenCalledWith('key.ticket', 'ticket', 7200)
  })

  it('createConfig', async () => {
    const data = await sdk.createConfig('key', 'secret', {any: 'data'})
    expect(data.appId).toEqual('key')
    expect(data.any).toEqual('data')
    expect(typeof data.timestamp).toBe('number')
    expect(typeof data.nonceStr).toBe('string')
    expect(typeof data.signature).toBe('string')
  })

  it('verifyRealmSign', () => {
    const payload = 'realm=key&nonce=c3554025c6c0ac5b&ts=1589436449'
    const sign = '59c9391f52d908799e1e83e446cfacab'
    expect(sdk.verifyRealmSign('key', payload, sign)).toEqual(true)
    expect(config.getRealm).toHaveBeenCalledWith('key')

    expect(sdk.verifyRealmSign()).toEqual(false)
    expect(sdk.verifyRealmSign('key')).toEqual(false)
    expect(sdk.verifyRealmSign('key', '', sign)).toEqual(false)
    expect(sdk.verifyRealmSign('key', payload, '')).toEqual(false)
  })
})