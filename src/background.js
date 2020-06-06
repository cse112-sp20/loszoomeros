/**
 * Script that runs at all times when the extension is loaded.
 * @file 
 * @module background.js
 * @author Paul Larsen 
 */



global.browser = require('webextension-polyfill')



var appEnabled = false;
var storageChange;
var localList = [ ];
var blacklist = [ ];
var openlist = [ ];
var listIndex = 0;
var debug = false



chrome.storage.local.get({ appEnabled: appEnabled }, function(result) {
  appEnabled = result.appEnabled; //Using var b because our data parameters are not in this scope
});

chrome.storage.local.get({ index: listIndex }, function(result) {
  listIndex = result.index; //Using var c because our data parameters are not in this scope
});

chrome.storage.local.get({ list: localList }, function(result) {
  localList = result.list; //Using var a because our data parameters are not in this scope
});

/**  
 * @event
 * @name 'chrome.storage.onChanged'
 * @description
 * Detects when chrome storage is changed and updates the local variables.
 * Calls updateLists() and updateListener() when a change is detected.
 * When appEnabled is toggled to true, it also calls openTabs().
 * @author Paul Larsen
 */
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    storageChange = changes[key];
    if (debug)
      alert("Change detected");
    if (key == "list") {
      localList = changes[key].newValue;
      if (debug)
        alert("list changed");
    }
    if (key == "index") {
      listIndex = changes[key].newValue;
      if (debug)
        alert("index changed");
    }
    if (key == "appEnabled") {
      appEnabled = changes[key].newValue;
      if (appEnabled) {
        openTabs();
      }
      if (debug)
        alert("appEnabled changed");
    }
    
  }
  updateLists();
  updateListener();
});

/**
 * @function updateListener
 * @description 
 * Called when a storage change is detected.
 * Updates the chrome.tabs listener that checks for blacklisted websites and removes them.
 * @author Paul Larsen 
 */
function updateListener() {
  if (debug)
    alert("Updating listener");
  chrome.tabs.onUpdated.addListener(function (id, info, tab) {
    if (appEnabled) {
      var i;    
      for (i = 0; i < blacklist.length; i++) {
        if (blacklist[i].enabled && (tab.url.toLowerCase().indexOf(blacklist[i].site) != -1)) {
          chrome.tabs.remove(tab.id);
        }
      }
    }
  })
}

/**
 * @function updateLists
 * @description 
 * Called when a storage change is detected.
 * Updates the blacklist and openlist vars for local use.
 * @author Paul Larsen 
 */
function updateLists() {
  if (debug)
    alert("Updating lists");
  blacklist = localList[listIndex].blacklist;
  openlist = localList[listIndex].openlist;
} 

/**
 * @function openTabs
 * @description 
 * Called when a storage change is detected and appEnabled has been toggled to true.
 * Opens the urls listed in the openlist var.
 * @author Paul Larsen 
 */
function openTabs() {
  var i;
  for (i = 0; i < openlist.length; i++) {
    if (openlist[i].enabled) {
      //The string concatenation below was added to make auto-open and blacklisted inputs similar
      chrome.tabs.create({ url: 'http://' + openlist[i].site })
    }  
  }
}