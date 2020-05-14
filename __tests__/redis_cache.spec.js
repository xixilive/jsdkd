const redis = require('redis')
const redisCache = require('../src/lib/caches/redis')

const mockClient = {
  get: jest.fn((key, cb) => cb(null, '"bar"')),
  setex: jest.fn((key, ttl, value, cb) => cb(null, 'OK'))
}

jest.mock('redis', () => {
  return {
    createClient: jest.fn(() => mockClient)
  }
})

describe('redis store', () => {
  const cache = redisCache('options')
  beforeEach(() => {
    expect(redis.createClient).toHaveBeenCalled()
  })

  it('get', async () => {
    const val = await cache.get('foo')
    expect(val).toEqual('bar')
    expect(mockClient.get).toHaveBeenCalledWith('foo', expect.any(Function))
  })

  it('put', async () => {
    await cache.put('foo', 'bar', 100)
    expect(mockClient.setex).toHaveBeenCalledWith('foo', 100, '"bar"', expect.any(Function))
  })
})