/**
 * Script that handles calendar interactions.
 * @file 
 * @module backgroundCalendar.js
 * @author Paul Larsen 
 * 
 * 
 */
var $ = require('jquery');

var localCal = [];
var localList = [];

var debug = false;
const apiURLAdd = 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/quickAdd';
const apiURLList = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';

/**  
 * @event
 * @name 'chrome.storage.onChanged'
 * @description
 * Detects when chrome storage is changed and updates the local calendar schedule.
 * Calls calendarTrigger and addAlarm
 * @author Paul Larsen
 */
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (debug)
            alert('Change detected in ' + key);
        if (key == 'cal') {
            var prevsize = localCal.length; //Number of events added
            localCal = changes[key].newValue;
            calendarTrigger(localCal.length - prevsize);
            addAlarm(localCal.length - prevsize);

        }

    }

});



/**  
 * @event
 * @name 'chrome.storage.onChanged'
 * @description
 * Detects when an alarm is triggered.
 * Triggers the extension with the corresponding preset activated
 * @author Paul Larsen
 */
chrome.alarms.onAlarm.addListener(function (alarm) {
    var index = parseInt(alarm.name); //Alarm names are the index of the corresponding schedule objects in the calendar schedule

    //Getting the schedule list. We grab the preset name using index
    chrome.storage.local.get({ cal: localCal }, function (result) {
        localCal = result.cal;
        if (index < localCal.length) {
            var name = localCal[index].preset;

            //Getting the preset list
            chrome.storage.local.get({ list: localList }, function (result) {
                localList = result.list;
                for (var i = 0; i < localList.length; i++) {
                    if (debug) {
                        alert(name + ' : ' + localList[i].strings.name);
                    }
                    //If we find the preset that matches to name, trigger it
                    if (name == localList[i].strings.name) {
                        triggerApp(i);
                        // if (debug) //This might be good for normal use outside of debug, or some sort of notification
                        alert('Zoomero turning on! Using preset: ' + name);
                    }
                }
            });
        }
    });

});



/**
 * @function calendarTrigger
 * @description 
 * Runs when a new event is added to the schedule.
 * Authenticates the user using chrome.identity, retrieves their calendar, and adds the new event to the calendar.
 * Used Manas Tungare's Google Calendar extension for reference: https://chrome.google.com/webstore/detail/google-calendar/gmbgaklkmjakoegficnlkhebmhkjfich
 * @author Paul Larsen 
 */
function calendarTrigger(num) {

    //Oauth
    chrome.identity.getAuthToken({ interactive: true }, function (authToken) {
        if (debug) {
            alert(authToken);
        }

        //This generates the request for the calendar list, which we take the first calendar from.
        $.ajax(apiURLList, {
            headers: { 'Authorization': 'Bearer ' + authToken },
            success: function (data) {
                var calendar = data.items[0];
                var sch = localCal[localCal.length - 1];
                alert('Calendar for : ' + calendar.id);
                //Generating a quickadd string to present the event nicely on the user's calendar
                var schedData = 'Zoomero ' + sch.preset + ' on ' + sch.calDate + ' from ' + sch.startTime.slice(0, 5) + ' to ' + sch.endTime.slice(0, 5);
                //Making the url for the post request that adds the event to the calendar
                var quickAddUrl = apiURLAdd.replace('{calendarId}', encodeURIComponent(calendar.id)) + '?text=' + encodeURIComponent(schedData);
                $.ajax(quickAddUrl, {
                    type: 'POST',
                    headers: { 'Authorization': 'Bearer ' + authToken },
                    success: function (response) {
                        alert('Added to your calendar!');
                    },
                    error: function (response) {
                        alert('There was an issue adding the event to your calendar...');
                        if (response.status === 401) {
                            chrome.identity.removeCachedAuthToken({ 'token': authToken }, function () { });
                        }
                    }
                });
            },
            error: function (response) {
                alert('Failed to retrieve calendar');
                if (response.status === 401) {
                    chrome.identity.removeCachedAuthToken({ 'token': authToken }, function () { });
                }
            }
        });
    });
}

/**
 * @function addAlarm
 * @description 
 * Runs when a new event is added to the schedule.
 * Creates a corresponding alarm that will trigger at the specified time.
 * @param num {int} Not currently implemented, but will be useful for adding multiple alarms when recuring events are implemented.
 * @author Paul Larsen 
 */
function addAlarm(num) {
    var sch = localCal[localCal.length - 1];
    var date = new Date(sch.calDate + ' ' + sch.startTime);
    var alarmInfo = { when: date.getTime() };
    chrome.alarms.create('' + (localCal.length - 1), alarmInfo);
    if (debug)
        alert('Alarm added!');
}

/**
 * @function triggerApp
 * @description 
 * Runs when an alarm with a corresponding preset is triggered.
 * Sets the index for background.js, and turns the app off an then on to guarantee that tabs are opened.
 * @param index {int} Index for the preset list that background.js needs to use to open/block tabs.
 * @author Paul Larsen 
 */
function triggerApp(index) {
    chrome.storage.local.get({ list: localList }, function (result) {
        localList = result.list;
        for (i = 0; i < localList.length; i++) {
            localList[i].value = false;
        }
        localList[index].value = true;
        chrome.storage.local.set({ appEnabled: false, index: index, list: localList }, function () {
            chrome.storage.local.set({ appEnabled: true }, function () {
                chrome.storage.local.get({ update: false }, function (result) {
                    chrome.storage.local.set({ update: !result.update }, function () {});
                });
            });
        });
        // chrome.storage.local.set({ index: index }, function () {
        //     chrome.storage.local.set({ appEnabled: false }, function () {
        //         chrome.storage.local.set({ appEnabled: true }, function () { });
        //     });
        // });
    });
}



//global.browser = require('webextension-polyfill')

