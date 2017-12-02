var app  = require('express')()
var http = require('http').Server(app)
var io   = require('socket.io')(http)

app.get('/', function(req, res){
  res.sendfile('index.html')
})

io.on('connection', function(server){
  console.log('user connected')
  server.on('disconnect', function(){
    console.log('user disconnected')
  })
  server.on('chat_msg', function(msg){
    io.emit('chat_msg', msg)
  })
})

var port = process.env.PORT || process.env.LITMIS_PORT_DEVELOPMENT
http.listen(port, function(){
  console.log('Running on ' + port)
})