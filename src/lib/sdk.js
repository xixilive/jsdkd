const {createHash} = require('crypto')

const getTicket = async (appId, appSecret, client, cache) => {
  const ticket_key = `${appId}.jsapi_ticket`
  const token_key = `${appId}.jsapi_access_token`
  let ticket = await cache.get(ticket_key)
  if(ticket) {
    return ticket
  }

  let token = await cache.get(token_key)
  if(!token) {
    token = await client.getAccessToken(appId, appSecret)
    cache.put(token_key, token.access_token, token.expires_in)
  }

  ticket = await client.getTicket(token)
  if(ticket) {
    await cache.put(ticket_key, ticket.ticket, ticket.expires_in)
    return ticket.ticket
  }
}

module.exports = function(client, cache){
  return {
    async createConfig(appId, appSecret, params){
      const options = Object.assign({url: ''}, params)
      const jsapi_ticket = await getTicket(appId, appSecret, client, cache)
      const timestamp = Math.floor(Date.now()/1000)
      const noncestr = createHash('sha256').update(`${timestamp}`).digest('hex')
      const data = {jsapi_ticket, noncestr, timestamp, url: options.url}
      const candidate = Object.keys(data).sort().map(k=>`${k}=${data[k]}`).join('&')
      const signature = createHash('sha1').update(candidate).digest('hex')
      return {...options, appId, timestamp, nonceStr: noncestr, signature}
    }
  }
}
