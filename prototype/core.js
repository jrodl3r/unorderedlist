
(function(){
  'use strict';

  var UL = {

    // item_count       :  0,
    // item_height      :  56,
    // list_height      :  80,
    last_deleted     :  null,
    notify_timer     :  null,
    notify_delay     :  8000,
    //list_scrolled    :  false,


    init: function init() {
      $('#text-input').on('focus blur', UL.focusInput);
      $('#text-input').on('keypress', UL.handleInput);
      $('#menu-button').on('click', UL.toggleNav);
      $('#main').on('click', UL.closeNav);
    },

    // List: Add Item
    addItem: function addItem(item) {
      var id   = Math.floor(Math.random()*10000),
          li   = $('<li></li>', { 'class': 'item icon fa fa-bars' }).attr('id', id),
          text = $('<span></span>').text(item),
          menu = $('<ul></ul>', { 'class': 'menu' }),
          bg   = $('<div></div>', { 'class': 'shade' });

      menu.append($('<li></li>').append('<a class="delete fa fa-trash-o"><span>Delete</span></a>'));
      menu.append($('<li></li>').append('<a class="share fa fa-share-square-o"><span>Share</span></a>'));
      menu.append($('<li></li>').append('<a class="star fa fa-star-o"><span>Star</span></a>'));
      menu.append($('<li></li>').append('<a class="copy fa fa-copy"><span>Copy</span></a>'));
      menu.append($('<li></li>').append('<a class="edit fa fa-pencil"><span>Edit</span></a>'));
      li.append(text).append(menu).append(bg);
      $('#items').prepend(li);
      setTimeout(function() {
        $('#items li').eq(0).addClass('active')
          .on('touchmove', UL.scrollList)
          .on('mouseenter touchend', UL.showItemMenu)
          .on('mouseleave touchleave', UL.hideItemMenu);
        $('#items li').eq(0).find('a.delete').on('click', UL.deleteItem);
        //$('#items').find('li:eq(0) .menu .edit').on('click', UL.editItem);
      }, 1);
    },

    // TODO List: Edit Item
    // editItem: function editItem() {
    //   $(this).closest('.item').css('background', '#6F9');
    // },

    // List: Remove Item
    deleteItem: function deleteItem(e) {
      var button = $(this),
          item   = button.closest('.item'),
          id     = item.attr('id');

      e.preventDefault();
      e.stopPropagation();
      item.removeClass('context').addClass('inactive');
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

        // TODO: ADD load list

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
        $('#menu, #main').removeClass('active');
        $('#menu-button').removeClass('active fa-close').addClass('fa-bars');
      }
    },

    // UI / Menu: Toggle Sidebar Menu
    toggleNav: function toggleNav(e) {
      var el = $(this);

      e.preventDefault();
      $('#menu, #main, #wrapper').toggleClass('active');
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

}());
