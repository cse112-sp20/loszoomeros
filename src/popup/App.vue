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
        <div class="col my-auto">
          <button @click="removePreset(i)">Delete</button>
        </div>
        <!-- Coloumn for the main toggle for a mode -->
        <div class="col my-auto">
          <toggle-button
              class="my-auto"
              :value="item.value"
              :color="item.color"
              :sync="true"
              :labels="true"
              :key="i"
              @change="togglePreset(item, i)"/>
        </div>
        <!-- Coloumn for the mode text (name of the mode) -->
        <div class="col my-auto text-left mode-title">
          {{item.strings.name}}
        </div>
        <!-- Coloumn for the dropdown arrow -->
        <div class="col my-auto">
          <a class="nav-link dropdown-toggle" data-toggle="collapse" :href="'#'+encode(item.strings.name)" aria-expanded="false"></a>
        </div>
      </div>
       <!-- A collapsable container for the drop down menu (the menu that shows sites in a mode) -->
      <div class="collapse" :id="encode(item.strings.name)">
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
                <a :href="'#'+encode(item.strings.name)+'auto'" data-toggle="collapse" aria-haspopup="true" aria-expanded="false"><icon name="plus"></icon></a>
              </div>
            </div>
          </div>

          <div :id="encode(item.strings.name)+'auto'" class="collapse">
            <div class="input-group mb-3">
              <input :id="encode(item.strings.name)+'auto-op'" v-model="item.strings.openInput" type="search" class="form-control" placeholder="Enter url..." aria-describedby="basic-addon2">
              <div class="input-group-append">
                <button :href="'#'+encode(item.strings.name)+'auto'" class="btn btn-outline-secondary" data-toggle="collapse" @click="addOpenlistSite(item)">Add</button>
              </div>
            </div>
          </div>
          

          <div class="container" v-for="(website, j) in item.openlist" :key="j" >
            <div class="row">
              <div class="col my-auto text-left">
                <button @click ="removeSite(item.openlist, j)">Del </button>{{website.site}}
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
              <a :href="'#'+encode(item.strings.name)+'block'" data-toggle="collapse" aria-haspopup="true" aria-expanded="false"><icon name="plus"></icon></a>
            </div>
          </div>
        </div>

        <div :id="encode(item.strings.name)+'block'" class="collapse">
          <div  class="input-group mb-3">
          <input :id="encode(item.strings.name)+'auto-op'" v-model="item.strings.blockInput" type="search" class="form-control" placeholder="Enter url..." aria-describedby="basic-addon2">
            <div class="input-group-append">
              <button :href="'#'+encode(item.strings.name)+'block'" class="btn btn-outline-secondary" data-toggle="collapse" @click="addBlacklistSite(item)">Add</button>
            </div>
          </div>
        </div>
        

        <div class="container" v-for="(website, k) in item.blacklist" :key="k" >
          <div class="row">
            
            <div class="col my-auto text-left">
              <button @click ="removeSite(item.blacklist, k)">Del </button> {{website.site}}
            </div>
            <div class="col my-auto text-right">
              <toggle-button class="my-auto"  @change="toggleSite(website)" :value="website.enabled" :sync="true" :width="40" :height="18"/>
            </div>
          </div>  
        </div>
      </div>
      <hr class="solid">
    </div>
  </div>
</template>

<script>
//vars with the intent of being accessible in the scope of chrome storage
var a = [ ]; 
var b = false;
var c = 0;
//looping var
var i;
const browser = require("webextension-polyfill");
export default {
  
  data() {
    return {

      /*Data variables
      newPreset: synced to the input form for adding a preset
      preset: object that holds a name(name), color of its button(color), boolean for its on/off state(value), 
              list of websites to open(openlist), and list of tabs to block(blacklist)
      website: Object that holds a website url(site) and a boolean for on/off toggle(enabled)
      tabToOpen: Synced to the input form for adding a auto-open URL
      tabToBlock: Synced to the input form for adding a blocked tab
      list: An array which is the highest level data storage within the vue. holds all the presets
      index: Tracks the currently active preset within the list
      appOn: Holds the on/off state of the extension as a boolean
      */
      newPreset: "", 
      preset: {strings: {name: "name", openInput: "", blockInput: ""}, color: '#E8D2AE', value: true, openlist: [ ], blacklist: [ ], },
      website: {site: "stackoverflow.com", enabled: true}, 
      tabToOpen: 'http://', 
      tabToBlock: "", 
      list: [],    
      index: 0,    
      appOn: false,
    };
  },

  methods: {

    //function sycned to the toggle button for presets
    //Turns off all active presets(should only be one) 
    //Then toggles the value of the clicked preset
    //Was previously updateItemValue, name updated for clarity
    //Parameters: Item it the clicked preset, index is the index of the clicked preset
    togglePreset(item, index) {
      //alert(item.name);
      //alert(index);
      if (!item.value) {
        for (i = 0; i < this.list.length; i++) {
          this.list[i].value = false;
        }
      }
      //toggling preset on/off
      item.value = !(item.value);
      this.index = index;
      this.appOn = false;
      this.storeLocalEnabled();
      this.storeLocalList();
      this.storeLocalIndex(this.index);
      this.refresh();
    },

    //This function is synced with the add button for adding presets
    //It disables all active presets(should only be one), and then checks if the preset exists
    //If so, it makes that the active preset
    //Otherwise, create a new preset and make that the active preset.
    setPreset: function() {
      //Checking if the preset exists
      for (var i = 0; i < this.list.length; i++) {
          this.list[i].value = false;
      }

      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].strings.name.valueOf() == this.newPreset.valueOf()) {
          this.list[i].value = true;
          this.index = i;
          this.appOn = false;
          this.storeLocalList();
          this.storeLocalEnabled();
          this.storeLocalIndex(this.index);
          this.refresh();
          //this.newPreset = "";
          //alert("Found Preset");
          return;
        }
      }

      //Creating new preset
      //this.preset.strings.name = this.newPreset;
      this.preset.strings = {name: this.newPreset, openInput: "", blockInput: ""}
      this.preset.openlist = [];
      this.preset.blacklist = [];
      this.preset.value = true;
      //This is the format for copying an object in js. Using just an "=" passes by reference normally.
      //  ie this.list[index] = dontdothis;
      this.list[this.list.length] = {
        ...this.preset
      };
      this.index = this.list.length - 1;
      this.appOn = false;
      this.storeLocalEnabled();
      this.storeLocalList();
      this.storeLocalIndex(this.index);
      this.newPreset = '';
      this.refresh();
      //alert("New Preset");
      //this.newPreset = "";
      
    },

    /* Function for removing a preset
    Takes an input(index) directing which member of the list to delete
    Turns the app off, and updates this.index to the currently active preset(the active preset's index might change after a removal)

    */
    removePreset(index) {
      this.list.splice(index,1);
      this.index = 0;
      this.appOn = false;
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].value) {
          this.index = i;
        }
      }
      this.storeLocalEnabled();
      this.storeLocalList();
      this.storeLocalIndex(this.index);
      this.refresh();
    },

    //Function synced to the presets' add button for auto-open sites
    //Does not check for duplicates to allow the user to open duplicate tabs if they wish
    //Adds the input website from the openInput form of the input(preset) to the preset's openlist
    addOpenlistSite: function(preset) {
      this.website.site = preset.strings.openInput;
      this.website.enabled = true;
      //currently allowing duplicate tabs opening
      preset.openlist[preset.openlist.length] = {
        ...this.website
      };
      this.storeLocalList();
      
      this.refresh();
    },

    //Function synced to the presets' add button for blocked sites
    //Checks if the input from the blockInput form of the input(preset) is already blacklisted, and if not, proceeds to add it to the
    //  preset's blacklist.
    addBlacklistSite: function(preset) {
      
      for (i =0; i < preset.blacklist.length; i++) {
        if (preset.strings.blockInput.valueOf() == preset.blacklist[i].site.valueOf()) {
          return;
        } 
      }
      this.website.site = preset.strings.blockInput;
      this.website.enabled = true;
      preset.blacklist[preset.blacklist.length] = {
        ...this.website
      };
      this.storeLocalList();
      this.refresh();
      //alert("Website added to blacklist");
    },

    //Function used to remove sites from the given input1(array) at input2(index)
    //It's basically a splice call with extra steps, those being updating our data
    removeSite: function(array, index) {
      array.splice(index,1);
      this.storeLocalList();
      this.refresh();
    },

    //Uses chrome storage api to retrieve data from local storage.
    //Storage retrieval is asynchronous and the vue data fields aren't accessible within
    //  the storage function's scope, so we use var a,b,c which are still accessible to store the data
    //  and call trackChange to update the vue data fields.
    getData: function() {
      a = this.list;
      b = this.appOn;
      c = this.index;
      
      chrome.storage.local.get({ 'appEnabled' : this.appOn }, function(result){ 
        b = result.appEnabled; //Using var b because our data parameters are not in this scope      
      }); 

      chrome.storage.local.get({ 'index' : this.index }, function(result){ 
        c = result.index; //Using var c because our data parameters are not in this scope        
      }); 
      
      chrome.storage.local.get({ 'list' : this.list }, function(result){ 
        a = result.list; //Using var a because our data parameters are not in this scope
      }); 

      this.trackChange(0); //because the get call is asynchronous, using a looping delay function to track the update 
    },

    //Function used to update the extension's important data when storage data is retrieved
    //by calling setTimeout, we create a delay between updates, allowing for the async storage
    //api to finish retrieving the necessary data. 
    trackChange: function(num) {
      if (this.list != a && a != undefined) {
        this.list = a;
      }
      if (this.appOn != b && b != undefined) {
        this.appOn = b;
      }
      if (this.index != c && c != undefined) {
        this.index = c;
      } 
      if (num < 10) {
        setTimeout(this.trackChange, 100, num + 1);
      }
      
    },


    //These three functions all do the same thing with different pieces of data
    //They store data to trigger the storage listeners in background.js and update the
    //  website listeners
    //The index function takes a parameter in anticipation of it needing to store an index
    //  that wasn't this.index, but this might not even happen. Might change in future
    storeLocalList: function() {
      chrome.storage.local.set({'list': this.list}, function() {} );
    },
    storeLocalIndex: function(num) {
      chrome.storage.local.set({'index': num}, function() {} );
    },
    storeLocalEnabled: function() {
      chrome.storage.local.set({'appEnabled': this.appOn}, function() {} );
    },

    //Function hooked up to the power button
    //Toggles the extension state between on and off
    appEnable: function() {
      //added for loop to return on no active presets found
      for (var i = 0; i < this.list.length; i ++) {
        if (this.list[i].value) {
          break;
        }
        if (i == (this.list.length - 1) ) {
          return;
        } 
      }
      this.appOn = !(this.appOn);
      this.storeLocalEnabled();
    },


    //Function called when a website's toggle button is clicked
    //Turns it off or on.
    toggleSite: function(site) {
      site.enabled = !(site.enabled);
      this.storeLocalList();
    },


    //Band-aid fix for toggle buttons not working when dynamically created.
    //Reloading the paramaters generating the buttons seemed to fix it.
    //Doesn't seem to cause issues so far
    refresh: function() {
      this.list = -1;
      this.index = 1000;
      this.appOn = false;

      this.getData();
    },

    //Function used to resolve issues with html formatting of input strings
    //Takes an input(baseString) and creates an output(encodedString)
    //For every char in baseString, we take the ascii code, place x's before and after,
    //  and concat it to the output string.
    encode: function(baseString) {
      var code;
      var encodedString = "";
      for (var i = 0; i < baseString.length; i++) {
        code = baseString.charCodeAt(i);
        //deliberately left one lowercase in case debugging was needed
        encodedString += 'X' + code + 'x';
      } 
      return encodedString;
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