
$(document).ready(function() {

  var socket       = io.connect(),
      pastey_form  = $('#pastey-form'),
      pastey_input = $('#new-pastey'),
      pastey_list  = $('#pastey-list');

  // add new
  function add_pastey(data) {
    pastey_list.prepend('<li>' + data + '</li>');
  }

  // load history
  function load_history(data) {
    pastey_list.append('<li>' + data + '</li>');
  }

  // submit data
  pastey_form.submit(function(e) {
    e.preventDefault();
    socket.emit('add pastey', pastey_input.val());
    pastey_input.val('');
  });

  // load history handler
  socket.on('load history', function(docs) {
    var i = docs.length -1;
    pastey_list.empty();
    while(i) {
      load_history(docs[i].item);
      i--;
    }
  });

  // add new handler
  socket.on('add pastey', function(data) {
    add_pastey(data);
  });
});
