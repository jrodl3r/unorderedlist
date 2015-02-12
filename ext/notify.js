/*globals message, status */
"use strict";

// TODO Clean this up!

if (document.getElementById('ul_notify')) {
  document.getElementById('ul_notify').remove();
}

var div = document.createElement('div');
div.id = 'ul_notify';
document.body.appendChild(div);
var notify = document.getElementById('ul_notify');
notify.innerText = message;
notify.setAttribute('style', 'position: fixed; top: 0; right: 0; left: 0; z-index: 9999; height: 24px; line-height: 22px; width: 200px; margin: 5px auto; padding: 0; color: #fff; text-align: center; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; border-radius: 7px; opacity: 1; -webkit-transition: opacity 1.5s ease-in-out;');
//border: 1px solid #fff;

if (status === 'pass') {
  notify.style.color = '#04840B';
  notify.style.backgroundColor = '#8EEC8E';
  //notify.style.boxShadow = '0 0 5px rgba(0,255,0,0.5)';
} else if (status === 'fail') {
  notify.style.color = '#840404';
  notify.style.backgroundColor = '#EC8E8E';
  //notify.style.boxShadow = '0 0 5px rgba(255,0,0,0.5)';
}

setTimeout( function () {
  notify.style.opacity = '0';
}, 1);

setTimeout( function () {
  notify.remove();
}, 1500);
