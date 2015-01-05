// init server
var express  = require('express'),
    app      = express(),
    server   = require('http').createServer(app).listen(3000, '0.0.0.0'),
    io       = require('socket.io').listen(server),
    mongoose = require('mongoose');


// init mongodb
mongoose.connect('mongodb://localhost/ul', function(err){
  if(err) {
    console.log(err);
  } else {
    console.log('...Connected to mongodb');
  }
});

var ul_schema = mongoose.Schema({
                  item: String,
                  time: { type: Date, default: Date.now }
                }),
     ul_model = mongoose.model('UL', ul_schema);


// config routes/paths
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));


// config i/o
io.sockets.on('connection', function(socket){

  // load history
  ul_model.find({}, function(err, docs){
    if(err) {
      console.log(err);
    }
    socket.emit('load history', docs);
  });

  // add item
  socket.on('add item', function(data){
    var new_item = new ul_model({ item: data });
    new_item.save(function(err) {
      if(err) {
        console.log(err);
      }
      io.sockets.emit('add item', data);
    });
  });
});
