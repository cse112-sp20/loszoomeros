<template>
  <div class="extension">

    <div style="margin-top:5%">
      <h5>Site Blocker</h5>
    </div>

  
    <!-- <input v-model="keyword" placeholder="Enter keyword"> -->
    
    <!-- <p>Site Status: {{ isEnabled }}</p>
    <p>Extension Status: {{ isOn }}</p>

    <button @click="isEnabled = !isEnabled">Block</button>
    <button v-on:click="extState">On</button> -->
    <!-- <toggle-button :value="data_property" color="#82C7EB" :sync="true" :labels="true"  @change="changeDataProperty" /> -->


    <div class="container" v-for="(item, i) in items" :key="i">
      <div class="row my-auto">
        <div class="col my-auto">
          <toggle-button
              class="my-auto"
              :value="item.value"
              :color="item.color"
              :sync="true"
              :labels="true"
              :key="i"
              @change="updateItemValue(i)"/>
        </div>
        <div class="col my-auto text-left">
          {{item.mode}}
        </div>
        <div class="col my-auto">
          <a class="nav-link dropdown-toggle" data-toggle="collapse" :href="'#' + item.mode" aria-expanded="false"></a>
        </div>
      </div>
      <div class="collapse" :id="item.mode">
        <div class="container">
          <div class="row">
            <div class="col my-auto">
              a website
            </div>
            <div class="col my-auto">
              <toggle-button/>
            </div>
          </div>
          <div class="row">
            <div class="col my-auto">
              a website
            </div>
            <div class="col my-auto">
              <toggle-button/>
            </div>
          </div>
          <div class="row">
            <div class="col my-auto">
              a website
            </div>
            <div class="col my-auto">
              <toggle-button/>
            </div>
          </div>
        </div>
      </div>
      <hr class="solid">
    </div>
  </div>
</template>

<script>
var isEnabled = true;
var isOn = true;
var count = 0;
const browser = require("webextension-polyfill");
export default {
  
  data() {
    return {
      keyword: "",
      isOn: isOn ? "On" : "Off",
      isEnabled: isEnabled ? "Allowed" : "Blocked",
      count:count,
      items: [
        { color: '#E8D2AE', value: false, mode: "Internship" },
        { color: '#CB8589', value: false, mode: "School" },
        { color: '#796465', value: false, mode: "Research" },
        { color: '#79BD8F', value: false, mode: "Projects" },
        { color: '#00A388', value: false, mode: "Fun" }
      ],
      modes: [
        "Internship",
        "School",
        "Projects",
        "Research",
        "Relax/Fun"
      ]
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
    updateItemValue(index) {
      this.items[index].value = !this.items[index].value;
    },
    buttonSearch() {
      window.open("https://www.mynotepaper.com/?s=" + this.keyword);
    },
    siteState() {
      isOn = !isOn;
    },
    extState() {
      isEnabled = !isEnabled
    },
    toggleButton() {
      var toggle = document.getElementById('toggle1');
      alert('fdf');

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
    changeDataProperty(event) {
      this.data_property = true;
       //this.data_property = true;
      //alert('Hello, Console!')
      //(event) ?  this.data_property = true :  this.data_property = false  ;
      chrome.storage.local.get({isOn: true}, function (result) {
        //(event) ?  this.data_property = true :  this.data_property = false;
        prop = true;
        alert('hey')
        var on = !result.isOn;
        chrome.storage.local.set({isOn: !on});
      });
    },
    test(){
      count+=1;
    },

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
</style>