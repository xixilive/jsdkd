const port = parseInt(process.env.SERVER_PORT || '3030', 10) || 3030
require('./app').listen(port, () => console.log('server start at :', port))
