
$(document).ready(function() {

  var socket       = io.connect(),
      pastey_form  = $('#pastey-form'),
      pastey_input = $('#new-pastey'),
      pastey_list  = $('#pastey-list');

  pastey_form.submit(function(e) {
    e.preventDefault();
    socket.emit('add pastey', pastey_input.val());
    pastey_input.val('');
  });

  socket.on('add pastey', function(data) {
    pastey_list.append('<li>' + data + '</li>');
  });

});
