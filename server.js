var http = require('http');
var port = process.env.LITMIS_PORT_DEVELOPMENT;

http.createServer(function(req, res) {  
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('Hello World')
}).listen(port, '0.0.0.0');

console.log('Server running at http://spaces.litmis.com:%d\ncrtl+c for exit', port)