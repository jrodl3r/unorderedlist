
$(document).ready(function() {

  var socket       = io.connect(),
      pastey_form  = $('#pastey-form'),
      pastey_input = $('#new-pastey'),
      pastey_list  = $('#pastey-list');

  // helper: add item
  function add_item(data) {
    pastey_list.prepend('<li>' + data + '</li>');
  }

  // helper: load history
  function load_history(list) {
    var i = list.length -1;
    pastey_list.empty();
    while(i) {
      pastey_list.append('<li>' + list[i].item + '</li>');
      i--;
    }
  }

  // submit item
  pastey_form.submit(function(e) {
    e.preventDefault();
    socket.emit('add item', pastey_input.val());
    pastey_input.val('');
  });

  // load history
  socket.on('load history', function(docs) {
    load_history(docs);
  });

  // add item
  socket.on('add item', function(data) {
    add_item(data);
  });
});
