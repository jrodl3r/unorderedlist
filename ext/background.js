// ==========================================================================
// UnorderedList Chrome Button
// ==========================================================================

var UL = {

  domain       :  'http://localhost:3000/', //'http://unorderedlist.com/', TODO Remove Testing Host
  list         :  'foo',  // TODO Make User Setting
  placeholder  :  null,   // TODO Swap w/ 'proxy'


  // Process Key Command
  processCommand: function processCommand(command) {

    var url, item_data;
    UL.setupPlaceholder();

    // Paste (POST Item)
    if (command === 'paste') {
      document.execCommand('paste');
      url = UL.domain + UL.list;
      item_data = '{"item":"' + UL.placeholder.innerText + '"}';
      UL.sendData(url, item_data);
    }
    // Copy (GET Item)
    else if (command === 'copy') {
      url = UL.domain + 'get/' + UL.list;
      UL.getData(url);
    }
  },


  // Send JSON Data (Paste Item)
  sendData: function sendData(url, item_data) {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {

          // TODO Add Success Notification
          console.log('success: ' + UL.placeholder.innerText);
          UL.removePlaceholder();

        } else {

          // TODO Add Error Notification
          console.error('error sending list item!');
          UL.removePlaceholder();
        }
      }
    };
    xhr.send(item_data);
  },


  // Get JSON Data
  getData: function getData(url) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          UL.placeholder.innerText = response.body;
          document.execCommand('SelectAll');
          document.execCommand('copy');

          // TODO Add Success Notification
          console.log('success: ' + UL.placeholder.innerText);
          UL.removePlaceholder();

        } else {

          // TODO Add Error Notification
          console.error('error getting list item!');
          UL.removePlaceholder();
        }
      }
    };
    xhr.send();
  },


  // Add Placeholder Element
  setupPlaceholder: function setupPlaceholder() {

    UL.placeholder = document.createElement('div');
    UL.placeholder.id = 'clip';
    UL.placeholder.contentEditable = true;
    document.body.appendChild(UL.placeholder);
    UL.placeholder = document.getElementById('clip');
    UL.placeholder.focus();
  },


  // Remove Placeholder Element
  removePlaceholder: function removePlaceholder() {

    UL.placeholder.remove();
  }
};

// Add Command Listener
chrome.commands.onCommand.addListener(UL.processCommand);
