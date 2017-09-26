// ==========================================================================
// UnorderedList: Chrome Extension Options
// ==========================================================================
'use strict';

var UL = UL || {};

// Saves options to chrome.storage
UL.saveOptions = function saveOptions() {

  var list_name = document.getElementById('list').value,
      status    = document.getElementById('status');
  // Sucess
  if (list_name !== '') {
    chrome.storage.sync.set({ list: list_name }, function () {
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
UL.restoreOptions = function restoreOptions() {

  chrome.storage.sync.get({ list: '' }, function (items) {
    document.getElementById('list').value = items.list;
  });
};

// Process Enter-Key
UL.submitInput = function submitInput(e) {

  if (e.keyCode === 13) {
    UL.saveOptions();
  }
};

// Open List Link
UL.openListLink = function openListLink(e) {

  var list_name = document.getElementById('list').value;
  var encoded_list_name = encodeURI(list_name);
  e.preventDefault();
  chrome.tabs.create({url: 'http://www.unorderedlist.net/' + encoded_list_name });
};

// Open Keyboard Settings
UL.openHotkeySettings = function openHotkeySettings(e) {

  e.preventDefault();
  chrome.tabs.create({url: 'chrome://extensions/configureCommands'});
};

document.addEventListener('DOMContentLoaded', UL.restoreOptions);
document.getElementById('save').addEventListener('click', UL.saveOptions);
document.getElementById('list').addEventListener('keypress', UL.submitInput);
document.getElementById('options').addEventListener('click', UL.openHotkeySettings);
document.getElementById('open_list').addEventListener('click', UL.openListLink);
