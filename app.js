// ==========================================================================
// UnorderedList
// ==========================================================================


// Init
// --------------------------------------------------------------------------

var express        = require('express'),
    app            = express(),
    server         = require('http').createServer(app),
    io             = require('socket.io').listen(server),
    mongoose       = require('mongoose');


// Connect
// --------------------------------------------------------------------------

server.listen(3000);

mongoose.connect('mongodb://localhost/ul', function (err) {
  if(err) {
    console.error(err);
  } else {
    console.log('...Connected to mongodb');
  }
});


// Schema
// --------------------------------------------------------------------------

var listSchema = mongoose.Schema({
                   name: String,
                   items: [{
                     body: String,
                     active: Boolean,
                     id: mongoose.Schema.Types.ObjectId,
                     added: { type: Date, default: Date.now }
                   }],
                   date: { type: Date, default: Date.now }
                 }),
          List = mongoose.model('List', listSchema);


// Config
// --------------------------------------------------------------------------

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));


// Events
// --------------------------------------------------------------------------

io.sockets.on('connection', function (socket) {

  // user connected
  console.log('User Connected - ' + new Date());

  // load list
  socket.on('load list', function (data) {
    List.find({ 'name' : data }, function (err, doc) {
      if(err) {
        console.error(err);

      // create new
      } else if (!doc.length) {
        var new_list = new List({ name: data });
        new_list.save( function (err) {
          if (err) {
            console.error(err);

          } else {
            socket.list_name = data;
            socket.emit('new list');
          }
        });

      // load history
      } else {
        socket.list_name = data;
        List.find({ name: socket.list_name }, function (err, docs) {
          if(err) {
            console.error(err);

          } else {
            socket.emit('load list', docs[0].items);
          }
        });
      }
    });
  });

  // add item
  socket.on('add item', function (data) {
    List.findOne({ name: socket.list_name }, function (err, doc) {
      if(err) {
        console.error(err);

      // save + update
      } else {

        // TODO Check if item exists first...

        data = {
          body: data,
          active: true,
          itemId: new mongoose.Types.ObjectId,
          added: new Date
        };
        doc.items.push(data);
        doc.save( function (err) {
          if(err) {
            console.error(err);
          } else {
            io.sockets.emit('add item', data);
          }
        });
      }
    });
  });

  // TODO disconnect

});
