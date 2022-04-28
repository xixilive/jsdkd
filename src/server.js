const port = parseInt(process.env.SERVER_PORT, 10) || 3030
require('./app').listen(port, () => console.log('server start at :', port))
