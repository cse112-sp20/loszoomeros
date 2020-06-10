<template>
  <div>
    <!-- START Main site blocking UI -->
    <div class="extension" v-show="!calMode">
      <!-- START Top Banner Area-->
      <div class="sticky-top banner" style="padding-top:4%; padding-bottom:-20%">
        <div class="container">
          <!-- Banner Icons and Name -->
          <div class="row">
            <!-- Power Button -->
            <div class="col-3 text-center my-auto">
              <a
                class="my-auto"
                href="#"
                @click="appEnable"
                data-toggle="tooltip"
                data-placement="top"
                :title="(appOn) ? 'Turn off': 'Turn on'"
              >
                <icon name="power-off"></icon>
              </a>
              <p class="powerStatus">{{appOn ? "On" : "Off"}}</p>
            </div>
            <!-- Name Banner -->
            <div class="col-6 text-center">
              <h3>Zoomero</h3>
            </div>

            <!-- Add Mode -->
            <div class="col-1 text-left">
              <a
                href="#mode-input"
                data-toggle="collapse"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <icon name="plus-circle"></icon>
              </a>
            </div>
            <!-- Calendar -->
            <div class="col-1 text-right">
              <a @click="calMode = !calMode" href="#" data-toggle="tooltip" data-placement="top">
                <icon name="calendar-alt"></icon>
              </a>
            </div>
            <!-- Blank Space For Even Spacing -->
            <div class="col-1 text-left"></div>
            <!-- Input field to add a new preset -->
            <div id="mode-input" class="collapse">
              <div class="input-group mb-3">
                <input
                  id="mode-in-field"
                  v-model="newPreset"
                  type="search"
                  class="form-control"
                  placeholder="Powell Memes"
                  aria-describedby="basic-addon2"
                />

                <div class="input-group-append">
                  <button
                    href="#mode-input"
                    data-toggle="collapse"
                    @click="setPreset"
                    class="btn btn-outline-secondary"
                    type="submit"
                  >Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- START Top Banner Area-->

      <!-- START Modal for deleting -->
      <div>
        <b-modal ref="delModal" hide-footer title="Confirm Removal">
          <div class="d-block text-center">
            <h3>You sure there, bud?</h3>
          </div>
          <b-button class="mt-3" pill variant="primary" @click="hideDelMod">Cancel</b-button>
          <b-button :href="'#'+curRow" data-toggle="collapse" class="mt-3" pill variant="danger" @click="removePreset(curPreset)">Delete</b-button>
        </b-modal>
      </div>
      <!-- END Modal for deleting -->

      <!-- START Modal to rename presets -->
      <div>
        <b-modal
          id="modal-prevent-closing"
          ref="nameMod"
          title="Enter a new name"
          @show="resetModal"
          @hidden="resetModal"
          @ok="handleOk"
        >
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group
              :state="nameState"
              label="Name"
              label-for="name-input"
              invalid-feedback="A name is required"
            >
              <b-form-input
                id="name-input"
                v-model="name"
                :state="nameState"
                required
              ></b-form-input>
            </b-form-group>
          </form>
        </b-modal>
      </div>
      <!-- END Modal to rename presets -->

      <!-- START Main container for each preset in the UI (row) -->
      <div class="container" v-for="(item, i) in list" :key="i">
        <div class="row my-auto">
          <!-- Options menu button -->
          <div class="col-1 my-auto">
            <a :href="'#'+encode(item.strings.name)+'opts'" data-toggle="collapse" class="nav-link drop-down">
              <icon name="ellipsis-v"></icon>
            </a>
          </div>
          <!-- Coloumn for the main toggle of a mode -->
          <div class="col-3 my-auto text-left">
            <toggle-button
              class="my-auto"
              :value="item.value"
              :color="item.color"
              :sync="true"
              :labels="true"
              :key="i"
              @change="togglePreset(item, i)"
            />
          </div>
          <!-- Coloumn for the mode text (name of the mode) -->
          <div class="col my-auto text-left mode-title">{{item.strings.name}}</div>
          <!-- Coloumn for the dropdown arrow -->
          <div class="col-3 my-auto">
            <a
              class="nav-link drop-down"
              data-toggle="collapse"
              :href="'#'+encode(item.strings.name)"
              aria-expanded="false" 
            >
              <chevron class="text-right"></chevron>
            </a>
          </div>
          <!-- START The options menu -->
          <div class="collapse container" :id="encode(item.strings.name)+'opts'">
            <div><hr class="solid" /></div>
            <div class="row bot-buffer">
              <div class="col"></div>
              <div class="col">Options</div>
              <div class="col"></div>
            </div>
            <div class="row">

              <div class="col">
                <b-button pill size="sm" variant="danger" @click="showDelMod(i, encode(item.strings.name)+'opts')">Delete</b-button>
              </div>

              <div class="col">
                <b-button pill size="sm" variant="outline-primary" @click="showNameMod(i)">Rename</b-button>
              </div>
            </div>
          </div>
          <!-- END The options menu -->

          <!-- Collapsable container for the drop down menu (the menu that shows sites in a mode) -->
          <div class="row collapse" :id="encode(item.strings.name)">
            <!-- START Main UI container to auto-open a list of websites -->
            <div class="container">
              <!-- Divider -->
              <div>
                <hr class="solid" />
              </div>
              <div class="row bot-buffer">
                <div class="col-3">
                  <!-- Do not put anything here -->
                </div>

                <div class="col-6 text-center">Auto-open</div>

                <!-- Button to add a site to Auto-open -->
                <div class="col-3 text-center">
                  <a
                    :href="'#'+encode(item.strings.name)+'auto'"
                    data-toggle="collapse"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <icon name="plus"></icon>
                  </a>
                </div>
              </div>
              <!-- START Input field to add websites to be auto-opened -->
              <div :id="encode(item.strings.name)+'auto'" class="row collapse">
                <div class="col-1"></div>
                <div class="col input-group mb-3">
                  <!-- Input field -->
                  <input
                    :id="encode(item.strings.name)+'auto-op'"
                    v-model="item.strings.openInput"
                    type="search"
                    class="form-control"
                    placeholder="Enter url..."
                    aria-describedby="basic-addon2"
                  />
                  <!-- Button to add -->
                  <div class="input-group-append">
                    <button
                      :href="'#'+encode(item.strings.name)+'auto'"
                      class="btn btn-outline-secondary"
                      data-toggle="collapse"
                      @click="addOpenlistSite(item)"
                    >Add</button>
                  </div>
                </div>
                <div class="col-1"> <!-- Leave this blank for spacing --> </div>
              </div>
              <!-- END Input field to add websites to be auto-opened -->

              <!-- START Programatically a row for each website in auto-open -->
              <div class="row" v-for="(website, j) in item.openlist" :key="j">
                <div class="col-1"> <!-- Leave this blank for spacing --> </div>
                <div class="col my-auto text-left">{{website.site}}</div>
                <div class="col-3 my-auto text-center">
                  <a class="del-site" href="#" @click="removeSite(item.openlist, j)">
                    <icon name="times"></icon>
                  </a>
                </div>
              </div>
              <!-- END Programatically a row for each website in auto-open -->
            </div>
            <!-- END Main UI container to auto-open a list of websites -->

            <!-- START Main UI container to black list a website -->
            <div class="container">
              <hr class="solid" />
              <div class="row top-buffer bot-buffer">
                <div class="col-3">
                  <!-- Do not put anything here -->
                </div>
                <div class="col-6 text-center">Blocked</div>
                <div class="col-3 text-center">
                  <a
                    :href="'#'+encode(item.strings.name)+'block'"
                    data-toggle="collapse"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <icon name="plus"></icon>
                  </a>
                </div>
              </div>

              <!-- START Input field to blacklist a website -->
              <div :id="encode(item.strings.name)+'block'" class="row collapse">
                <div class="col-1">
                  <!-- Leave this empty -->
                </div>
                <div class="col input-group mb-3">
                  <input
                    :id="encode(item.strings.name)+'auto-op'"
                    v-model="item.strings.blockInput"
                    type="search"
                    class="form-control"
                    placeholder="Enter url..."
                    aria-describedby="basic-addon2"
                  />
                  <div class="input-group-append">
                    <button
                      :href="'#'+encode(item.strings.name)+'block'"
                      class="btn btn-outline-secondary"
                      data-toggle="collapse"
                      @click="addBlacklistSite(item)"
                    >Add</button>
                  </div>
                </div>
                <div class="col-1">
                  <!-- Leave this empty for spacing -->
                </div>
              </div>
              <!-- END Input field to blacklist a website -->

              <!-- START Programatically add blacklisted site to menu -->
              <div class="row" v-for="(website, k) in item.blacklist" :key="k">
                <div class="col-1"></div>
                <div class="col my-auto text-left">{{website.site}}</div>
                <div class="col-3 my-auto text-center">
                  <a class="del-site" href="#" @click="removeSite(item.blacklist, k)">
                    <icon name="times"></icon>
                  </a>
                </div>
              </div>
              <!-- END Programatically add blacklisted site to menu -->
            </div>
            <!-- END Main UI container to black list a website  -->

          </div>
        </div>
        <hr class="solid" />
      </div>
      <!-- END Main container for each preset in the UI (row) -->
    </div>
    <!-- END Main site blocking UI -->

    <!-- START Calendar Mode UI -->
    <div class="extension" v-show="calMode">
      <div class="sticky-top banner" style="padding-top:4%;padding-bottom:10%">
        <div class="container">
          <!-- Banner Icons and Name -->
          <div class="row">
            <div class="col-1 my-auto">
              <a @click="forceUpdate()" href="#" data-toggle="tooltip" data-placement="top">
                <icon name="chevron-left"></icon>
              </a>
            </div>
            <!-- Name Banner -->
            <div class="col text-center my-auto">
              <h3 class="my-auto">Calendar</h3>
            </div>
            <div class="col-1 text-right"> <!-- Leave blank for spacing --> </div>
          </div>
        </div>
      </div>
      <!-- calendar component -->
      <calComp :key="componentKey" :title="selName" ref="calComp"></calComp>
    </div>
    <!-- END Calendar Mode UI -->
  </div>
</template>

<script>
import calComp from "./../calendar/calComp.vue"; // import calendar component
import chevron from "./../chevron/Chevron.vue";  // import animated chevron for menu

/**
 * @module popup
 * @author Paul Larsen & Daryl Nakamoto
 *
 * @vue-data {String} [newPreset=""] - Stores input value for creating preset.
 * @vue-data {Preset} preset - Object that holds a name(Strings.name), openlist input(Strings.openInput), blacklist input(Strings.blockInput), color of its button(color), boolean for its on/off state(value), list of websites to open(openlist), and list of tabs to block(blacklist).
 * @vue-data {Website} website - Object that holds a website url(site) and a boolean for on/off toggle(enabled).
 * @vue-data {Array} [list=[]] - An array which is the highest level data storage within the vue. Holds all the presets.
 * @vue-data {Int} [index=0] - Tracks the currently active preset within the list.
 * @vue-data {Bool} [appOn=false] - Holds the on/off state of the extension as a boolean.
 * @vue-data {Bool} [calMode=false] - Indicates if the calendar shall be shown or hidden.
 * @vue-data {String} [name=""] - Input from the modal that renames a preset.
 * @vue-data {Bool} [nameState=null] - State to indicate if user input into rename modal is valid.
 * @vue-data {String} [curRow=""] - # concatenated with the HTML ID of the preset/row from which the user invoked a request to delete a preset.
 * @vue-data {Int} [curPreset=-1] - Key of the preset/row from which the user invoked a request to delete or rename a preset.
 * @vue-data {Int} [componentKey=0] - Key used to force update the calendar component when changes are made to presets.
 * @vue-data {String} [selName="Select a mode"] - Default text displayed in calendar component's Mode selection dropdown.
 * @vue-data {string } [newPreset=""] - Synced to the input form for adding a preset.
 * @vue-event setPreset {None} - Creates a new preset from the newPreset input string, or turns that preset on if it exists already.
 * @vue-event togglePreset {Preset | Int} - Toggles a preset on/off.
 * @vue-event removePreset {Int} - Removes a preset from the list.
 * @vue-event addOpenlistSite {Preset} - Adds a website from the openInput string to a preset's openlist.
 * @vue-event addBlacklistSite {Preset} - Adds a website from the blockInput string to a preset's openlist.
 * @vue-event removeSite {Array | Int} - Removes a website from a preset's openlist/blacklist.
 * @vue-event getData {None} - Updates current fields with those in chrome storage.
 * @vue-event trackChange {Int} - Delay-based recursive function to deal with asynchronous storage.
 * @vue-event storeLocalList {None} - Updates chrome storage with current list.
 * @vue-event storeLocalIndex {None} - Updates chrome storage with current index.
 * @vue-event storeLocalEnabled {None} - Updates chrome storage with current appOn value.
 * @vue-event appEnable {None} - Toggles appOn, turns the app on or off.
 * @vue-event refresh {None} - Refreshes data, called after data is stored.
 * @vue-event encode {String} - Encodes preset names for html id parsing, allows for any ascii preset name.
 * @vue-event checkFormValidity {None} - Checks if the user entered a valid string when renaming a preset.
 * @vue-event resetModal {None} - Reset the rename modal after user submits a valid string.
 * @vue-event handleOk {BvModalEvent} - Handle user clicking on OK button within rename modal.
 * @vue-event handleSubmit {None} - Renames a specified preset if the user submitted a valid string.
 * @vue-event showNameMod {Int} - Displays the rename modal.
 * @vue-event hideNameMod {None} - Hides the rename modal.
 * @vue-event showDelMod {Int | String} - Displays delete modal (delete confirmation window).
 * @vue-event hideDelMod {None} - Hides delete modal (delete confirmation window).
 * @vue-event rename {Int | String} - Rename the preset at index 'i' with string 'name'.
 * @vue-event forceUpdate {None} - Update the key of calComp to force an update on the component.
 */

//vars with the intent of being accessible in the scope of chrome storage
var a = [];
var b = false;
var c = 0;
//looping var
var i;
const browser = require("webextension-polyfill");

export default {
  components: {
    calComp,
    chevron,
  },

  data() {
    return {
      name: "",
      nameState: null,
      curRow: "",
      curPreset: -1,
      componentKey: 0,
      selName: "Select a mode",
      newPreset: "",
      preset: {
        strings: { name: "name", openInput: "", blockInput: "" },
        color: "#00a800",
        value: true,
        openlist: [],
        blacklist: []
      },
      website: { site: "stackoverflow.com", enabled: true },
      list: [],
      index: 0,
      appOn: false,
      calMode: false
    };
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.nameState = valid
      return valid
    },
    resetModal() {
      this.name = ''
      this.nameState = null
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // Push the name to submitted names
      this.rename(this.curPreset, this.name)
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },
    showNameMod(preset){
      this.curPreset = preset;
      this.$refs['nameMod'].show();
    },
    hideNameMod(){
      this.$refs['nameMod'].hide();
    },
    showDelMod(preset, row){
      this.curPreset = preset;
      this.curRow = row;
      this.$refs['delModal'].show();
    },
    hideDelMod(){
      this.$refs['delModal'].hide();
    },
    rename(i, name){
      this.list[i].strings.name = name;
      this.storeLocalList();
      this.storeLocalEnabled();
      this.storeLocalIndex(this.index);
      this.refresh();
    },
    /*
     * forceUpdate
     * Called when switching back from calendar mode (User clicked on left chevron)
     * Used to update the bool value of the current mode and reset the selection field.
     */
    forceUpdate() {
      this.calMode = !this.calMode;
      if(this.componentKey == 0){
        this.componentKey += 1;
      }
      else{
        this.componentKey = 0;
      }
    },
    /*
     * togglePreset
     * Called when a storage change is detected.
     * Updates the chrome.tabs listener that checks for blacklisted websites and removes them.
     * item: list preset to be toggled
     * index: list index of the passed in preset, updates this.index
     */
    togglePreset(item, index) {
      if (!item.value) {
        for (i = 0; i < this.list.length; i++) {
          this.list[i].value = false;
        }
      }
      //toggling preset on/off
      item.value = !item.value;
      this.index = index;
      this.appOn = false;
      this.storeLocalEnabled();
      this.storeLocalList();
      this.storeLocalIndex(this.index);
      this.refresh();
    },

    // This function is synced with the add button for adding presets
    // It disables all active presets(should only be one), and then checks if the preset exists
    // If so, it makes that the active preset
    // Otherwise, create a new preset and make that the active preset.
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
      this.preset.strings = {
        name: this.newPreset,
        openInput: "",
        blockInput: ""
      };
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
      this.newPreset = "";
      this.refresh();
      //alert("New Preset");
      //this.newPreset = "";
    },

    /* Function for removing a preset
    Takes an input(index) directing which member of the list to delete
    Turns the app off, and updates this.index to the currently active preset(the active preset's index might change after a removal)
    */
    removePreset(index) {
      // Close modal
      this.hideDelMod();

      this.list.splice(index, 1);
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
      preset.strings.openInput = "";
      this.storeLocalList();
      // reset input field
      //preset.strings.openInput.refresh(); // update changes
      this.refresh();
    },

    //Function synced to the presets' add button for blocked sites
    //Checks if the input from the blockInput form of the input(preset) is already blacklisted, and if not, proceeds to add it to the
    //  preset's blacklist.
    addBlacklistSite: function(preset) {
      for (i = 0; i < preset.blacklist.length; i++) {
        if (
          preset.strings.blockInput.valueOf() ==
          preset.blacklist[i].site.valueOf()
        ) {
          return;
        }
      }
      this.website.site = preset.strings.blockInput;
      this.website.enabled = true;
      preset.blacklist[preset.blacklist.length] = {
        ...this.website
      };
      preset.strings.blockInput = "";
      this.storeLocalList();
      // reset input field
      //preset.strings.blockInput.refresh(); // update changes
      this.refresh();
      //alert("Website added to blacklist");
    },

    //Function used to remove sites from the given input1(array) at input2(index)
    //It's basically a splice call with extra steps, those being updating our data
    removeSite: function(array, index) {
      array.splice(index, 1);
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

      chrome.storage.local.get({ appEnabled: this.appOn }, function(result) {
        b = result.appEnabled; //Using var b because our data parameters are not in this scope
      });

      chrome.storage.local.get({ index: this.index }, function(result) {
        c = result.index; //Using var c because our data parameters are not in this scope
      });

      chrome.storage.local.get({ list: this.list }, function(result) {
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
      } else {
        //https://stackoverflow.com/questions/33682651/call-a-vue-js-component-method-from-outside-the-component
        this.$refs.calComp.getData();
      }
    },

    //These three functions all do the same thing with different pieces of data
    //They store data to trigger the storage listeners in background.js and update the
    //  website listeners
    //The index function takes a parameter in anticipation of it needing to store an index
    //  that wasn't this.index, but this might not even happen. Might change in future
    storeLocalList: function() {
      chrome.storage.local.set({ list: this.list }, function() {});
    },
    storeLocalIndex: function(num) {
      chrome.storage.local.set({ index: num }, function() {});
    },
    storeLocalEnabled: function() {
      chrome.storage.local.set({ appEnabled: this.appOn }, function() {});
    },

    //Function hooked up to the power button
    //Toggles the extension state between on and off
    appEnable: function() {
      //added for loop to return on no active presets found
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].value) {
          break;
        }
        if (i == this.list.length - 1) {
          return;
        }
      }
      this.appOn = !this.appOn;
      this.storeLocalEnabled();
    },
    //Band-aid fix for toggle buttons not working when dynamically created.
    //Reloading the paramaters generating the buttons seemed to fix it.
    //Doesn't seem to cause issues so far
    refresh: function() {
      this.list = -1;
      this.index = 1000;
      this.appOn = false;
      //https://stackoverflow.com/questions/33682651/call-a-vue-js-component-method-from-outside-the-component
      this.$refs.calComp.getData();
      this.getData();
    },

    //Function used to resolve issues with html formatting of input strings
    //Takes an input(baseString) and creates an output(encodedString)
    //For every char in baseString, we take the ascii code, place x's before and after,
    //and concat it to the output string.
    encode: function(baseString) {
      var code;
      var encodedString = "";
      for (var i = 0; i < baseString.length; i++) {
        code = baseString.charCodeAt(i);
        //deliberately left one lowercase in case debugging was needed
        encodedString += "X" + code + "x";
      }
      return encodedString;
    }
  },

  mounted() {
    let vm = this;
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      for (var key in changes) {
        if (key == "update") {
          vm.refresh();
        }
      }
    });
    this.getData();
  }
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
.drop-down {
  padding: 0 !important;
}
.banner {
  background-color: white;
  box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.123);
  margin-bottom: 1em;
}
.del-site {
  color: rgba(119, 118, 118, 0.712);
}
.rotate {
  display: inline-block;
  transition: all 2s linear;
}
.rotate.down {
  transform: rotate(180deg);
}
.modal {
  background-color: rgba(0, 0, 0, 0.7);
}
.chev{
  font-size: 1px;
}
.powerStatus {
  margin: none !important;
}
</style>