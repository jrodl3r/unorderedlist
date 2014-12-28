
var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

io.sockets.on('connection', function(socket){
  socket.on('add pastey', function(data){
    io.sockets.emit('add pastey', data);
  });
});
