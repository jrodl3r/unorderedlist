// ==========================================================================
// UnorderedList: Chrome Extension Options
// ==========================================================================
'use strict';

// Saves options to chrome.storage
function save_options() {

  var list_name = document.getElementById('list').value,
      status    = document.getElementById('status');

  // TODO Add Error Protection
  // TODO Add Pass/Fail Notification

  chrome.storage.sync.set({
    list: list_name
  }, function () {
    // Update status to let user know options were saved.
    status.className = 'pass';
    status.textContent = 'List Loaded!';
    setTimeout( function () {
      status.textContent = '';
      status.className = '';
    }, 2000);
  });
}

// Restores preferences from chrome.storage
function restore_options() {

  chrome.storage.sync.get({
    list: ''
  }, function (items) {
    document.getElementById('list').value = items.list;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('options').addEventListener('click', function (e) {
  e.preventDefault();
  chrome.tabs.create({url: 'chrome://extensions/configureCommands'});
});