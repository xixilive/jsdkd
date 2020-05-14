const path = require('path')
const Config = require('../src/lib/config')
const dummy = require('./config.dummy.json')

describe('config', () => {
  it('load from file', () => {
    const config = Config.load(path.join(__dirname, 'config.dummy.json'))
    expect(config.apps).toEqual(dummy.apps)
    expect(config.realms).toEqual(dummy.realms)
    expect(config.getApp('dummy_app_key')).toEqual(dummy.apps[0])
    expect(config.getRealm('dummy_realm_key')).toEqual(dummy.realms[0])
    expect(config.cache).toEqual({type: 'memo', options: {}})
  })

  it('create from object', () => {
    let data = JSON.parse(JSON.stringify(dummy))
    let config = Config(data)
    expect(config.isAllowedOrigin('http://127.0.0.1')).toEqual(true)
    expect(config.isAllowedOrigin('http://192.168.0.1')).toEqual(true)
    expect(config.isAllowedOrigin('http://10.0.0.1')).toEqual(true)
    expect(config.isAllowedOrigin('http://172.16.0.1')).toEqual(true)
    expect(config.isAllowedOrigin('http://example.com')).toEqual(true)
    expect(config.isAllowedOrigin('http://example2.com')).toEqual(false)

    config = Config({...data, cors: '*', cache: null})
    expect(config.isAllowedOrigin('http://example2.com')).toEqual(true)
    expect(config.cache).toEqual({type: 'memo', options: {}})
  })
})