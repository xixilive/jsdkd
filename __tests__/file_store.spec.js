const fs = require('fs')

jest.mock('fs', () => {
  return {
    promises: {
      readFile: jest.fn(() => Promise.resolve('{"foo":"bar"}')), 
      writeFile: jest.fn(() => Promise.resolve())
    }
  }
})

const fileStore = require('../src/lib/stores/file')

describe('file store', () => {
  afterEach(() => {
    fs.promises.readFile.mockClear()
    fs.promises.writeFile.mockClear()
  })

  it('should throw given invalid file path', () => {
    const errMsg = 'must be path string'
    expect(() => fileStore()).toThrow(errMsg)
    expect(() => fileStore(null)).toThrow(errMsg)
    expect(() => fileStore(0)).toThrow(errMsg)
    expect(() => fileStore([])).toThrow(errMsg)
    expect(() => fileStore({})).toThrow(errMsg)
  })

  it('getItem', async () => {
    let store = fileStore('file.json')
    let val = await store.getItem('foo')
    expect(val).toEqual('bar')
    await store.getItem('foo')
    await store.getItem('foo')
    expect(fs.promises.readFile).toHaveBeenCalledWith('file.json', 'utf-8')
  })

  it('setItem', async () => {
    let store = fileStore('file.json')
    const result = await store.setItem('foo', 'baz')
    expect(result).toEqual(true)
    let val = await store.getItem('foo')
    expect(val).toEqual('baz')
    expect(fs.promises.readFile).toHaveBeenCalledWith('file.json', 'utf-8')
    expect(fs.promises.readFile).toHaveBeenCalledTimes(1)
    expect(fs.promises.writeFile).toHaveBeenCalledWith('file.json', '{"foo":"baz"}', 'utf-8')
    expect(fs.promises.writeFile).toHaveBeenCalledTimes(1)
  })
})