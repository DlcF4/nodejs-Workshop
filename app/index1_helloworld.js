var express = require('express')
var app = express()

app.get('/', function(req, res) {
  res.send('Hello World! Express');
})

var port = process.env.PORT || process.env.LITMIS_PORT_DEVELOPMENT
app.listen(port, function() {
  console.log('Running on port %d', port)
})