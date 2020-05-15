const httpError = (code, message) => {
  return Object.assign(new Error(message), {code})
}
module.exports = {
  httpError
}