<template>
  <div class="container">
    <div class="row my-auto">
      <div class="col-3 my-auto">
        <p class="my-auto category text-left">Mode:</p>
      </div>
      <div class="col">
        <!-- <select @change="updateSel()" name="Presets" id="presetSelect"></select> -->
        <VSelect
          v-model="currSel"
          :labelTitle="title"
          :options="names"
          :searchable="true"
          v-mode.lazy="updateSel()" 
          name="Presets" 
          id="presetSelect"
        />
      </div>
    </div>
    <!-- We decided to remove the users ability to repeat calendar events -->
    <!-- <hr class="solid" />
    <div class="row my-auto">
      <div class="col-3 my-auto">
        <p class="my-auto category text-left">Repeat:</p>
      </div>
      <div class="col">
        <VSelect
          v-model="currRep"
          labelTitle="Never"
          textProp="Never"
          :options="recurring"
          v-mode.lazy="updateSel()" 
        />
      </div>
    </div> -->
    <hr class="solid" />
    
    <b-row class="my-auto">
      <b-col cols="3" class="my-auto">
        <p class="category text-left my-auto">Start:</p>
      </b-col>
      <b-col>
        <b-form-timepicker size="sm" v-model="eventData.startTime" locale="en"></b-form-timepicker>
      </b-col>
    </b-row>

    <b-row class="my-auto">
      <b-col cols="3" class="my-auto">
        <p class="my-auto category text-left">End:</p>
      </b-col>
      <b-col>
        <b-form-timepicker size="sm" v-model="eventData.endTime" locale="en"></b-form-timepicker>
      </b-col>
    </b-row>
    <hr class="solid" />
    <b-row>
      <b-col md="auto">
        <b-calendar :hide-header="true" v-model="eventData.calDate" @context="onContext" locale="en-US"></b-calendar>
      </b-col>
      <b-col>
        <pre class="small">{{ context }}</pre>
      </b-col>
    </b-row>
    <div>
      <b-button style="font-weight: 600;" class="sched-but" pill variant="outline-primary" size="sm" @click="storeSched">Schedule</b-button>
    </div>
    <!-- <div>
      <button @click="clearSched">Clear Schedule Data</button>
    </div> -->
    

    <!-- <hr class="solid" /> -->
  </div>
</template>

<script>
import VSelect from "@alfsnd/vue-bootstrap-select";
/**
 * @module calComp
 * @author Paul Larsen & Daryl Nakamoto
 *
 * @vue-data {ScheduledEvent} eventData - Object simulating a scheduled preset event. Holds a startTime, the time a preset will turn on; endTime, the time a preset is scheduled to turn off (not yet implemented); calDate, the calendar date for when a preset is supposed to turn on; preset, the preset that is being scheduled to turn on.
 * @vue-data {Array} [list=[]] list - An array which is the highest level data storage within the vue. Holds all the presets.
 * @vue-data {Array} [scheduleList=[]] scheduleList - An array for storing the eventData objects.
 * @vue-data {String} [currSel=null] - Hold the current preset selected in the Mode dropdown
 * @vue-data {Array} [names=[]] - Hold all the names of every preset
 * @vue-event storeSched - Stores the vue input fields as a scheduled event. Filters out duplicated start times/dates.
 * @vue-event clearSched - Clears all scheduled alarms
 * @vue-event updateSel - Used to grab the value from the select and store it in eventData
 * @vue-event getData - Updates current fields with those in chrome storage
 * @vue-event trackChange - Delay-based recursive function to deal with asynchronous storage
 * @vue-event updateSelect - Generate the preset selector dropdown
 */



//vars with the intent of being accessible in the scope of chrome storage
var calCompList = [];
var schList = [];

export default {
  name: "calComp",
  props: {
    title: {
      type: String,
      default: "Select a preset"
    }
  },
  components: {
    VSelect
  },
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
      currSel: null,
      names: [],
      list: [], 
      recur: false,
      eventData: {startTime: "", endTime: "", calDate: "", preset: ""},
      scheduleList: []
      
    };
  },
  methods: {

    //Function for storing the input fields as a scheduled event. Filters out duplicated start times/dates.
    storeSched: function() {
      alert(this.eventData.preset)
      if (this.eventData.startTime != "" && this.eventData.endTime != "" && this.eventData.calDate != "" && this.currSel != null) {
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
      if(this.currSel == null){
        this.eventData.preset = "";
      }
      else{
        this.eventData.preset = this.currSel;
      }
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
      var temp = [];
      for (var i = 0; i < this.list.length; i++) {
          temp.push(this.list[i].strings.name);
      }

      this.names = temp;
      this.eventData.preset = this.currSel;
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
.category{
  font-weight: 600;
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
.sched-but{
  margin-bottom: .8em;
}
</style>