const memoStore = require('../src/lib/stores/memo')

describe('memo store', () => {
  const store = memoStore()

  beforeEach(async () => {
    await store.setItem('foo', 'bar')
    expect(await store.getItem('foo')).toEqual('bar')
  })

  it('getItem', async () => {
    let val = await store.getItem('foo')
    expect(val).toEqual('bar')
    val = await store.getItem('bar')
    expect(val).toEqual(undefined)
  })

  it('setItem', async () => {
    const result = await store.setItem('baz', 'foo')
    expect(result).toEqual(true)
    const val = await store.getItem('baz')
    expect(val).toEqual('foo')
  })
})