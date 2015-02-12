// ==========================================================================
// UnorderedList: Chrome Extension Core
// ==========================================================================
'use strict';

var UL = {

  init: function init() {

    this.domain = 'http://localhost:3000/'; //'http://unorderedlist.com/'; TODO
    this.proxy = null;
    this.updateList();
  },

  // TODO Set List Name
  updateList: function setList(list_name) {

    if (list_name !== undefined) {
      this.list = list_name;
      console.log('list updated: ' + list_name);

    } else if (list_name !== this.list_name) {
      chrome.storage.sync.get('list', function (result) {
        // TODO Add Error Protection
        // TODO Add Pass/Fail Notification
        UL.updateList(result.list);
      });
    }
  },

  // Process Input
  processCommand: function processCommand(command) {

    var url, item_data;
    UL.setupProxy();
    // Paste Item (POST)
    if (command === 'paste') {
      document.execCommand('paste');
      url = UL.domain + UL.list;
      item_data = JSON.stringify({ item: UL.proxy.innerText });
      UL.sendData(url, item_data);
      UL.removeProxy();
    }
    // Copy Item (GET)
    else if (command === 'copy') {
      url = UL.domain + 'get/' + UL.list;
      UL.getData(url);
    }
  },

  // Send Data (Paste)
  sendData: function sendData(url, item_data) {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          UL.notify('Item Added!', 'pass');
          console.log('pasted: ' + UL.proxy.innerText);
        } else {
          UL.notify('Error Adding Item!', 'fail');
          console.error('error sending list item!');
        }
      }
    };
    xhr.send(item_data);
  },

  // Get Data (Copy)
  getData: function getData(url) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          UL.updateClipboard(JSON.parse(xhr.responseText));
          UL.notify('Item Copied!', 'pass');
          console.log('copied: ' + UL.proxy.innerText);
          UL.removeProxy();
        } else {
          UL.removeProxy();
          UL.notify('Error Copying Item!', 'fail');
          console.error('error getting list item!');
        }
      }
    };
    xhr.send();
  },

  // Update Clipboard
  updateClipboard: function updateClipboard(item) {

    UL.proxy.innerText = item.body;
    document.execCommand('SelectAll');
    document.execCommand('copy');
  },

  // Add Placeholder
  setupProxy: function setupProxy() {

    UL.proxy = document.createElement('div');
    UL.proxy.id = 'clip';
    UL.proxy.contentEditable = true;
    document.body.appendChild(UL.proxy);
    UL.proxy = document.getElementById('clip');
    UL.proxy.focus();
  },

  // Remove Placeholder
  removeProxy: function removeProxy() {

    UL.proxy.remove();
  },

  // Show Notification
  notify: function notify(msg, status) {

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
      if (tabs[0].url.indexOf('chrome://') === -1) {
        chrome.tabs.executeScript(tabs[0].id, {
          code: 'var message = "' + msg + '", status = "' + status + '";'
        }, function () {
          chrome.tabs.executeScript(tabs[0].id, { file: 'notify.js' });
        });
      }
    });
  }

};

document.addEventListener('DOMContentLoaded', UL.init());
chrome.commands.onCommand.addListener(UL.processCommand);

// TODO
chrome.storage.onChanged.addListener( function (changes, namespace) {
  if(changes.list) {
    UL.updateList(changes.list.newValue);
  }
});
