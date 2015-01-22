// ==========================================================================
// UnorderedList
// ==========================================================================
'use strict';

var UL = {

  socket            : io.connect(),
  container         : $('#app'),
  menu_bar          : $('#nav'),
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
    this.init_events();
    this.process_url();
  },

  // setup socket handlers
  sockets: function sockets() {

    // new list
    this.socket.on('new list', function (title) {
      UL.clear_list();
      UL.set_title(title);
      UL.add_share_link();
    });

    // load list
    this.socket.on('load list', function (title, data) {
      UL.clear_list();
      UL.set_title(title);
      UL.load_list(data);
      UL.add_share_link();
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

  // setup events
  init_events: function init_events() {

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

  // update events (after item add/remove)
  update_events: function update_events() {

    // clipboard
    ZeroClipboard.destroy();
    this.clipboard = new ZeroClipboard($(this.clip_buttons.selector));

    // clipboard hover fix
    this.container.on('mouseover', function () {
      $(UL.clip_buttons.selector).removeClass('zeroclipboard-is-hover');
    });

    // remove
    $(this.remove_buttons.selector).on('click', function () {
      UL.remove_item($(this).parent().attr('id'));
    });

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

  // load/create list from url
  process_url: function check_url() {

    var title = decodeURI(location.pathname.substr(1)).toLowerCase();

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
    this.update_events();
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

    var li = $('<li></li>', { 'id': item._id, 'tabindex': 1 }).append(
             $('<span>' + item.body + '</span>'),
             $('<div></div>', { 'class': 'remove fa fa-trash-o' }),
             $('<div></div>', { 'class': 'clip fa fa-paperclip', 'data-clipboard-text': item.body }));

    if (order === 'flip') {
      this.item_list.append(li);
    } else {
      this.item_list.prepend(li);
      this.new_item_input.val('');
      this.update_events();
    }
  },

  // remove item
  remove_item: function remove_item(id) {

    this.socket.emit('remove item', id);
  },

  // set title
  set_title: function set_title(title) {

    this.list_title.html(title).css('visibility', 'visible');
  },

  // add share link to nav
  add_share_link: function build_url() {

    var link = 'http://' + location.host + '/' + encodeURI(this.list_title.text());

    $('<li></li>').append($('<a>Share</a>').attr({ 'id': 'share', 'href': link })).prependTo(this.menu_bar);
  }
};

$(document).ready( function () {
  UL.init();
});
