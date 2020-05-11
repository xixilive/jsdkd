const fetch = require('node-fetch');
const BASE = 'https://api.weixin.qq.com/cgi-bin'

// token response:
// {"access_token":"ACCESS_TOKEN","expires_in":7200}

module.exports = function(){
  return {
    async getAccessToken(appId, appSecret){
      const url = `${BASE}/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
      const res = await fetch(url).then(res => res.json()).catch((error) => ({error: String(error)}))
      return res.access_token ? res : Promise.reject(res)
    },

    async getTicket(accessToken){
      const token = accessToken['access_token'] || accessToken
      const url = `${BASE}/ticket/getticket?access_token=${token}&type=jsapi`
      const res = await fetch(url).then(res => res.json()).catch((error) => ({error: String(error)}))
      return res.ticket ? res : Promise.reject(res)
    }
  }
}
