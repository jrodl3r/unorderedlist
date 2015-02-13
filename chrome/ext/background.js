// ==========================================================================
// UnorderedList: Chrome Extension Core
// ==========================================================================
'use strict';

var UL = {

  init: function init() {

    this.domain = 'http://unorderedlist.com/';
    this.proxy = null;
    this.getListName();
  },

  // Load Stored List Name
  getListName: function getListName() {

    chrome.storage.sync.get('list', function (result) {
      if (result.list) {
        UL.setListName(result.list);
      }
    });
  },

  // Update List Name
  setListName: function setListName(list_name) {

    if (this.list_name !== list_name) {
      this.list_name = list_name;
      //console.log('list updated: ' + list_name);
    }
  },

  //
  processStorage: function processStorage(changes, namespace) {

    if(changes.list) {
      UL.setListName(changes.list.newValue);
    }
  },

  // Process Input
  processCommand: function processCommand(command) {

    var url, item_data;
    UL.setupProxy();
    // Paste Item (POST)
    if (command === 'paste') {
      document.execCommand('paste');
      url = UL.domain + encodeURI(UL.list_name);
      item_data = JSON.stringify({ item: UL.proxy.innerText });
      UL.sendData(url, item_data);
    }
    // Copy Item (GET)
    else if (command === 'copy') {
      url = UL.domain + 'get/' + encodeURI(UL.list_name);
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
          UL.removeProxy();
          //console.log('pasted: ' + UL.proxy.innerText);
        } else {
          UL.notify('Error Adding Item!', 'fail');
          UL.removeProxy();
          //console.error('error sending list item!');
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
          UL.removeProxy();
          //console.log('copied: ' + UL.proxy.innerText);
        } else {
          UL.notify('Error Copying Item!', 'fail');
          UL.removeProxy();
          //console.error('error getting list item!');
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
  },

  // Broadcast Installed State
  isInstalled: function isInstalled(request, sender, sendResponse) {

    if (request && request.message === 'isInstalled') {
      sendResponse({ status: true });
    }
    return true;
  }
};

document.addEventListener('DOMContentLoaded', UL.init());
chrome.commands.onCommand.addListener(UL.processCommand);
chrome.storage.onChanged.addListener(UL.processStorage);
chrome.runtime.onMessageExternal.addListener(UL.isInstalled);
