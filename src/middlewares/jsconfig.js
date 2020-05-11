const createSdk = require('../lib/sdk')
const createStore = require('../lib/stores')
const createClient = require('../lib/client')
const createCache = require('../lib/cache')

const store = createStore('memo', {})

module.exports = function(config) {
  const findApp = (appid) => {
    return config.apps.find(x => x.appId === appid)
  }

  const sdk = createSdk(createClient(), createCache(store))

  return async (req, res, next) => {
    const {appid} = req.params
    const wxapp = findApp(appid)
    if(!wxapp) {
      return next(Object.assign(new Error('not found'), {code: 404}))
    }
    console.log(req.body)
    const data = await sdk.createConfig(wxapp.appId, wxapp.appSecret, req.body).catch(err => {
      console.error(err)
    })

    if(!data) {
      return next(Object.assign(new Error('create config failed'), {code: 500}))
    }
    res.json(data)
  }
}