const FileStore = require('./file')
const MemoStore = require('./memo')

const instances = {}
module.exports = function createStore(type, options) {
  switch(type) {
  case 'file':
    return instances['file'] || (instances['file'] = FileStore(options))
  default:
    return instances['memo'] || (instances['memo'] = MemoStore(options))
  }
}