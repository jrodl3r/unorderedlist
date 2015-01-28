// ==========================================================================
// Test Spec
// ==========================================================================
'use strict';

jasmine.getFixtures().fixturesPath = 'inc';

var spyEvent;

describe('Page Elements', function () {

  beforeEach( function () {
    loadFixtures('index.html');
  });

  it('are ready and loaded into the DOM', function () {

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
    expect($(UL.menu_bar.selector).find('li')).toHaveLength(2);
    expect($(UL.menu_bar.selector).find('li')).toContainElement($('a#github'));
    expect($(UL.menu_bar.selector).find('li')).toContainElement($('a#download'));
  });
});

describe('Entering a List Name', function () {

  beforeEach( function () {
    loadFixtures('index.html');
    UL.load_list_button = $(UL.load_list_button.selector);
    spyEvent = spyOnEvent(UL.load_list_button.selector, 'click');
    spyOn(UL, 'submit_list').and.callFake( function() {
      return false;
    });
    UL.load_list_button.on('click', function (e) {
      e.preventDefault();
      UL.submit_list();
    });
    UL.load_list_button.click();
  });

  it('triggers submit_list() when Go is clicked', function () {

    expect(spyEvent).toHaveBeenTriggered();
    expect(UL.submit_list).toHaveBeenCalled();
  });
});

describe('Update View', function () {

  beforeEach( function () {
    loadFixtures('index.html');
    UL.load_list_form  = $(UL.load_list_form.selector);
    UL.load_list_input = $(UL.load_list_input.selector);
    UL.add_item_form   = $(UL.add_item_form.selector);
    UL.add_item_input  = $(UL.add_item_input.selector);
    UL.item_list       = $(UL.item_list.selector);
    UL.load_list_input.val('New List');
    UL.update_view();
  });

  it('clears the list name input', function () {

    expect(UL.load_list_input.val()).toEqual('');
  });

  it('swaps the load list and add item forms', function () {

    expect(UL.load_list_form).toBeHidden();
    expect(UL.add_item_form).not.toBeHidden();
  });

  it('focuses the add item input', function () {

    expect(UL.add_item_input).toBeFocused();
  });

  it('clears and shows the item list', function () {

    expect(UL.item_list).toBeEmpty();
    expect(UL.item_list).toBeVisible();
  });

});

describe('Set Title', function () {

  beforeEach( function () {
    loadFixtures('index.html');
    UL.list_title = $(UL.list_title.selector);
    UL.set_title('Title Name');
  });

  it('updates the list title', function () {

    expect(UL.list_title).toHaveText('Title Name');
    expect(UL.list_title).toBeVisible();
  });
});

describe('Add Share Link', function () {

  beforeEach( function () {
    loadFixtures('index.html');
    // add_share_link()
    // var link = 'http://' + location.host + '/' + encodeURI(this.list_title.text());
    // $('<li></li>').append($('<a>Share</a>').attr({ 'id': 'share', 'href': link })).prependTo(this.menu_bar);
  });

  it('injects the share link into the menu bar', function () {

    expect(true).toBeTruthy();
  });
});

/*describe('Adding a New Item', function () {

  beforeEach( function () {
    loadFixtures('index.html');
  });

  it('works like a charm', function () {
    expect(true).toBeTruthy();
  });
});*/


// REFS
// -----------------------------------------------------
// expect(el).toEqual('#test');
// expect(el).toHaveId('test');
// expect(el).toHaveClass('test');
// expect(el).toBeMatchedBy('#test');
// expect(el).toHaveHtml('<p id="foo">hello world</p>');
// expect(el).toHaveAttr('data', 'foo');
// expect(el).toContainHtml('hello world');
// expect(el).toHaveCss({background: 'red'});
