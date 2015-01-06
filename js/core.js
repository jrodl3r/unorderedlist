// ==========================================================================
// UnorderedList
// ==========================================================================


$(document).ready( function() {

  var socket            = io.connect(),
      list_title        = $('#list-title'),
      load_list_form    = $('#load-list-form'),
      load_list_input   = $('#load-list-input'),
      new_list_button   = $('#new-list-button'),
      open_list_button  = $('#open-list-button'),
      add_item_form     = $('#add-item-form'),
      add_item_button   = $('#add-item-button'),
      new_item_input    = $('#new-item-input'),
      item_list         = $('#item-list');


// Helpers
// --------------------------------------------------------------------------

  // load list
  function update_list() {
    load_list_form.hide();
    list_title.html(load_list_input.val());
    list_title.css('visibility', 'visible');
    load_list_input.val('');
    add_item_form.show();
    item_list.empty();
    item_list.show();
  }

  // add item
  function add_item(item, order) {
    if(order === 'flip') {
      item_list.append('<li data-active="' + item.active + '" data-id="' + item._id + '">' + item.body + '</li>');
    } else {
      item_list.prepend('<li data-active="' + item.active + '" data-id="' + item._id + '">' + item.body + '</li>');
    }
  }

  // load list
  function load_list(list) {
    var i = list.length;
    while (i--) {
      add_item(list[i], 'flip');
    }
  }


// Events
// --------------------------------------------------------------------------

  // load list
  load_list_form.submit( function (e) {
    e.preventDefault();
    socket.emit('load list', load_list_input.val());
  });

  // submit item
  add_item_form.submit( function (e) {
    e.preventDefault();
    socket.emit('add item', new_item_input.val());
    new_item_input.val('');
  });

  // add item
  socket.on('add item', function (data) {
    add_item(data);
  });

  // new list
  socket.on('new list', function () {
    update_list();
  });

  // load list
  socket.on('load list', function (data) {
    update_list();
    load_list(data);
  });
});
