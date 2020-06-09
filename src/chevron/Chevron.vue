<template>
    <div @click="toggle">
    
        <vue-chevron
        :point-down="pointDown"
        :duration="duration"
        :thickness="thickness"
        :angle="angle"
        :round-edges="roundEdges"
        :height="23"
        :width="23"
        :name="'sd'"
        />
    
    </div>

</template>

<script>
import VueChevron from 'vue-chevron';

export default {
  name: 'chevron',
  components: {
    VueChevron
  },
  data() {
    return {
      pointDown: true,
      thickness: 8,
      duration: 200,
      angle: 45,
      roundEdges: true,
      easing: function n(t){return t}
    };
  },
  methods: {
    toggle() {
      this.pointDown = !this.pointDown;
    }
  }
}
</script>

<style>

</style>