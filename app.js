// init
var express        = require('express'),
    app            = express(),
    server         = require('http').createServer(app),
    io             = require('socket.io').listen(server),
    mongoose       = require('mongoose'),
    list_names     = [];


// connect
server.listen(3000);

mongoose.connect('mongodb://localhost/ul', function (err) {
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

// Schema({
//   name: String,
//   items: [{ body: String,
//             time: { type: Date, default: Date.now }
//          }],
//   date: { type: Date, default: Date.now }
// });



// config
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));


// events
io.sockets.on('connection', function (socket) {

  console.log('User Connected - ' + new Date());

  // load list
  socket.on('load list', function (data, callback) {

    // found list » load it
    if (list_names.indexOf(data) !== -1) {
      callback(false);

    // no list found » create new
    } else {
      callback(true);
      socket.list_name = data;
      list_names.push(socket.list_name);
    }

    console.log(list_names.toString());
  });


  // TODO load history
  // ul_model.find({}, function (err, docs) {
  //   if(err) {
  //     console.log(err);
  //   }
  //   socket.emit('load history', docs);
  // });


  // TODO add item
  // socket.on('add item', function (data) {
  //   var new_item = new ul_model({ item: data });
  //   new_item.save( function (err) {
  //     if(err) {
  //       console.log(err);
  //     }
  //     io.sockets.emit('add item', data);
  //   });
  // });


  // TODO disconnect
});
