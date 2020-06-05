import Vue from "vue";
import App from "../src/popup/App";

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
/*
    it ('togglePreset', () => {
        expect(1).toBe(2);
    });

    it ('setPreset', () => {
        expect(1).toBe(2);
    });

    it ('removePreset', () => {
        expect(1).toBe(2);
    });

    it ('addOpenlistSite', () => {
        expect(1).toBe(2);
    });
*/
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
    
    it ('toogleSite', () => {
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
