<template>
  <div class="extension">
    <!-- Top Banner Area-->
    <div class="sticky-top banner" style="padding-top:4%">
      <div class="container">
        <!-- Banner Icons and Name -->
        <div class="row">
          <!-- Power Button -->
          <div class="col-3 text-center my-auto">
            <a class="my-auto" href="#" @click="appEnable" data-toggle="tooltip" data-placement="top" :title="(appOn) ? 'Turn off': 'Turn on'" ><icon name="power-off"></icon></a>
            <p>{{appOn ? "On" : "Off"}}</p>
          </div>
          <!-- Name Banner -->
          <div class="col-6 text-center">
            <h3>Zoomero</h3>
            <!-- <div :hidden="true" :id="':presetAdd:'" :style="block">
              <input v-model="newPreset" placeholder="Enter preset"> 
              <button @click="setPreset">Add</button> 
            </div> -->
          </div>
          
          <!-- Add Mode -->
          <div class="col-1 text-left">
            <a href="#mode-input" data-toggle="collapse" aria-haspopup="true" aria-expanded="false"><icon name="plus-circle"></icon></a>
          </div>
          <!-- Calendar -->
          <div class="col-1 text-right">
            <a href="#" data-toggle="tooltip" data-placement="top"><icon name="calendar-alt"></icon></a>
          </div>
          <!-- Blank Space For Even Spacing -->
          <div class="col-1 text-left">
          </div>

          <div id="mode-input" class="collapse">
            <div class="input-group mb-3">

              <input id="mode-in-field" v-model="newPreset" type="search" class="form-control" placeholder="Powell Memes" aria-label="Powell Memes" aria-describedby="basic-addon2">

              <div class="input-group-append">
                <button href="#mode-input" data-toggle="collapse" @click="setPreset" class="btn btn-outline-secondary" type="submit">Add</button>
              </div>

            </div>
          </div>
          

          <!-- <div class="dropdown-menu">
            <form class="px-8 py-2 text-center">
              <div class="form-group">
                <label for="exampleDropdownFormEmail1">Mode name</label>
                <input v-model="newPreset" class="form-control" id="exampleDropdownFormEmail1" placeholder="Powell Memes">
              </div>
              <button type="submit" @click="setPreset" class="btn btn-secondary btn-sm">Add</button>
            </form>
          </div> -->
        </div>
      </div>
    </div>
  
    <!-- <input v-model="keyword" placeholder="Enter keyword"> -->
    
    <!-- <p>Site Status: {{ isEnabled }}</p>
    <p>Extension Status: {{ isOn }}</p>

    <button @click="isEnabled = !isEnabled">Block</button>
    <button v-on:click="extState">On</button> -->
    <!-- <toggle-button :value="data_property" color="#82C7EB" :sync="true" :labels="true"  @change="changeDataProperty" /> -->




    <div class="container" v-for="(item, i) in list" :key="i">
      <div class="row my-auto">
        <!-- Coloumn for the main toggle for a mode -->
        <div class="col my-auto">
          <toggle-button
              class="my-auto"
              :value="item.value"
              :color="item.color"
              :sync="true"
              :labels="true"
              :key="i"
              @change="updateItemValue(item, i)"/>
        </div>
        <!-- Coloumn for the mode text (name of the mode) -->
        <div class="col my-auto text-left mode-title">
          {{item.name}}
        </div>
        <!-- Coloumn for the dropdown arrow -->
        <div class="col my-auto">
          <a class="nav-link dropdown-toggle" data-toggle="collapse" :href="'#' + item.name" aria-expanded="false"></a>
        </div>
      </div>
       <!-- A collapsable container for the drop down menu (the menu that shows sites in a mode) -->
      <div class="collapse" :id="item.name">
        <hr class="solid">
        <div id="auto-open">
          <div class="container">
            <div class="row bot-buffer">
              <div class="col-3">
                <!-- Do not put anything here -->
              </div>
              <div class="col-6 text-center">
                Auto-open
              </div>
              <div class="col-3 text-center">
                <a :href="'#'+item.name+'auto'" data-toggle="collapse" aria-haspopup="true" aria-expanded="false"><icon name="plus"></icon></a>
              </div>
            </div>
          </div>

          <div :id="item.name+'auto'" class="collapse">
            <div class="input-group mb-3">
              <input :id="item.name+'auto-op'" v-model="tabToOpen" type="search" class="form-control" placeholder="http://" aria-describedby="basic-addon2">
              <div class="input-group-append">
                <button :href="'#'+item.name+'auto'" class="btn btn-outline-secondary" data-toggle="collapse" @click="addOpenlistSite">Add</button>
              </div>
            </div>
          </div>
          

          <div class="container" v-for="(website, j) in item.openlist" :key="j" >
            <div class="row">
              <div class="col my-auto text-left">
                {{website.site}}
              </div>
              <div class="col my-auto text-right">
                <toggle-button class="my-auto" @change="toggleSite(website)" :value="website.enabled" :sync="true" :width="40" :height="18"/>
              </div>
            </div>
          </div>
        </div>
        <hr class="solid">
        <div class="container">
          <div class="row top-buffer bot-buffer">
            <div class="col-3">
              <!-- Do not put anything here -->
            </div>
            <div class="col-6 text-center">
              Blocked
            </div>
            <div class="col-3 text-center">
              <a :href="'#'+item.name+'block'" @click="toggleAdder(item.name + ':blockAdd')" data-toggle="collapse" aria-haspopup="true" aria-expanded="false"><icon name="plus"></icon></a>
            </div>
          </div>
        </div>

        <div :id="item.name+'block'" class="collapse">
          <div  class="input-group mb-3">
          <input :id="item.name+'auto-op'" v-model="tabToBlock" type="search" class="form-control" placeholder="Enter url..." aria-describedby="basic-addon2">
            <div class="input-group-append">
              <button :href="'#'+item.name+'block'" class="btn btn-outline-secondary" data-toggle="collapse" @click="addBlacklistSite">Add</button>
            </div>
          </div>
        </div>
        

        <div class="container" v-for="(website, k) in item.blacklist" :key="k" >
          <div class="row">
            <div class="col my-auto text-left">
              {{website.site}}
            </div>
            <div class="col my-auto text-right">
              <toggle-button class="my-auto"  @change="toggleSite(website)" :value="website.enabled" :sync="true" :width="40" :height="18"/>
            </div>
          </div>  
        </div>
      </div>
      <hr class="solid">
    </div>
    <!-- <button @click="storeData"> Save </button> -->
  </div>
</template>

<script>
var count = 0;
var a = [{name: "filler", openlist: [ {site: "filler", enabled: false} ] ,blacklist: [{ site: "filler", enabled: false }] }]; //make sure it equals this.list default state
var b = "";
var c = 0;
var i;
const browser = require("webextension-polyfill");
export default {
  
  data() {
    return {
      count:count,
      items: [
        { color: '#E8D2AE', value: false, mode: "Internship" },
        { color: '#CB8589', value: false, mode: "School" },
        { color: '#796465', value: false, mode: "Research" },
        { color: '#79BD8F', value: false, mode: "Projects" },
        { color: '#00A388', value: false, mode: "Secret" }
      ],
      modes: [],


      newPreset: "", //Input for selecting or creating preset
      //preset object for adding presets. We edit the objects child vars dynamically to simulate presets
      preset: {name: "default", color: '#E8D2AE', value: true, openlist: [ {site: "http://stackoverflow.com/", enabled: true} ], blacklist: [ {site: "twitter.com", enabled: true} ], },
      website: {site: "stackoverflow.com", enabled: true}, //object to hold website urls and a boolean for option editting (not yet implemented)
      currPreset: "None", //holds the name of the current preset for display, outside of readability, it's redundant 
      tabToOpen: "", //holds the text inputted for the openlist
      tabToBlock: "", //holds the text inputted for backlisting
      list: [{name: "Work", color: '#E8D2AE', value: false, openlist: [ {site: "http://google.com/", enabled: true}, {site: "http://stackoverflow.com/", enabled: true} ], blacklist: [ {site: "twitter.com/", enabled: true} ] }, {name: "CSE112", color: '#E8D2AE', value: false, openlist: [ {site: "http://basecamp.com/", enabled: true} ], blacklist: [ {site: "facebook.com/", enabled: true} ] }], //list of all our presets
      index: 0, //tracks the current preset
      appOn: false,
    };
  },
  // mounted () {
  //   var itemIndex = 0;
  //   setInterval(() => {
  //     this.updateItemValue(itemIndex)
  //     itemIndex = (itemIndex + 1) % this.items.length
  //   }, 600)
  // },
  methods: {
    updateItemValue(item, index) {
      //alert(item.name);
      //alert(index);
      if (!item.value) {
        for (i = 0; i < this.list.length; i++) {
          this.list[i].value = false;
        }
      }
      item.value = !(item.value);
      this.index = index;
      this.appOn = false;
      this.storeLocalEnabled();
      this.storeLocalList();
      this.storeLocalIndex(this.index);
      this.refresh();
    },
    setPreset: function() {
      //alert("setPreset")
      //Checking if the preset exists
      for (i = 0; i < this.list.length; i++) {
          this.list[i].value = false;
      }


      for (i = 0; i < this.list.length; i++) {
        //alert(this.list[i].name);
        if (this.list[i].name.valueOf() == this.newPreset.valueOf()) {
          
          this.currPreset = this.list[i].name;
          this.preset = this.list[i];
          this.index = i;
          this.storeLocalIndex(this.index);
          this.refresh();
          //this.newPreset = "";
          //alert("Found Preset");
          return;
        }
      }

      //Creating new preset
      this.preset.name = this.newPreset;
      this.preset.openlist = [];
      this.preset.blacklist = [];
      this.preset.value = true;
      //this.currPreset = this.newPreset;
      //This is the format for copying an object in js. Using just an "=" passes by reference normally. ie this.list[index] = dontdothis;
      this.list[this.list.length] = {
        ...this.preset
      };
      this.index = this.list.length - 1;
      
      this.storeLocalList();
      this.storeLocalIndex(this.index);
      this.newPreset = ''
      this.refresh();
      //alert("New Preset");
      //this.newPreset = "";
      //alert(this.list.length);

      
    },

    addOpenlistSite: function() {
      //alert("Test");
      this.website.site = this.tabToOpen;
      this.website.enabled = true;
      //alert(this.index);
      //currently allowing duplicate tabs opening
      //this.list[index].openlist.push(this.website);
      this.list[this.index].openlist[this.list[this.index].openlist.length] = {
        ...this.website
      };
      this.storeLocalList();
      this.tabToOpen = '';
      this.refresh();
      //this.tabToOpen = "";
      //alert("Website added to Openlist.");
    },
    addBlacklistSite: function() {
      
      for (i = 0; i < this.list[this.index].blacklist.length; i++) {
        if (this.tabToBlock.valueOf() == this.list[this.index].blacklist[i].site.valueOf()) {
          //alert("Website already blacklisted");
          //this.tabToBlock = "";
          return;
        } 
      }
      this.website.site = this.tabToBlock;
      this.website.enabled = true;
     // this.list[index].blacklist.push(this.website);
      this.list[this.index].blacklist[this.list[this.index].blacklist.length] = {
        ...this.website
      };
      this.storeLocalList();
      this.tabToBlock = '';
      this.refresh();
      //this.tabToBlock = "";
      //alert("Website added to blacklist");
    },

    storeData: function() {
      //alert("Storing data");
      chrome.storage.local.set({'list': this.list}, function() {} );
      //alert("Data stored");
    },

    getData: function() {
      //alert('checking data');
      a = this.list;
      b = this.appOn;
      c = this.index;
      //alert("getting Data");
      
      chrome.storage.local.get({ 'appEnabled' : this.appOn }, function(result){ 
        b = result.appEnabled; //Using var a because our data parameters are not in this scope
        //alert(a[0]);
      }); 
      chrome.storage.local.get({ 'index' : this.index }, function(result){ 
        c = result.index; //Using var a because our data parameters are not in this scope
        //alert(a[0]);
      }); 
      
      chrome.storage.local.get({ 'list' : this.list }, function(result){ 
        a = result.list; //Using var a because our data parameters are not in this scope
        //alert(a[0]);
      }); 
      this.trackChange(0); //because the get call is asynchronous, using a looping delay function to track the update 
    },

    trackChange: function(num) {
      //alert('check for change');
      if (this.list != a) {
        //alert('found change');
        this.list = a;
      }
      if (this.appOn != b) {
        this.appOn = b;
      }
      if (this.index != c) {
        this.index = c;
      } 
      if (num < 10) {
        setTimeout(this.trackChange, 100, num + 1);
      }
      
    },

    storeLocalList: function() {
      chrome.storage.local.set({'list': this.list}, function() {} );
    },
    storeLocalIndex: function(num) {
      chrome.storage.local.set({'index': num}, function() {} );
    },
    storeLocalEnabled: function() {
      chrome.storage.local.set({'appEnabled': this.appOn}, function() {} );
    },
    appEnable: function() {
      this.appOn = !(this.appOn);
      this.storeLocalEnabled();
    },

    toggleSite: function(site) {
      site.enabled = !(site.enabled);
      this.storeLocalList();
    },

    toggleButton() {
      var toggle = document.getElementById('toggle1');
      //alert('fdf');

      chrome.storage.local.get({isOn: false}, function (result) {
        var on = result.isOn;
        var toggle = document.getElementById('toggle1');

        if (on) {
            toggle.property.value = false
            on = false
        }
        else {
            toggle.property.value = true
            on = true
        }
        chrome.storage.local.set({isOn: on});
      });
    },

    // Deprecated
    //https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
    toggleAdder: function(id) {
      var x = document.getElementById(id);
      if (x.hidden == true) {
        x.hidden = false; 
      } else {
        x.hidden = true;
      }
    },
    // Deprecated
    showBlockAdder: function(id) {
      var x = document.getElementById(id);
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    },

    changeDataProperty(event) {
      this.data_property = true;
       //this.data_property = true;
      //alert('Hello, Console!')
      //(event) ?  this.data_property = true :  this.data_property = false  ;
      chrome.storage.local.get({isOn: true}, function (result) {
        //(event) ?  this.data_property = true :  this.data_property = false;
        prop = true;
        //alert('hey')
        var on = !result.isOn;
        chrome.storage.local.set({isOn: !on});
      });
    },
    test(){
      count+=1;
    },

    refresh: function() {
      this.list = -1;
      this.index = 1000;
      this.appOn = -1;

      this.getData();
    }

  },

  mounted() {
    //alert("Mounted");
    this.getData();
  },

  
};
</script>

<style lang="scss" scoped>
p {
  font-size: 16px;
}
.extension {
  width: 300px;
  text-align: center;
}
.bot-buffer {
  margin-bottom: 4% !important;
  font-weight: 500;
}
.top-buffer {
  margin-top: 4% !important;
  font-weight: 500;
}
.mode-title {
  font-weight: 600;
  font-size: 1.1em;
}
#auto-open {
  
}
.banner {
  background-color: white;
  box-shadow: 0 .1em .3em rgba(0, 0, 0, 0.123);
  margin-bottom: 1em;
}
</style>