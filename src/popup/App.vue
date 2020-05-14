<template>
  <div class="extension">
    <h2>Site Blocker</h2>

    <!-- <input v-model="keyword" placeholder="Enter keyword"> -->
    
    <p>Site Status: {{ isEnabled }}</p>
    <p>Extension Status: {{ isOn }}</p>

    <button @click="isEnabled = !isEnabled">Block</button>
    <button v-on:click="extState">On</button>

    <button @click="count += 1">Count Up</button>
    <p>The button was clicked {{ count }} times.</p>

    <!-- <p>To get more articles visit <a target="_blank" href="https://www.mynotepaper.com/" style="text-decoration: none;">mynotepaper.com</a></p> -->
  
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
    };
  },
  methods: {
    buttonSearch() {
      window.open("https://www.mynotepaper.com/?s=" + this.keyword);
    },
    siteState() {
      isOn = !isOn;
    },
    extState() {
      isEnabled = !isEnabled
    }
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