global.browser = require('webextension-polyfill')

var appEnabled = false;
var storageChange;
var localList = [ ];
var blacklist = [ ];
var openlist = [ ];
var listIndex = 0;
var debug = false


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

function updateLists() {
  if (debug)
    alert("Updating lists");
  blacklist = localList[listIndex].blacklist;
  openlist = localList[listIndex].openlist;
} 

function openTabs() {
  var i;
  for (i = 0; i < openlist.length; i++) {
    if (openlist[i].enabled) {
      //The string concatenation below was added to make auto-open and blacklisted inputs similar
      chrome.tabs.create({ url: 'http://' + openlist[i].site })
    }  
  }
}