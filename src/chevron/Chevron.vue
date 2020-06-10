<template>
    <div @click="toggle">
        <!-- Main component to animate chevron -->
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
/**
 * @module chevron
 * @author Daryl Nakamoto
 *
 * @vue-data {Bool} [pointDown=true] - Indicates if the dropdown chevron of a preset should be pointing down
 * @vue-data {Int} [thickness=8] - Thickness of the chevron
 * @vue-data {Int} [duration=200] - Duration of the chevron animation in miliseconds
 * @vue-data {Int} [angle=45] - Angle between the edges of the chevron
 * @vue-data {Bool} [roundEdges=true] - Indicates if the edges of the chevron should be rounded
 * @vue-event toggle {None} - Toggle the direction of the chevron
 */
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