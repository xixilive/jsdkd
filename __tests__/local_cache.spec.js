const localCache = require('../src/lib/caches/local')

const store = {
  getItem: jest.fn(() => Promise.resolve({value: 'bar', __expires: Date.now() + 864e5})),
  setItem: jest.fn(() => Promise.resolve(true))
}

const wait = async (seconds) => new Promise((resolve) => {
  setTimeout(resolve, seconds * 1000)
})

describe('local cache', () => {
  const cache = localCache(store)
  it('get', async () => {
    const val = await cache.get('foo')
    expect(store.getItem).toHaveBeenCalledWith('foo')
    expect(val).toEqual('bar')
  })

  it('put', async () => {
    const ts = Date.now(), ttl = 100
    const expires = Math.floor((ts + ttl * 1000) / 1000)
    await cache.put('foo', 'bar', ttl)
    expect(store.setItem).toHaveBeenCalledWith('foo', {value:'bar', __expires: expires})
  })

  it('expires', async () => {
    await wait(1)
  })
})