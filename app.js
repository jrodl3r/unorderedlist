// ==========================================================================
// UnorderedList
// ==========================================================================
'use strict';

// Init
// --------------------------------------------------------------------------

var express        = require('express'),
    app            = express(),
    parser         = require('body-parser').json(),
    server         = require('http').createServer(app),
    io             = require('socket.io').listen(server),
    favicon        = require('serve-favicon'),
    mongoose       = require('mongoose'),
    List           = require('./models/list.js'),
    env            = process.env.NODE_ENV || 'development',
    port           = process.env.PORT || 3000;


    server.listen(port);

    if (env === 'development') {
      mongoose.connect('mongodb://localhost/ul');
    } else if (env === 'test') {
      mongoose.connect('mongodb://' + process.env.TEST_MONGOLAB_HOST + '/ul');
    } else if (env === 'production') {
      mongoose.connect('mongodb://' + process.env.MONGOLAB_URI + '/ul');
    }


// Routes
// --------------------------------------------------------------------------

// default
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// testing
if (env === 'test' || env === 'development') {
  // spec runner
  app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/_SpecRunner.html');
  });
  // spec fixtures
  app.get('/tmpl/inc/:filename', function (req, res) {
    res.sendFile(__dirname + '/tmpl/inc/' + req.params.filename);
  });
  // test assets
  app.use('/.grunt', express.static(__dirname + '/.grunt'));
  app.use('/spec', express.static(__dirname + '/spec'));
}

// load list
app.get('/:list', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// get item
app.get('/get/:list', function (req, res) {
  List.aggregate(
    { $match: { name: req.params.list } },
    { $unwind: '$items' },
    { $match: { 'items.active': true } },
    { $sort:  { 'items.added': -1 } },
    { $limit: 1 }, function (err, list) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        res.send(list[0].items);
      }
  });
});

// post item
app.post('/:list', parser, function (req, res) {
  List.findOne({ name: req.params.list }, function (err, list) {
    if (err || !list) {
      res.status(500);
      res.send('ERROR');
    } else {
      insert_item(req.body.item, list);
      res.send('ITEM_ADDED');
    }
  });
});

// public assets
app.use('/public', express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));


// Sockets
// --------------------------------------------------------------------------

io.sockets.on('connection', function (socket) {

  // user connected
  console.log('User Connected - ' + new Date());

  // load list
  socket.on('load list', function (list_name) {
    List.find({ name : list_name }, function (err, doc) {
      if (err) {
        console.error(err);
      // create new
      } else if (!doc.length) {
        var new_list = new List({ name: list_name });
        new_list.save( function (err) {
          if (err) {
            console.error(err);

          } else {
            socket.list_name = list_name;
            socket.emit('new list', socket.list_name);
          }
        });
      // load history
      } else {
        socket.list_name = list_name;
        List.find({ name: socket.list_name }, function (err, docs) {
          if (err) {
            console.error(err);
          // send active items
          } else {
            var list_items = [],
                i, max = docs[0].items.length;
            for(i = 0; i < max; i++) {
              if(docs[0].items[i].active === true) {
                list_items.push(docs[0].items[i]);
              }
            }
            socket.emit('load list', socket.list_name, list_items);
          }
        });
      }
    });
  });

  // add item
  socket.on('add item', function (item) {
    List.findOne({ name: socket.list_name }, function (err, doc) {
      if (err) {
        console.error(err);
      } else {
        insert_item(item, doc);
      }
    });
  });

  // remove item (set inactive)
  socket.on('remove item', function (id) {
    List.update({ 'items._id': id }, { '$set': { 'items.$.active': false } }, function (err) {
      if (err) {
        console.error(err);
      } else {
        io.sockets.emit('item deleted', id);
      }
    });
  });

  // user disconnected
  socket.on('disconnect', function () {
    console.log('User Disconnected - ' + new Date());
  });
});


// Helpers
// --------------------------------------------------------------------------

// get item timer (TODO make user setting)
// function get_item_timer(added) {
//
//   var now   = new Date,
//       elaps = (now.getTime() - added.getTime()) / 1000 / 60;
//
//   return elaps < 30 ? true : false;
// }

// insert list item
function insert_item(item, list) {

  var data = {
    body: item,
    active: true,
    _id: new mongoose.Types.ObjectId,
    added: new Date
  };

  list.items.push(data);
  list.save( function (err) {
    if (err) {
      console.error('err');
    } else {
      io.sockets.emit('item added', data, list.name);
    }
  });
}
