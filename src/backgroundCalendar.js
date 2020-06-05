/**
 * Script that runs at all times when the extension is loaded.
 * @file 
 * @module calendar.js
 * @author Paul Larsen 
 */
var authTok;
alert(1);
chrome.identity.getAuthToken({ interactive: true }, function (token) {
    alert(token);
    authTok = token;
    chrome.identity.removeCachedAuthToken({'token': authTok});
    
});
alert(2);

alert(3);

//global.browser = require('webextension-polyfill')

