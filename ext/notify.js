/*globals message, status */
"use strict";

if (!document.getElementById('ul_notify')) {
  var div = document.createElement('div');
  div.id = 'ul_notify';
  document.body.appendChild(div);
  var notify = document.getElementById('ul_notify');
}

notify.innerText = message;
notify.setAttribute('style', 'position: fixed; top: 0; right: 0; left: 0; z-index: 9999; height: 24px; line-height: 24px; width: 200px; margin: 5px auto; padding: 0; color: #fff; text-align: center; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; border-radius: 7px;');

if (status === 'pass') {
  notify.style.color = '#04840B';
  notify.style.backgroundColor = '#8EEC8E';
} else if (status === 'fail') {
  notify.style.color = '#840404';
  notify.style.backgroundColor = '#EC8E8E';
}

setTimeout( function () {
  notify.remove();
}, 750);
