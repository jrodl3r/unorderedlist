
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


  // Helper - load list
  function update_list() {
    load_list_form.hide();
    list_title.html(load_list_input.val());
    list_title.css('visibility', 'visible');
    load_list_input.val('');
    add_item_form.show();
    item_list.show();
  }

  // Helper - add item
  function add_item(data) {
    item_list.prepend('<li>' + data + '</li>');
  }

  // Helper - load history
  // function load_history(list) {
  //   if(list.length) {
  //     var i = list.length;
  //     item_list.empty();
  //     while(i--) {
  //       item_list.append('<li>' + list[i].item + '</li>');
  //     }
  //   }
  // }


  // load list
  load_list_form.submit( function (e) {
    e.preventDefault();
    socket.emit('load list', load_list_input.val(), function (data) {

      // create list
      if (data) {
        update_list();

      // load list
      } else {
        // TODO load history...
        //load_history(...);
        update_list();
      }
    });
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


  // TODO UPDATE load history
  // socket.on('load history', function (docs) {
  //   load_history(docs);
  // });

});
