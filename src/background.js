global.browser = require('webextension-polyfill')

var appEnabled = false;
var storageChange;
var localList = [ ];
var blacklist = [ ];
var openlist = [ ];
var listIndex = 0;


chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    storageChange = changes[key];
    alert("Change detected");
    if (key == "list") {
      localList = changes[key].newValue;
      alert("list changed");
    }
    if (key == "index") {
      listIndex = changes[key].newValue;
      alert("index changed");
    }
    if (key == "appEnabled") {
      appEnabled = changes[key].newValue;
      if (appEnabled) {
        openTabs();
      }
      alert("appEnabled changed");
    }
    
  }
  updateLists();
  updateListener();
});

function updateListener() {
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
  alert("Updating lists");
  blacklist = localList[listIndex].blacklist;
  openlist = localList[listIndex].openlist;
} 

function openTabs() {
  for (i = 0; i < openlist.length; i++) {
    if (openlist[i].enabled) {
      chrome.tabs.create({ url: openlist[i].site })
    }  
  }
}