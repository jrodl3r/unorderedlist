// ==========================================================================
// UnorderedList Chrome Button
// ==========================================================================

chrome.commands.onCommand.addListener(function(command) {

  console.log('Command Event: ' + command);

  // Setup Placeholder
  var div = document.createElement('div');
  div.id = 'clip';
  div.contentEditable = true;
  document.body.appendChild(div);
  div = document.getElementById('clip');
  div.focus();

  // Setup XHR
  var http      = new XMLHttpRequest(),
      url       = 'http://unorderedlist.com/',
      list      = 'foo'; // TODO Make User Setting
      item_data = '';


  // Paste / POST List Item
  if (command === 'paste') {

    document.execCommand('paste');

    url += list;
    item_data = '{"item":"' + div.innerHTML + '"}';

    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.send(item_data);

    console.log(div.innerHTML);
    div.remove();


  // Copy / GET List Item
  } else if (command === 'copy') {

    url += 'get/' + list;

    http.onreadystatechange = function () {
      if (http.readyState == 4) {

        div.innerHTML = http.responseText;
        document.execCommand('copy');

        console.log(div.innerHTML);
        div.remove();
      }
    };

    http.open('GET', url, true);
    http.setRequestHeader('Content-type', 'text/plain');
    http.send();
  }
});
