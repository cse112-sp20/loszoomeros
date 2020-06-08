<template>
  <div class="container">
    <b-row>
      <b-col>
        <p>Mode:</p>
      </b-col>
      <b-col>
        <select @change="updateSel()" name="Presets" id="presetSelect"></select>
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
        <b-form-timepicker v-model="eventData.startTime" locale="en"></b-form-timepicker>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="3">
        <p>End</p>
      </b-col>
      <b-col>
        <b-form-timepicker v-model="eventData.endTime" locale="en"></b-form-timepicker>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="auto">
        <b-calendar v-model="eventData.calDate" @context="onContext" locale="en-US"></b-calendar>
      </b-col>
      <b-col>
        <pre class="small">{{ context }}</pre>
      </b-col>
    </b-row>
    <div>
      <button @click="storeSched">Schedule</button>
    </div>
    <div>
      <button @click="clearSched">Clear Schedule Data</button>
    </div>
    

    <hr class="solid" />
  </div>
</template>

<script>
/**
 * @module calComp
 * @author Paul Larsen & Daryl Nakamoto
 *
 * @vue-data {ScheduledEvent} eventData - Object simulating a scheduled preset event. Holds a startTime, the time a preset will turn on; endTime, the time a preset is scheduled to turn off (not yet implemented); calDate, the calendar date for when a preset is supposed to turn on; preset, the preset that is being scheduled to turn on.
 * @vue-data {Array} list - An array which is the highest level data storage within the vue. Holds all the presets.
 * @vue-data {Array} scheduleList - An array for storing the eventData objects.
 * @vue-data {Bool} [recur=false] - Holds the on/off state of the extension as a boolean
 * @vue-event storeSched - Stores the vue input fields as a scheduled event. Filters out duplicated start times/dates.
 * @vue-event clearSched - Clears all scheduled alarms
 * @vue-event updateSel - Used to grab the value from the select and store it in eventData
 * @vue-event toggleRecur - Function passed into the recurrence toggle
 * @vue-event getData - Updates current fields with those in chrome storage
 * @vue-event trackChange - Delay-based recursive function to deal with asynchronous storage
 * @vue-event updateSelect - Function used to generate the preset selector dropdown
 */



//vars with the intent of being accessible in the scope of chrome storage
var calCompList = [];
var schList = [];

export default {
  name: "calComp",

  data() {
    return {
      /*Data variables
      list: The preset list. Used to generate the options in the preset selector. 
      recur: Synced to the recurring event toggle, used for creating multiple events(not yet implemented)
      eventData: Object used to store: 
          startTime, the time a preset will turn on
          endTime, the time a preset is scheduled to turn off (not yet implemented)
          calDate, the calendar date for when a preset is supposed to turn on
          preset, the preset that is being scheduled to turn on
      scheduleList: List for storing eventData objects. Is stored in local storage under the key 'cal'
      */


      list: [], 
      recur: false,
      eventData: {startTime: "", endTime: "", calDate: "", preset: ""},
      scheduleList: []
      
    };
  },

  methods: {

    //Function for storing the input fields as a scheduled event. Filters out duplicated start times/dates.
    storeSched: function() {
      if (this.eventData.startTime != "" && this.eventData.endTime != "" && this.eventData.calDate != "" && document.getElementById('presetSelect').value != "") {
        let ev = this.eventData;
        let sch = this.scheduleList
        //Filtering
        for (var i = 0; i < sch.length; i++) {
          if (sch[i].calDate == ev.calDate && sch[i].startTime == ev.startTime) {
            alert('You already have a mode scheduled at that exact time. Please try a different start time or date.')
            return;
          }
        }
        sch[sch.length] = {
        ...ev
        };
        alert('Scheduled!')
        chrome.storage.local.set({cal: sch}, function() {});
      }

      else {
        alert('Inputs are not finished. Please make sure you have a mode, start time, end time, and date selected.')
        return;
      }
    },

    //Clears all scheduled alarms
    clearSched: function() {
      chrome.alarms.clearAll(function() {
        alert('Cleared preset schedule!')
      })
    },

    //Used to grab the value from the select and store it in eventData
    updateSel() {
      this.eventData.preset = document.getElementById('presetSelect').value;
    },

    //Function passed into the recurrence toggle
    toggleRecur: function() {
      this.recur = !this.recur;
    },

    //Uses chrome storage api to retrieve data from local storage.
    //We are retrieving the preset list(list) and calendar schedule(cal) here.
    //Calls trackchange to update the local values
    getData: function() {
      calCompList = this.list;
      schList = this.scheduleList;

      chrome.storage.local.get({ list: this.list }, function(result) {
        calCompList = result.list; //Using var a because our data parameters are not in this scope
      });

      chrome.storage.local.get({ cal: this.scheduleList}, function(result) {
        schList = result.cal;
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
      if (this.scheduleList != schList && schList != undefined) {
        this.scheduleList = schList;
      }
      if (num < 10) {
        setTimeout(this.trackChange, 100, num + 1);
      }
    },

    //Function used to generate the preset selector dropdown
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
        this.eventData.preset = document.getElementById("presetSelect").value;
    },
  },

  mounted() {
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
.my-button {
  background-color: #eee;
}
.my-button span.text {
  color: red;
}
</style>