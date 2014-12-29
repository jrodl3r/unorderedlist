// init server
var express  = require('express'),
    app      = express(),
    server   = require('http').createServer(app),
    io       = require('socket.io').listen(server),
    mongoose = require('mongoose');

server.listen(3000);

// init mongodb
mongoose.connect('mongodb://localhost/pastey', function(err){
  if(err) {
    console.log(err);
  } else {
    console.log('Connected to mongodb');
  }
});

var pastey_schema = mongoose.Schema({
                      item: String,
                      time: { type: Date, default: Date.now }
                    }),
     pastey_model = mongoose.model('Pastey', pastey_schema);

// config routes/paths
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

// config events
io.sockets.on('connection', function(socket){

  // load history
  pastey_model.find({}, function(err, docs){
    if(err) {
      console.log(err);
    }
    socket.emit('load history', docs);
  });

  // add item
  socket.on('add pastey', function(data){
    var new_pastey = new pastey_model({ item: data });
    new_pastey.save(function(err) {
      if(err) {
        console.log(err);
      }
      io.sockets.emit('add pastey', data);
    });
  });
});
