/*****************************************************/
/* UnorderedList                                     */
/*****************************************************/


// init
var express        = require('express'),
    app            = express(),
    server         = require('http').createServer(app),
    io             = require('socket.io').listen(server),
    mongoose       = require('mongoose');


// connect
server.listen(3000);

mongoose.connect('mongodb://localhost/ul', function (err) {
  if(err) {
    console.error(err);
  } else {
    console.log('...Connected to mongodb');
  }
});


// schema
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


// config
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));


// events
io.sockets.on('connection', function (socket) {


  // user connected
  console.log('User Connected - ' + new Date());


  // load list
  socket.on('load list', function (data, callback) {
    List.find({ 'name' : data }, function (err, doc) {
      if(err) {
        console.error(err);

      // create list
      } else if (!doc.length) {
        var new_list = new List({ name: data });
        new_list.save( function (err) {
          if (err) {
            console.error(err);
          } else {
            socket.list_name = data;
            callback(true);
          }
        });

      // found list
      } else {
        socket.list_name = data;
        // TODO load list items
        // List.find({ name: socket.list_name }, function (err, docs) {
        //   if(err) {
        //     console.log(err);
        //   }
        //   socket.emit('load history', docs);
        // });
        callback(false);
      }
    });
  });


  // add item
  socket.on('add item', function (data) {
    List.findOne({ name: socket.list_name }, function (err, doc) {
      if(err) {
        console.error(err);

      } else {

        // update data
        data = {
          body: data,
          active: true,
          itemId: new mongoose.Types.ObjectId,
          added: new Date
        };

        // TODO Check If Item Exists

        // save item
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
