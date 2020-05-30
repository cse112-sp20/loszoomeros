import Vue from "vue";
import App from "../src/popup/App";

// This temporarly disables Vue.js warnings about custom components.
// Remove this line once they are properly registered.
//Vue.config.silent = true;

// This temporarly disables console error messages.
// Remove this line once the error is gone.
//console.error = function() {}

describe("App Method Unit Test", () => {
    let cmp, vm;

    beforeEach(() => {
        cmp = Vue.extend(App);
        vm = new cmp().$mount();
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
        var before, after;

        before = vm.index;
        vm.storeLocalIndex(before + 1);
        chrome.storage.local.get(['index'], function(result) {
            after = result.index;
        });

        expect(after).toEqual(before + 1);
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
        })

        expect(website.enabled).toEqual(!enabled_before);
        expect(list_after).toEqual(vm.list);
        expect(chrome.storage.local.set).toHaveBeenCalled();
    });

    it ('encode', () => {
        expect('X104xX101xX108xX108xX111x').toBe(vm.encode('hello'));
        expect('X84xX101xX115xX116xX49xX50xX51x').toBe(vm.encode('Test123'));
        expect('X33xX64xX35xX32xX32xX32xX94xX38xX42x').toBe(vm.encode('!@#   ^&*'));
    });
});
