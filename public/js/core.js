// ==========================================================================
// UnorderedList
// ==========================================================================
'use strict';

var UL = {

  socket            : io.connect(),
  container         : $('#app'),
  list_title        : $('#list-title span'),
  load_list_form    : $('#load-list-form'),
  load_list_input   : $('#load-list-input'),
  new_list_button   : $('#new-list-button'),
  open_list_button  : $('#open-list-button'),
  add_item_form     : $('#add-item-form'),
  add_item_button   : $('#add-item-button'),
  new_item_input    : $('#new-item-input'),
  item_list         : $('#item-list'),
  item_content      : $('#item-list li span'),
  remove_buttons    : $('#item-list li .remove'),
  clip_buttons      : $('#item-list li .clip'),
  clipboard         : null,


  init: function init() {

    this.sockets();
    this.interact();
    this.check_url();
  },

  // setup socket/io
  sockets: function sockets() {

    // new list
    this.socket.on('new list', function (title) {
      UL.clear_list();
      UL.set_title(title);
    });

    // load list
    this.socket.on('load list', function (title, data) {
      UL.clear_list();
      UL.set_title(title);
      UL.load_list(data);
    });

    // add item
    this.socket.on('add item', function (data, title) {
      if(title === UL.list_title.text()) {
        UL.add_item(data);
      }
    });

    // remove item
    this.socket.on('remove item', function (id) {
      UL.item_list.find('#' + id).fadeOut(300, function () {
        $(this).remove();
      });
    });
  },

  // user interaction
  interact: function interact() {

    // focus input
    this.load_list_input.focus();

    // load list
    this.load_list_form.submit( function (e) {
      var title = UL.load_list_input.val().trim().toLowerCase();

      e.preventDefault();
      if (title !== '') {
        UL.socket.emit('load list', title);
      }
    });

    // submit item
    this.add_item_form.submit( function (e) {
      var item = UL.new_item_input.val().trim();

      e.preventDefault();
      if (item !== '') {
        UL.socket.emit('add item', item);
      }
    });
  },

  // update buttons
  update_buttons: function update_buttons() {

    // clipboard
    ZeroClipboard.destroy();
    this.clipboard = new ZeroClipboard($(this.clip_buttons.selector));

    // clipboard hover fix
    this.container.on('mouseover', function () {
      $(UL.clip_buttons.selector).removeClass('zeroclipboard-is-hover');
    });

    // remove
    $(this.remove_buttons.selector).on('click', $.proxy( function (e) {
      this.remove_item($(e.currentTarget).parent().attr('id'));
    }, this));

    // spans
    $(this.item_content.selector).click( function () {
      var range, selection;

      if (window.getSelection && document.createRange) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents($(this)[0]);
        selection.removeAllRanges();
        selection.addRange(range);
      } else if (document.selection && document.body.createTextRange) {
        range = document.body.createTextRange();
      }
    });
  },

  // load list from url
  check_url: function check_url() {

    var title = decodeURI(document.URL.split('/')[3]);

    if (title !== '') {
      this.socket.emit('load list', title);
    }
  },

  // load list
  load_list: function load_list(list) {

    var i = list.length;

    while (i--) {
      if (list[i].active) {
        this.add_item(list[i], 'flip');
      }
    }
    this.update_buttons();
  },

  // clear list
  clear_list: function clear_list() {

    this.load_list_form.hide();
    this.load_list_input.val('');
    this.add_item_form.show();
    this.new_item_input.focus();
    this.item_list.empty().show();
  },

  // add item
  add_item: function add_item(item, order) {

    var remove = '<div class="remove fa fa-trash-o"></div>',
          clip = '<div class="clip fa fa-paperclip" data-clipboard-text="' + item.body + '"></div>',
            li = '<li id="' + item._id + '" tabindex="1"><span>' + item.body + '</span>' + clip + remove + '</li>';

    if (order === 'flip') {
      this.item_list.append(li);
    } else {
      this.item_list.prepend(li);
      this.new_item_input.val('');
      this.update_buttons();
    }
  },

  // remove item
  remove_item: function remove_item(id) {

    this.socket.emit('remove item', id);
  },

  // set title
  set_title: function set_title(title) {

    this.list_title.html(title).css('visibility', 'visible');
  }
};

$(document).ready( function () {
  UL.init();
});
