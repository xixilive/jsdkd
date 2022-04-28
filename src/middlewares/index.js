const cors = require('./cors')
const verify = require('./verify')
const config = require('./config')
const query = require('./query')
const challenge = require('./challenge')

module.exports = {
  cors, verify, config, query, challenge,
  pong: (_, res) => res.json({pong: Date.now()}),
  echo: (req, res) => {
    res.set('Content-Type', 'text/plain').end(req.params[0])
  }
}