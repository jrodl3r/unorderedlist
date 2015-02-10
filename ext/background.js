// ==========================================================================
// UnorderedList Chrome Button
// ==========================================================================
'use strict';

var UL = {

  domain        :  'http://localhost:3000/', //'http://unorderedlist.com/', TODO Remove Testing Host
  list          :  'foo',  // TODO Make User Setting
  proxy         :  null,

  // Process Input
  processCommand: function processCommand(command) {

    var url, item_data;
    UL.setupProxy();
    // Paste Item (POST)
    if (command === 'paste') {
      document.execCommand('paste');
      url = UL.domain + UL.list;
      item_data = '{"item":"' + UL.proxy.innerText + '"}';
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
          // TODO Add Success Notification
          console.log('pasted: ' + UL.proxy.innerText);
        } else {
          // TODO Add Error Notification
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
          // TODO Add Success Notification
          console.log('copied: ' + UL.proxy.innerText);
          UL.removeProxy();
        } else {
          UL.removeProxy();
          // TODO Add Error Notification
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
  }
};

// Add Command Listener
chrome.commands.onCommand.addListener(UL.processCommand);
