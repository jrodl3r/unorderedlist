// ==========================================================================
// UnorderedList
// ==========================================================================
'use strict';

// Config
// --------------------------------------------------------------------------

var express        = require('express'),
    app            = express(),
    favicon        = require('serve-favicon'),
    server         = require('http').createServer(app),
    io             = require('socket.io').listen(server),
    mongoose       = require('mongoose'),
    env            = process.env.NODE_ENV || 'development',
    port           = process.env.PORT || 3000;


// Connect
// --------------------------------------------------------------------------

server.listen(port);

if (env === 'development') {
  mongoose.connect('mongodb://localhost/ul');
} else if (env === 'test') {
  mongoose.connect('mongodb://' + process.env.TEST_MONGOLAB_HOST + '/ul');
} else if (env === 'production') {
  mongoose.connect('mongodb://' + process.env.MONGOLAB_URI + '/ul');
}


// Schema
// --------------------------------------------------------------------------

var listSchema = mongoose.Schema({
                   name: String,
                   items: [{
                     body: String,
                     active: Boolean,
                     _id: mongoose.Schema.Types.ObjectId,
                     added: { type: Date, default: Date.now }
                   }],
                   date: { type: Date, default: Date.now }
                 }),
          List = mongoose.model('List', listSchema);


// Routes
// --------------------------------------------------------------------------

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use(favicon(__dirname + '/favicon.ico'));
app.use('/public', express.static(__dirname + '/public'));

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

      } else {
        data = {
          body: data,
          active: true,
          _id: new mongoose.Types.ObjectId,
          added: new Date
        };
        doc.items.push(data);
        doc.save( function (err) {
          if(err) {
            console.error(err);

          } else {
            io.sockets.emit('add item', data, socket.list_name);
          }
        });
      }
    });
  });

  // remove item (mark inactive)
  socket.on('remove item', function (id) {
    List.update({ 'items._id': id }, { '$set': { 'items.$.active': false } }, function (err) {
      if(err) {
        console.error(err);

      } else {
        io.sockets.emit('remove item', id);
      }
    });
  });

  // user disconnected
  socket.on('disconnect', function () {
    console.log('User Disconnected - ' + new Date());
  });

});
