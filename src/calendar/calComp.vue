<template>
  <div class="container">
    <b-row>
      <b-col>
        <p>Mode:</p>
      </b-col>
      <b-col>
        <select name="Presets" id="presetSelect"></select>
      </b-col>
    </b-row>
    <hr class="solid" />
    <b-row>
      <b-col>
        <p>Recurring:</p>
      </b-col>
      <b-col>
        <toggle-button
        class="my-auto"
        :value="recur"
        :sync="true"
        :labels="true"
        :key="'recur'"
        @change="toggleRecur"
        />
      </b-col>
    </b-row>
    <hr class="solid" />
    
    <b-row>
      <b-col cols="3">
        <p>Start</p>
      </b-col>
      <b-col>
        <b-form-timepicker v-model="startTime" locale="en"></b-form-timepicker>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="3">
        <p>End</p>
      </b-col>
      <b-col>
        <b-form-timepicker v-model="endTime" locale="en"></b-form-timepicker>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="auto">
        <b-calendar v-model="calDate" @context="onContext" locale="en-US"></b-calendar>
      </b-col>
      <b-col>
        <pre class="small">{{ context }}</pre>
      </b-col>
    </b-row>
    <div>
      <button>Schedule</button>
    </div>
    <hr class="solid" />
  </div>
</template>

<script>
//vars with the intent of being accessible in the scope of chrome storage
var calCompList = [];
//const browser = require("webextension-polyfill");
export default {
  name: "calComp",

  data() {
    return {
      list: [], //used to generate dropdown
      recur: false
    };
  },

  methods: {
    toggleRecur: function() {
      this.recur = !this.recur;
    },

    //Uses chrome storage api to retrieve data from local storage.
    //Storage retrieval is asynchronous and the vue data fields aren't accessible within
    //  the storage function's scope, so we use var a,b,c which are still accessible to store the data
    //  and call trackChange to update the vue data fields.
    getData: function() {
      calCompList = this.list;

      chrome.storage.local.get({ list: this.list }, function(result) {
        calCompList = result.list; //Using var a because our data parameters are not in this scope
      });

      this.trackChange(0); //because the get call is asynchronous, using a looping delay function to track the update
    },

    //Function used to update the extension's important data when storage data is retrieved
    //by calling setTimeout, we create a delay between updates, allowing for the async storage
    //api to finish retrieving the necessary data.
    trackChange: function(num) {
      if (this.list != calCompList && calCompList != undefined) {
        this.list = calCompList;
        this.updateSelect();

      }
      if (num < 10) {
        setTimeout(this.trackChange, 100, num + 1);
      }
    },

    updateSelect: function() {
      for (var i = 0; i < this.list.length; i++) {
          document.getElementById("presetSelect")[i] = new Option(
            this.list[i].strings.name
          );
        }
        if (this.list.length < document.getElementById("presetSelect").length) {
          for (var i = this.list.length; i < document.getElementById("presetSelect").length; i++) {
            document.getElementById("presetSelect")[i] = null;
          }
        }
    },

    storeLocalList: function() {
      chrome.storage.local.set({ list: this.list }, function() {});
    },

    refresh: function() {
      this.list = -1;
      this.getData();
    }
  },

  mounted() {
    //alert("Mounted");
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

.calComp {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>