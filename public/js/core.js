// ==========================================================================
// UnorderedList UI Core
// ==========================================================================
'use strict';

var UL = {

  socket               :  io.connect(),
  container            :  $('#app'),
  menu_bar             :  $('#nav'),
  list_title           :  $('#list-title span'),
  load_list_form       :  $('#load-list-form'),
  load_list_input      :  $('#load-list-input'),
  load_list_button     :  $('#load-list-button'),
  add_item_form        :  $('#add-item-form'),
  add_item_button      :  $('#add-item-button'),
  add_item_input       :  $('#add-item-input'),
  item_list            :  $('#item-list'),
  item_container       :  $('#item-list li'),
  item_content         :  $('#item-list li span'),
  remove_buttons       :  $('#item-list li .remove'),
  clip_buttons         :  $('#item-list li .clip'),
  chrome_ext_id        :  'jehhmlpdedncbbemoncbfabfaongchma',
  clipboard            :  null,


  init: function init() {

    this.init_sockets();
    this.init_events();
    this.analyze_url();
    this.add_ext_link();
  },

  // setup socket handlers
  init_sockets: function init_sockets() {

    // new list
    this.socket.on('new list', function (title) {
      UL.update_view();
      UL.set_title(title);
      UL.add_share_link();
    });

    // load list
    this.socket.on('load list', function (title, items) {
      UL.update_view();
      UL.set_title(title);
      UL.load_list(items);
      UL.add_share_link();
    });

    // item added
    this.socket.on('item added', function (item, list) {
      UL.add_item(item, list);
    });

    // item deleted
    this.socket.on('item deleted', function (id) {
      UL.delete_item(id);
    });
  },

  // setup events
  init_events: function init_events() {

    // focus input
    this.load_list_input.focus();

    // load list
    this.load_list_button.on('click', UL.submit_list);

    // add item
    this.add_item_button.on('click', UL.submit_item);
  },

  // update events (after item +/-)
  update_events: function update_events() {

    // remove item
    $(this.remove_buttons.selector).off('click');
    $(this.remove_buttons.selector).on('click', UL.remove_item);

    // clipboard
    ZeroClipboard.destroy();
    this.clipboard = new ZeroClipboard($(this.clip_buttons.selector));

    // clipboard mouse-exit (fix)
    // TODO Remove Hack + Add Item Context Menu
    this.container.on('mouseover', function () {
      $(UL.clip_buttons.selector).removeClass('zeroclipboard-is-hover');
    });

    // single-click item highlight
    $(this.item_container.selector + ', ' + this.item_content.selector).off('click');
    $(this.item_container.selector + ', ' + this.item_content.selector).on('click', UL.highlight_item);
  },

  // submit list (click » load_list_button / socket » load list)
  submit_list: function submit_list(e) {

    var title = UL.load_list_input.val().trim().toLowerCase();
    e.preventDefault();
    if (title !== '') {
      UL.socket.emit('load list', title);
    }
  },

  // submit item (click » add_item_button / socket » add item)
  submit_item: function submit_item(e) {

    var list = UL.list_title.text(),
        item = UL.add_item_input.val().trim();
    e.preventDefault();
    if (item !== '') {
      UL.socket.emit('add item', list, item);
    }
  },

  // remove item (click » remove_button / socket » remove item)
  remove_item: function remove_item(e) {

    var list = UL.list_title.text(),
        item = $(this).parent().attr('id');
    e.stopPropagation();
    UL.socket.emit('remove item', list, item);
  },

  // single-click item highlight (click » li/span)
  highlight_item: function highlight_item(e) {

    e.stopPropagation();
    if ($(this).context.localName === 'li') {
      $(this).find('span').click();
    } else {
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
    }
  },

  // load list (load list « socket)
  load_list: function load_list(items) {

    items.forEach( function (item) {
      UL.insert_item(item);
    });
    this.add_item_input.focus();
    this.update_events();
  },

  // add item (item added « socket)
  add_item: function add_item(item, title) {

    if (title === UL.list_title.text()) {
      this.insert_item(item);
      this.add_item_input.val('').focus();
      this.update_events();
    }
  },

  // delete item element (item deleted « socket)
  delete_item: function delete_item(id) {

    $('#' + id).fadeOut(300, function () {
      $(this).remove();
    });
  },

  // insert item element
  insert_item: function insert_list_item(item) {

    var li = $('<li></li>', { 'id': item._id, 'tabindex': 1 }).append(
             $('<span>' + item.body + '</span>'),
             $('<div></div>', { 'class': 'remove fa fa-trash-o' }),
             $('<div></div>', { 'class': 'clip fa fa-paperclip', 'data-clipboard-text': item.body }));
    this.item_list.prepend(li);
  },

  // cleanup + swap load-list / add-item forms
  update_view: function update_view() {

    this.load_list_form.hide();
    this.load_list_input.val('');
    this.add_item_form.show();
    this.item_list.empty().show();
  },

  // set list title element
  set_title: function set_title(title) {

    this.list_title.html(title).css('visibility', 'visible');
  },

  // load list from url
  // TODO Add Reservered Words Check ['test', etc].indexOf != -1
  analyze_url: function analyze_url() {

    var title = decodeURI(location.pathname.substr(1)).toLowerCase();
    if (title !== '') {
      this.socket.emit('load list', title);
    }
  },

  // add share link to nav
  add_share_link: function add_share_link() {

    var domain = location.host || 'unorderedlist.com',
          link = 'http://' + domain + '/' + encodeURI(this.list_title.text());
    $('<li></li>').append($('<a>Share</a>').attr({ 'id': 'share', 'href': link })).prependTo(this.menu_bar);
    this.show_menu();
  },

  // add chrome ext download link
  add_ext_link: function add_ext_link() {

    if (window.chrome) {
      if (window.chrome.runtime) {
        chrome.runtime.sendMessage(this.chrome_ext_id, { message: 'isInstalled' }, function (reply) {
          if (reply !== undefined && reply.status) {
            $('#download').remove();
          }
        });
      }
      $('<li></li>').append($('<a>Download</a>').attr({ 'id': 'download', 'href': '#' })).appendTo(this.menu_bar);
      $('#download').on('click', function (e) {
        e.preventDefault();
        chrome.webstore.install();
      });
      this.show_menu();
    }
  },

  // show menu bar
  show_menu: function show_menu() {

    this.menu_bar.addClass('visible');
  }
};

$(document).ready( function () {
  //UL.init();

  $(window).on('resize', function () {
    if (window.matchMedia('(min-width: 800px)').matches) {
      killNav();
    }
  });


  $('input').on('focus blur', setWatermark);
  $('input').on('keypress', userInput);
  $('#menu-button').on('click', toggleNav);
  $('#app').on('click', killNav);

  function killNav() {
    if ($('#menu').hasClass('active')) {
      $('#menu, #app').removeClass('active');
      $('#menu-button').removeClass('active fa-close').addClass('fa-bars');
    }
  }

  function toggleNav(e) {
    $('#menu, #app').toggleClass('active');
    $(e.currentTarget).toggleClass('active');
    if ($(e.currentTarget).hasClass('fa-bars')) {
      $(e.currentTarget).removeClass('fa-bars').addClass('fa-close');
    } else {
      $(e.currentTarget).removeClass('fa-close').addClass('fa-bars');
    }
  }


  function addItem(item) {
    var li   = $('<li></li>', { 'class': 'item' }).text(item),
        menu = $('<ul></ul>', { 'class': 'menu' }),
        bg   = $('<div></div>', { 'class': 'shade' }),
        icon = $('<div></div>', { 'class': 'icon fa fa-bars' });

    menu.append($('<li></li>').append('<a class="fa fa-trash-o"><span>Delete</span></a>'));
    menu.append($('<li></li>').append('<a class="fa fa-share-square-o"><span>Share</span></a>'));
    menu.append($('<li></li>').append('<a class="fa fa-star-o"><span>Star</span></a>'));
    menu.append($('<li></li>').append('<a class="fa fa-clipboard"><span>Copy</span></a>'));
    menu.append($('<li></li>').append('<a class="fa fa-pencil"><span>Edit</span></a>'));
    li.append(menu).append(icon).append(bg);
    $('#items').prepend(li);
    setTimeout( function () {
      $('#items').find('li:eq(0)')
        .addClass('active')
        .on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          $(this).focus();
      });
    }, 1);
  }

  function userInput(e) {
    if (e.keyCode === 13) {
      // load list
      if (!$(e.currentTarget).hasClass('active') && $(e.currentTarget).val().length > 0) {
        $('#title').text($(e.currentTarget).val()).addClass('active');
        $(e.currentTarget).val('').attr('placeholder', 'Add Item').addClass('active').focus();
      // add item
      } else if ($(e.currentTarget).val().length > 0) {
        addItem($(e.currentTarget).val());
        $(e.currentTarget).val('');
      }
    }
  }

  function setWatermark(e) {
    var placeholder = $(e.currentTarget).attr('placeholder');

    if (placeholder.length) {
      $(e.currentTarget).attr('placeholder', '');
    } else {
      if ($(e.currentTarget).hasClass('active')) {
        $(e.currentTarget).attr('placeholder', 'Add Item');
      } else {
        $(e.currentTarget).attr('placeholder', 'List Name');
      }
    }
  }

});
