// ==========================================================================
// UnorderedList
// ==========================================================================
'use strict';

// Config
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


// Routes
// --------------------------------------------------------------------------

// default
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// jasmine testing
if (env === 'development') {
  // spec runner
  app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/_SpecRunner.html');
  });
  // spec fixture
  app.get('/inc/:filename', function (req, res) {
    res.sendFile(__dirname + '/inc/' + req.params.filename);
  });
}

// load shared list
app.get('/:list', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// get latest item (<30min)
app.get('/get/:list', function (req, res) {
  List.aggregate(
    { $match: { name: req.params.list }},
    { $unwind: '$items' },
    { $match: { 'items.active': true }},
    { $sort: { 'items.added': -1 }},
    { $limit: 1 }, function (err, result) {
      if (err) {
        res.status(500);
        res.send(err);

      } else {
        var item_added = result[0].items.added,
            item_body  = result[0].items.body;

        if (get_item_timer(item_added)) {
          res.send(item_body);
        } else {
          res.send('NO_RECENT_ITEM');
        }
      }
  });
});

// post list item
app.post('/:list', parser, function (req, res) {
  List.findOne({ name: req.params.list }, function (err, result) {
    if (err || !result) {
      res.status(500);
      res.send('ERROR');

    } else {
      insert_item(req.body.item, result);
      res.send('ITEM_ADDED');
    }
  });
});

app.use('/public', express.static(__dirname + '/public'));
app.use('/.grunt', express.static(__dirname + '/.grunt'));
app.use('/spec', express.static(__dirname + '/spec'));
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

          } else {
            socket.emit('load list', socket.list_name, docs[0].items);
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
        io.sockets.emit('remove item', id);
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

// get item timer (30min)
function get_item_timer(added) {

  var now   = new Date,
      elaps = (now.getTime() - added.getTime()) / 1000 / 60;

  return elaps < 30 ? true : false;
}

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
      io.sockets.emit('add item', data, list.name);
    }
  });
}
