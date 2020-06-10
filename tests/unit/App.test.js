import Vue from "vue";
import App from "../../src/popup/App";

// This temporarly disables Vue.js warnings about custom components.
// Remove this line once they are properly registered.
Vue.config.silent = true;

// This temporarly disables console error messages.
// Remove this line once the error is gone.
console.error = function() {}

describe("App Method Unit Test", () => {
    let cmp, vm;

    const calStub = {
        methods: {
            getData() {}
        }
    };

    beforeEach(() => {
        cmp = Vue.extend(App);
        vm = new cmp({
            components: {
                calComp: calStub
            }
        }).$mount();
    });

    afterEach(() => {
        //wrapper.destroy();
    }) 

    it ('addOpenlistSite', () => {
        //Add new site to empty openlist
        var preset1 = {strings: {name: "preset1", blockInput: ""}, blacklist: [{site: "bing.com"}, {site: "google.com"}], openlist: [], value: false};
        var preset2 = {strings: {name: "preset2", blockInput: ""}, blacklist: [], openlist: [{site: "slack.com"}, {site: "github.com"}], value: false};
        var preset3 = {strings: {name: "preset3", blockInput: ""}, blacklist: [{site: "spotify.com"}, {site: "youtube.com"}], openlist: [], value: false};
        var presetList = [preset1, preset2, preset3];
        vm.list = presetList;
        vm.list[0].strings.openInput = "facebook.com";

        vm.addOpenlistSite(vm.list[0]);

        var newList;
        chrome.storage.local.get(['list'], function(result) {
            newList = result.list;
        });

        expect(chrome.storage.local.set).toHaveBeenCalled();
        expect(vm.list[0].openlist.length).toBe(1);
        expect(vm.list[0].openlist[0].site).toEqual("facebook.com");
        expect(vm.list).toBe(newList);

        //Add new site to existing openList
        var len = vm.list[1].openlist.length;
        vm.list[1].strings.openInput = "youtube.com";
        vm.addOpenlistSite(vm.list[1]);

        chrome.storage.local.get(['list'], function(result) {
            newList = result.list;
        });

        expect(chrome.storage.local.set).toHaveBeenCalled();
        expect(vm.list[1].openlist.length).toBe(len + 1);
        expect(vm.list[1].openlist[len].site).toEqual("youtube.com");
        expect(vm.list[1].strings.openInput).toEqual("");
        expect(vm.list).toBe(newList);

        //Add same site to existing openList
        len = len + 1;
        vm.list[1].strings.openInput = "youtube.com";
        vm.addOpenlistSite(vm.list[1]);

        chrome.storage.local.get(['list'], function(result) {
            newList = result.list;
        });

        expect(chrome.storage.local.set).toHaveBeenCalled();
        expect(vm.list[1].openlist.length).toBe(len + 1);
        expect(vm.list[1].openlist[len].site).toEqual("youtube.com");
        expect(vm.list).toBe(newList);
    });

    it ('togglePreset', () => {
        //Toggle preset to true when all are false
        var preset1 = {strings: {name: "preset1", blockInput: ""}, blacklist: [{site: "bing.com"}, {site: "google.com"}], openlist: [], value: false};
        var preset2 = {strings: {name: "preset2", blockInput: ""}, blacklist: [], openlist: [{site: "slack.com"}, {site: "github.com"}], value: false};
        var preset3 = {strings: {name: "preset3", blockInput: ""}, blacklist: [{site: "spotify.com"}, {site: "youtube.com"}], openlist: [], value: false};
        var presetList = [preset1, preset2, preset3];
        vm.list = presetList;
        vm.togglePreset(vm.list[1], 1);

        var tempPreset = preset2;
        tempPreset.value = true;

        //expect(vm.index).toBe(1);
        expect(vm.list).toEqual([preset1, tempPreset, preset3]);

        //Toggle preset to true when a different one is true
        vm.togglePreset(vm.list[2], 2);

        tempPreset = preset3;
        tempPreset.value = true;

        //expect(vm.index).toBe(2);
        expect(vm.list).toEqual([preset1, preset2, tempPreset]);

        //Toggle preset to false
        vm.togglePreset(vm.list[2], 2);

        var newList;
        chrome.storage.local.get(['list'], function(result) {
            newList = result.list;
        });

        //expect(vm.index).toBe(0); 
        expect(vm.list).toEqual(presetList);
        expect(vm.list).toEqual(newList);
    });

    it ('removePreset', () => {
        //Removing a preset from a list of inactivated presets
        var preset1 = {strings: {name: "preset1", blockInput: ""}, blacklist: [{site: "bing.com"}, {site: "google.com"}], openlist: [], value: false};
        var preset2 = {strings: {name: "preset2", blockInput: ""}, blacklist: [], openlist: [{site: "slack.com"}, {site: "github.com"}], value: false};
        var preset3 = {strings: {name: "preset3", blockInput: ""}, blacklist: [{site: "spotify.com"}, {site: "youtube.com"}], openlist: [], value: false};
        var preset4 = {strings: {name: "preset4", blockInput: ""}, blacklist: [], openlist: [{site: "basecamp.com"}], value: false};
        var presetList = [preset1, preset2, preset3, preset4];
        vm.list = presetList;
        vm.removePreset(3);

        var newList;
        chrome.storage.local.get(['list'], function(result) {
            newList = result.list;
        });

        expect(vm.list.length).toBe(3);
        expect(vm.list).toEqual([preset1, preset2, preset3]);
        //expect(vm.index).toBe(0); //Or whatever is the default index for when there are no active presets
        expect(vm.list).toEqual(newList);

        //Removing an inactive preset from a list of presets when another preset is active
        vm.togglePreset(vm.list[2], 2);
        vm.removePreset(1);
        
        chrome.storage.local.get(['list'], function(result) {
            newList = result.list;
        });

        expect(vm.list).toEqual([preset1, {strings: {name: "preset3", blockInput: ""}, blacklist: [{site: "spotify.com"}, {site: "youtube.com"}], openlist: [], value: true}]);
        expect(vm.index).toBe(1);
        expect(vm.list).toEqual(newList);

        //Removing an active preset
        vm.togglePreset(vm.list[1], 1);
        vm.removePreset(1);
        
        chrome.storage.local.get(['list'], function(result) {
            newList = result.list;
        });

        expect(vm.list).toEqual([preset1]);
        //expect(vm.index).toBe(0);
        expect(vm.list).toEqual(newList);

        //Removing all presets
        vm.removePreset(0);

        chrome.storage.local.get(['list'], function(result) {
            newList = result.list;
        });

        expect(vm.list.length).toBe(0);
        //expect(vm.index).toBe(0);
        expect(vm.list).toEqual(newList);
    });

    it ('setExistingPreset', () => {
        //Setting an existing preset that is also currently activated
        var preset1 = {strings: {name: "preset1", blockInput: ""}, blacklist: [{site: "bing.com"}, {site: "google.com"}], openlist: [], value: true};
        var preset2 = {strings: {name: "preset2", blockInput: ""}, blacklist: [], openlist: [{site: "slack.com"}, {site: "github.com"}], value: false};
        var preset3 = {strings: {name: "preset3", blockInput: ""}, blacklist: [{site: "spotify.com"}, {site: "youtube.com"}], openlist: [], value: false};
        var presetList = [preset1, preset2, preset3];
        vm.list = presetList;

        //expect(vm.index).toBe(0);

        vm.newPreset = preset1.strings.name;
        vm.setPreset();

        var newList;
        chrome.storage.local.get(['list'], function(result) {
            newList = result.list;
        });

        expect(vm.list).toEqual([preset1, preset2, preset3]);
        expect(vm.list).toBe(newList);
        //expect(vm.newPreset.valueOf()).toBe("".valueOf());
        //expect(vm.index).toBe(0);

        //Setting an existing preset that is *not* currently activated (and thus the activated preset should be disactivated and the existing preset activated)
        vm.newPreset = preset3.strings.name;
        vm.setPreset();

        chrome.storage.local.get(['list'], function(result) {
            newList = result.list;
        });

        expect(vm.list).toStrictEqual([{strings: {name: "preset1", blockInput: ""}, blacklist: [{site: "bing.com"}, {site: "google.com"}], openlist: [], value: false}, preset2, {strings: {name: "preset3", blockInput: ""}, blacklist: [{site: "spotify.com"}, {site: "youtube.com"}], openlist: [], value: true}]);
        expect(vm.list).toBe(newList);
        //expect(vm.index).toBe(2);
        expect(vm.list[0].value).toBe(false);
        expect(vm.list[2].value).toBe(true);

    });

    it ('setNewPreset', () => {
        var preset1 = {strings: {name: "preset1", blockInput: ""}, blacklist: [{site: "bing.com"}, {site: "google.com"}], openlist: [], value: true};
        var preset2 = {strings: {name: "preset2", blockInput: ""}, blacklist: [], openlist: [{site: "slack.com"}, {site: "github.com"}], value: false};
        var preset3 = {strings: {name: "preset3", blockInput: ""}, blacklist: [{site: "spotify.com"}, {site: "youtube.com"}], openlist: [], value: false};
        var presetList = [preset1, preset2, preset3];

        
        vm.list = presetList;
        //vm.togglePreset(vm.list[0], 0);

        vm.newPreset = "preset4";
        vm.setPreset();

        var newList;
        chrome.storage.local.get(['list'], function(result) {
            newList = result.list;
        });

        var preset4 = {strings: {name: "preset4", openInput: "", blockInput: ""}, color: "#E8D2AE", blacklist: [], openlist: [], value: true};
        
        expect(vm.list.length).toBe(4);
        //expect(vm.index).toBe(3);
        expect(vm.newPreset).toBe("");
        //expect(vm.list[vm.index]).toEqual(preset4);
    });

    
    it ('addBlacklistSite', () => {
        var old_blacklist_length, old_list, new_list;

        vm.list = [{strings: {blockInput: ""}, blacklist: [{site: "youtube.com"}, {site: "facebook.com"}]}];
        vm.list[0].strings.blockInput = "twitter.com";
        old_list = [{strings: {blockInput: ""}, blacklist: [{site: "youtube.com"}, {site: "facebook.com"}]}];
        old_list[0].blacklist.push({site: "twitter.com"});
        old_blacklist_length = vm.list[0].blacklist.length;

        vm.addBlacklistSite(vm.list[0]);

        chrome.storage.local.get(['list'], function(result) {
            new_list = result.list;
        });

        expect(chrome.storage.local.set).toHaveBeenCalled();
        expect(vm.list[0].blacklist.length).toBe(old_blacklist_length + 1);
        expect(vm.list[0].blacklist[old_blacklist_length].site).toBe("twitter.com");
        expect(vm.list).toBe(new_list);
    });

    it ('removeSite', () => {
        var new_list;
        
        vm.list = [1, 2, 3];

        vm.removeSite(vm.list, 1);

        chrome.storage.local.get(['list'], function(result) {
            new_list = result.list;
        });

        expect(new_list).toStrictEqual([1, 3]);
        expect(vm.list).toStrictEqual([1, 3]);
    });

    it ('getData', () => {
        vm.list = [];
        vm.appOn = false;
        vm.index = 0;

        chrome.storage.local.set({list: [1, 2, 3]}, function(result) {});
        chrome.storage.local.set({appEnabled: true}, function(result) {});
        chrome.storage.local.set({index: 1}, function(result) {});

        vm.getData();

        expect(vm.list).toStrictEqual([1, 2, 3]);
        expect(vm.appOn).toBe(true);
        expect(vm.index).toBe(1);
    });

    it ('trackChange', () => {
        vm.list = [];
        vm.appOn = false;
        vm.index = 0;
        vm.a = [1, 2, 3];
        vm.b = true;
        vm.c = 1;

        vm.trackChange(0);

        setTimeout(function() {
            expect(vm.list).toBe([1, 2, 3]);
            expect(vm.appOn).toBe(true);
            expect(vm.index).toBe(1);
            done();
        }, 1100);
    });

    it ('storeLocalList', () => {
        var after;

        vm.list = [1, 2, 3];
        vm.storeLocalList();
        chrome.storage.local.get(['list'], function(result) {
            after = result.list;
        });

        expect(after).toEqual(vm.list);
        expect(chrome.storage.local.set).toHaveBeenCalled();
    });
    
    it ('storeLocalIndex', () => {
        var new_index;

        vm.storeLocalIndex(vm.index + 1);
        chrome.storage.local.get(['index'], function(result) {
            new_index = result.index;
        });

        expect(new_index).toBe(vm.index + 1);
        expect(chrome.storage.local.set).toHaveBeenCalled();
    });

    it ('storeLocalEnabled', () => {
        var before, after;
        
        before = vm.appOn;
        vm.appOn = !vm.appOn;
        vm.storeLocalEnabled();
        chrome.storage.local.get(['appEnabled'], function(result) {
            after = result.appEnabled;
        });

        expect(after).toEqual(!before);
        expect(chrome.storage.local.set).toHaveBeenCalled();
    });

    it ('appEnable', () => {
        var appOn_before, appOn_after, appEnabled_after;

        appOn_before = vm.appOn;
        vm.list = [{value: true}];
        vm.appEnable();
        appOn_after = vm.appOn;
        chrome.storage.local.get(['appEnabled'], function(result) {
            appEnabled_after = result.appEnabled;
        });

        expect(vm.appOn).toEqual(!appOn_before);
        expect(appEnabled_after).toEqual(vm.appOn);
        expect(chrome.storage.local.set).toHaveBeenCalled();
    });
    
    it ('toggleSite', () => {
        var website, enabled_before, list_after;

        website = {site: "stackoverflow.com", enabled: true};
        vm.list = website;
        enabled_before = website.enabled;
        vm.toggleSite(website);
        chrome.storage.local.get(['list'], function(result) {
            list_after = result.list;
        });

        expect(website.enabled).toEqual(!enabled_before);
        expect(list_after).toEqual(vm.list);
        expect(chrome.storage.local.set).toHaveBeenCalled();
    });

    it ('refresh', () => {
        chrome.storage.local.set({list: [1, 2, 3]}, function(result) {});
        chrome.storage.local.set({appEnabled: true}, function(result) {});
        chrome.storage.local.set({index: 1}, function(result) {});

        vm.list = [];
        vm.appOn = false;
        vm.index = 0;

        vm.refresh();

        expect(vm.list).toStrictEqual([1, 2, 3]);
        expect(vm.appOn).toBe(true);
        expect(vm.index).toBe(1);
    });

    it ('encode', () => {
        expect('X104xX101xX108xX108xX111x').toBe(vm.encode('hello'));
        expect('X84xX101xX115xX116xX49xX50xX51x').toBe(vm.encode('Test123'));
        expect('X33xX64xX35xX32xX32xX32xX94xX38xX42x').toBe(vm.encode('!@#   ^&*'));
    });
});
