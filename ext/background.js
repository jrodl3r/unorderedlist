// ==========================================================================
// UnorderedList Chrome Button
// ==========================================================================

var UL = {

  clip_id      :  'clip',
  domain       :  'http://unorderedlist.com/',
  url          :  '',
  list         :  'foo', // TODO Make User Setting
  item_data    :  '',
  placeholder  :  null,


  // Process Key Command
  processCommand: function processCommand(command) {

    console.log('Command Event: ' + command);


    // Paste » POST List Item
    if (command === 'paste') {

      UL.setupPlaceholder();
      document.execCommand('paste');

      UL.url = UL.domain + UL.list;
      UL.item_data = '{"item":"' + UL.placeholder.innerText + '"}';

      var xhr = new XMLHttpRequest();
      xhr.open('POST', UL.url, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(UL.item_data);

      console.log(UL.placeholder.innerText);
      UL.removePlaceholder();
    }


    // Copy » GET List Item
    if (command === 'copy') {

      UL.setupPlaceholder();
      UL.url = UL.domain + 'get/' + UL.list;

      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            UL.placeholder.innerText = xhr.responseText;
            document.execCommand('SelectAll');
            document.execCommand('copy');
            console.log(UL.placeholder.innerText);
            //UL.removePlaceholder();

          } else {
            console.log('error getting list data!');
          }
        }
      };

      xhr.open('GET', UL.url, true);
      xhr.setRequestHeader('Content-type', 'text/plain');
      xhr.send();
    }

    console.log('END: ' + UL.placeholder.innerText);
  },


  // Get JSON Data
  getData: function getData() {

    var xhr = new XMLHttpRequest();

  },


  // Send JSON Data
  sendData: function sendData() {

    var xhr = new XMLHttpRequest();

  },


  // Add Placeholder Element
  setupPlaceholder: function setupPlaceholder() {

    UL.placeholder = document.createElement('div');
    UL.placeholder.id = UL.clip_id;
    UL.placeholder.contentEditable = true;
    document.body.appendChild(UL.placeholder);
    UL.placeholder = document.getElementById(UL.clip_id);
    UL.placeholder.focus();
  },


  // Remove Placeholder Element
  removePlaceholder: function removePlaceholder() {

    UL.placeholder.remove();
  }
};

// Add Command Listener
chrome.commands.onCommand.addListener(UL.processCommand);
