
$(document).ready(function() {

  var socket         = io.connect(),
      add_item_form  = $('#add-item-form'),
      new_item       = $('#new-item'),
      item_list      = $('#item-list');


  // add item
  function add_item(data) {
    item_list.prepend('<li>' + data + '</li>');
  }

  // load history
  function load_history(list) {
    if(list.length) {
      var i = list.length;
      item_list.empty();
      while(i--) {
        item_list.append('<li>' + list[i].item + '</li>');
      }
    }
  }

  // submit
  add_item_form.submit(function(e) {
    e.preventDefault();
    socket.emit('add item', new_item.val());
    new_item.val('');
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
