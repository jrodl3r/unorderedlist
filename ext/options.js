// ==========================================================================
// UnorderedList: Chrome Extension Options
// ==========================================================================
'use strict';

var UL = UL || {};

// Saves options to chrome.storage
UL.save_options = function save_options() {

  var list_name = document.getElementById('list').value,
      status    = document.getElementById('status');

  if (list_name !== '') {
    chrome.storage.sync.set({
      list: list_name
    }, function () {
      // Sucess
      status.className = 'pass';
      setTimeout( function () {
        status.className = '';
      }, 2000);
    });
  // Failed
  } else {
    status.className = 'fail';
    setTimeout( function () {
      status.className = '';
    }, 2000);
  }
};

// Restores preferences from chrome.storage
UL.restore_options = function restore_options() {

  chrome.storage.sync.get({
    list: ''
  }, function (items) {
    document.getElementById('list').value = items.list;
  });
};

// Open List Link
UL.list_link = function list_link(e) {

  var list_name = document.getElementById('list').value;
  e.preventDefault();
  chrome.tabs.create({url: 'http://unorderedlist.com/' + list_name });
};

// Process Enter-Key
UL.submit_input = function submit_input() {

  if (event.keyCode === 13) {
    UL.save_options();
  }
};

// Open Keyboard Settings
UL.keyboard_settings = function keyboard_settings(e) {

  e.preventDefault();
  chrome.tabs.create({url: 'chrome://extensions/configureCommands'});
};

document.addEventListener('DOMContentLoaded', UL.restore_options);
document.getElementById('save').addEventListener('click', UL.save_options);
document.getElementById('list').addEventListener('keypress', UL.submit_input);
document.getElementById('options').addEventListener('click', UL.keyboard_settings);
document.getElementById('open_list').addEventListener('click', UL.list_link);
