// ==========================================================================
// UnorderedList
// ==========================================================================
'use strict';

var UL = {

  init: function() {

    this.socket            = io.connect();
    this.list_title        = $('#list-title');
    this.load_list_form    = $('#load-list-form');
    this.load_list_input   = $('#load-list-input');
    this.new_list_button   = $('#new-list-button');
    this.open_list_button  = $('#open-list-button');
    this.add_item_form     = $('#add-item-form');
    this.add_item_button   = $('#add-item-button');
    this.new_item_input    = $('#new-item-input');
    this.item_list         = $('#item-list');

    // focus input
    this.load_list_input.focus();

    // load list
    this.load_list_form.submit( function (e) {
      e.preventDefault();
      var title = UL.load_list_input.val().trim().toLowerCase();
      if (title !== '') {
        UL.socket.emit('load list', title);
      }
    });

    // submit item
    this.add_item_form.submit( function (e) {
      e.preventDefault();
      var item = UL.new_item_input.val().trim();
      if (item !== '') {
        UL.socket.emit('add item', item);
      }
    });

    // add item
    this.socket.on('add item', function (data) {
      UL.add_item(data);
    });

    // new list
    this.socket.on('new list', function () {
      UL.clear_list();
    });

    // load list
    this.socket.on('load list', function (data) {
      UL.clear_list();
      UL.load_list(data);
    });
  },

  // load list
  load_list: function(list) {
    var i = list.length;
    while (i--) {
      if (list[i].active) {
        this.add_item(list[i], 'flip');
      }
    }
  },

  // clear list
  clear_list: function() {
    this.load_list_form.hide();
    this.list_title.html(this.load_list_input.val());
    this.list_title.css('visibility', 'visible');
    this.load_list_input.val('');
    this.add_item_form.show();
    this.new_item_input.focus();
    this.item_list.empty();
    this.item_list.show();
  },

  // add item
  add_item: function(item, order) {
    var remove = '<div class="remove" onclick="javascript:UL.remove_item(\'' + item._id + '\');">&#10005;</div>',
            li = '<li data-active="' + item.active + '" data-id="' + item._id + '">' + item.body + remove + '</li>';
    if (order === 'flip') {
      this.item_list.append(li);
    } else {
      this.item_list.prepend(li);
      this.new_item_input.val('');
    }
  },

  // remove item
  remove_item: function(id) {
    this.socket.emit('remove item', id);
    this.item_list.find('li[data-id=' + id + ']').fadeOut(500, function(){
      $(this).remove();
    });
  }
};

// Launch UL
$(document).ready( function () {
  UL.init();
});
