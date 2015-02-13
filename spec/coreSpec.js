// ==========================================================================
// UnorderedList UI Spec
// ==========================================================================
'use strict';

var list_title         = 'List Title',
    list               = [{ _id: 1, body: 'Item 01' }, { _id: 2, body: 'Item 02' }],
    list_output        = '<li id="2" tabindex="1"><span>Item 02</span><div class="remove fa fa-trash-o"></div><div class="clip fa fa-paperclip" data-clipboard-text="Item 02"></div></li><li id="1" tabindex="1"><span>Item 01</span><div class="remove fa fa-trash-o"></div><div class="clip fa fa-paperclip" data-clipboard-text="Item 01"></div></li>',
    item               = { _id: 3, body: 'Item 03' },
    item_output        = '<li id="3" tabindex="1"><span>Item 03</span><div class="remove fa fa-trash-o"></div><div class="clip fa fa-paperclip" data-clipboard-text="Item 03"></div></li>',
    domain             = location.host || 'unorderedlist.com',
    share_link_output  = '<li><a id="share" href="http://' + domain + '/List%20Title">Share</a></li>';

jasmine.getFixtures().fixturesPath = 'tmpl/inc';

describe('Init', function () {

  beforeEach( function () {
    loadFixtures('home.html');
    UL.load_list_input = $(UL.load_list_input.selector);
    UL.load_list_button = $(UL.load_list_button.selector);
    UL.add_item_button = $(UL.add_item_button.selector);
    UL.init();
  });

  it('loads the elements and selectors', function () {

    expect($(UL.container.selector)).toExist();
    expect($(UL.list_title.selector)).toExist();
    expect($(UL.load_list_form.selector)).toExist();
    expect($(UL.load_list_input.selector)).toExist();
    expect($(UL.load_list_button.selector)).toExist();
    expect($(UL.add_item_form.selector)).toExist();
    expect($(UL.add_item_button.selector)).toExist();
    expect($(UL.add_item_input.selector)).toExist();
    expect($(UL.item_list.selector)).toExist();
    expect($(UL.menu_bar.selector)).toExist();

    // TODO Add New Share & Extension Link Tests
    
    // expect($(UL.menu_bar.selector).find('li')).toHaveLength(2);
    // expect($(UL.menu_bar.selector).find('li')).toContainElement($('a#github'));
    // expect($(UL.menu_bar.selector).find('li')).toContainElement($('a#download'));
  });

  it('attaches the load-list button click handler', function () {
    expect(UL.load_list_button).toHandleWith('click', UL.submit_list);
  });

  it('attaches the add-item button click handler', function () {
    expect(UL.add_item_button).toHandleWith('click', UL.submit_item);
  });

  it('focuses the load-list input', function () {
    expect(UL.load_list_input).toBeFocused();
  });
});

describe('Load List', function () {

  beforeEach( function () {
    loadFixtures('home.html');
    UL.item_list      = $(UL.item_list.selector);
    UL.add_item_input = $(UL.add_item_input.selector);
    UL.load_list(list);
  });

  it('adds the history items', function () {
    expect(UL.item_list).toHaveHtml(list_output);
  });

  it('focuses the add item input', function () {
    expect(UL.add_item_input).toBeFocused();
  });
});

describe('Add Item', function () {

  beforeEach( function () {
    loadFixtures('home.html');
    UL.item_list      = $(UL.item_list.selector);
    UL.list_title     = $(UL.list_title.selector);
    UL.add_item_input = $(UL.add_item_input.selector);
    UL.set_title(list_title);
    UL.add_item(item, list_title);
  });

  it('adds the new item', function () {
    expect(UL.item_list).toHaveHtml(item_output);
  });

  it('clears and focuses the add item input', function () {
    expect(UL.add_item_input.val()).toEqual('');
    expect(UL.add_item_input).toBeFocused();
  });
});

describe('Delete Item', function () {

  beforeEach( function () {
    loadFixtures('home.html');
    $.fx.off = true;
    UL.item_list  = $(UL.item_list.selector);
    UL.list_title = $(UL.list_title.selector);
    UL.set_title(list_title);
    UL.add_item(item, list_title);
    UL.delete_item(item._id);
  });

  it('removes the item', function () {
    expect(UL.item_list).toBeEmpty();
  });
});

describe('Update View', function () {

  beforeEach( function () {
    loadFixtures('home.html');
    UL.load_list_form  = $(UL.load_list_form.selector);
    UL.load_list_input = $(UL.load_list_input.selector);
    UL.add_item_form   = $(UL.add_item_form.selector);
    UL.item_list       = $(UL.item_list.selector);
    UL.load_list_input.val(list_title);
    UL.update_view();
  });

  it('clears the list-name input', function () {
    expect(UL.load_list_input.val()).toEqual('');
  });

  it('swaps the load-list and add-item forms', function () {
    expect(UL.load_list_form).toBeHidden();
    expect(UL.add_item_form).not.toBeHidden();
  });

  it('clears and shows the item list', function () {
    expect(UL.item_list).toBeEmpty();
    expect(UL.item_list).toBeVisible();
  });
});

describe('Set Title', function () {

  beforeEach( function () {
    loadFixtures('home.html');
    UL.list_title = $(UL.list_title.selector);
    UL.set_title(list_title);
  });

  it('updates the list title', function () {
    expect(UL.list_title).toHaveText(list_title);
    expect(UL.list_title).toBeVisible();
  });
});

describe('Add Share Link', function () {

  beforeEach( function () {
    loadFixtures('home.html');
    UL.list_title = $(UL.list_title.selector);
    UL.menu_bar   = $(UL.menu_bar.selector);
    UL.set_title(list_title);
    UL.add_share_link();
  });

  it('adds the share link to the menu bar', function () {
    expect(UL.menu_bar).toContainHtml(share_link_output);
  });
});
