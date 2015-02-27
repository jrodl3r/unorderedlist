// ==========================================================================
// UnorderedList UI Core
// ==========================================================================
'use strict';

/*var UL = {

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
};*/


var UL = {

  item_count       :  0,
  item_height      :  56,
  list_height      :  80,
  last_deleted     :  null,
  notify_timer     :  null,
  notify_delay     :  8000,
  list_scrolled    :  false,


  init: function init() {
    $('#text-input').on('focus blur', UL.focusInput);
    $('#text-input').on('keypress', UL.handleInput);
    $('#menu-button').on('click', UL.toggleNav);
    $('#app').on('click', UL.closeNav);
  },

  // List: Add Item
  addItem: function addItem(item) {
    var id   = Math.floor(Math.random()*10000),
        li   = $('<li></li>', { 'class': 'item' }).attr('id', id),
        text = $('<span></span>').text(item),
        menu = $('<ul></ul>', { 'class': 'menu' }),
        bg   = $('<div></div>', { 'class': 'shade' }),
        icon = $('<div></div>', { 'class': 'icon fa fa-bars' });

    menu.append($('<li></li>').append('<a class="delete fa fa-trash-o"><span>Delete</span></a>'));
    menu.append($('<li></li>').append('<a class="share fa fa-share-square-o"><span>Share</span></a>'));
    menu.append($('<li></li>').append('<a class="star fa fa-star-o"><span>Star</span></a>'));
    menu.append($('<li></li>').append('<a class="copy fa fa-copy"><span>Copy</span></a>'));
    menu.append($('<li></li>').append('<a class="edit fa fa-pencil"><span>Edit</span></a>'));
    li.append(text).append(menu).append(icon).append(bg);
    $('#items').prepend(li);
    UL.moveItemsDown();
    setTimeout(function() {
      $('#items li:eq(0)').addClass('active')
        .on('touchmove', UL.scrollList)
        .on('mouseenter touchend', UL.showItemMenu)
        .on('mouseleave touchleave', UL.hideItemMenu);
      $('#items').find('li:eq(0) .menu .delete').on('click', UL.deleteItem);
      //$('#items').find('li:eq(0) .menu .edit').on('click', UL.editItem);
    }, 1);
  },

  // List: Move Items Down (Adding Item)
  moveItemsDown: function moveItemsDown() {
    var count = ++UL.item_count;
    UL.list_height += UL.item_height;
    while (count--) {
      $('#items > li').eq(count).css('transform', 'translate3d(0, ' + (UL.item_height * count) + 'px, 0)');
    }
    $('#items').css('height', UL.list_height + 'px');
    //$('#items').css('transform', 'scale3d(1, ' + UL.item_count + ', 1)');
  },

  // List: Move Items Up (Deleting Item)
  moveItemsUp: function moveItemsUp(el) {
    var count  = el.length,
        height = parseInt(el.eq(0).css('height')) + 10,
        pos;
    while (count--) {
      pos = parseInt(el.eq(count).css('transform').split(',')[5]) - height;
      el.eq(count).css('transform', 'translateY(' + pos + 'px)');
      console.log(count, pos);
    }
  },

  // updateItemPos: function updateItemPos(el, dir) {
  //   var count  = el.length,
  //       height = (parseInt(el.eq(0).css('height')) + 10) * dir;
  //   while (count--) {
  //     el.eq(count).css('transform', 'translateY(' + (height * count) + 'px)');
  //   }
  //   UL.item_count++;
  // },

  // TODO List: Edit Item
  // editItem: function editItem() {
  //   $(this).closest('.item').css('background', '#6F9');
  // },

  // List: Remove Item
  deleteItem: function deleteItem(e) {
    var button = $(this),
        item   = button.closest('.item'),
        id     = item.attr('id'),
        pos    = item.css('transform');
    e.preventDefault();
    e.stopPropagation();
    item.addClass('inactive').css('transform', pos + ' translateX(-120%)').removeClass('context');
    UL.moveItemsUp(item.nextAll());
    UL.last_deleted = id;
    UL.showNotify('delete', id);
  },

  // List: Putback Item
  undeleteItem: function undoDeleteItem(e) {
    e.preventDefault();
    $('#' + UL.last_deleted).removeClass('inactive');
    clearTimeout(UL.notify_timer);
    UL.hideNotify();
  },

  // List: Show Item Context Menu
  showItemMenu: function showItemMenu(e) {
    $('#items .item').removeClass('context');
    if (e.type === 'touchend') {
      $('#text-input.focused').removeClass('focused').blur();
    }
    if (!UL.list_scrolled) {
      $(this).addClass('context');
    }
    UL.list_scrolled = false;
  },

  // List: Hide Item Context Menu
  hideItemMenu: function hideItemMenu(e) {
    e.preventDefault();
    $(this).removeClass('context');
  },

  // Notify: Show Notification
  showNotify: function showNotify(type, id) {
    var panel   = $('#notify'),
        content = $('#notify .inner'),
        message, button;
    // clear existing
    if (panel.hasClass('active')) {
      clearTimeout(UL.notify_timer);
      content.empty();
    }
    // item deleted
    if (type === 'delete') {
      message = $('<span></span>').text('Item has been removed');
      button  = $('<a>Undo <i class="fa fa-undo"></i></a>').on('click', UL.undeleteItem);
      content.append(message).append(button);
    // item copied
    } else if (type === 'copy') {
      message = $('<span></span>').text('Item copied to clipboard');
      content.append(message);
    }
    // show + start hide timer
    panel.addClass('active ' + type);
    UL.notify_timer = setTimeout(function() {
       UL.hideNotify();
    }, UL.notify_delay);
  },

  // Notify: Hide Notification
  hideNotify: function hideNotify() {
    $('#notify').removeClass();
    $('#notify .inner').empty();
  },

  // UI: Enable Touch Scrolling Flag
  scrollList: function scrollList(e) {
    UL.list_scrolled = true;
  },

  // UI: Handle Text Input (Enter Key)
  handleInput: function userInput(e) {
    var el = $(this),
        ENTER_KEY = 13;
    if (e.keyCode === ENTER_KEY) {

      // TODO: load list

      // new list
      if (!el.hasClass('active') && el.val().length > 0) {
        $('#title').text(el.val()).addClass('active');
        el.val('').attr('placeholder', 'Add Item').addClass('active').focus();
      // add item
      } else if (el.val().length > 0) {
        UL.addItem(el.val());
        el.val('');
      }
    }
  },

  // UI: Handle Text Input Watermark
  focusInput: function focusInput() {
    var el = $('#text-input');
    if (el.attr('placeholder').length) {
      el.attr('placeholder', '').addClass('focused');
    } else {
      if (el.hasClass('active')) {
        el.attr('placeholder', 'Add Item').removeClass('focused');
      } else {
        el.attr('placeholder', 'List Name').removeClass('focused');
      }
    }
  },

  // UI / Menu: Hide Sidebar Menu
  closeNav: function closeNav(e) {
    if (e !== undefined) {
      e.preventDefault();
    }
    if ($('#menu').hasClass('active')) {
      $('#menu, #app').removeClass('active');
      $('#menu-button').removeClass('active fa-close').addClass('fa-bars');
    }
  },

  // UI / Menu: Toggle Sidebar Menu
  toggleNav: function toggleNav(e) {
    var el = $(this);
    e.preventDefault();
    $('#menu, #app').toggleClass('active');
    el.toggleClass('active');
    if (el.hasClass('fa-bars')) {
      el.removeClass('fa-bars').addClass('fa-close');
    } else {
      el.removeClass('fa-close').addClass('fa-bars');
    }
  }
};

// init
$(document).ready(function() {
  UL.init();
});

// resize
$(window).on('resize', function() {
  if (window.matchMedia('(min-width: 800px)').matches) {
    UL.closeNav();
  }
});
