<template>
  <multi-day-view view-type="day-view" :selected-date="selectedDate"></multi-day-view>
</template>
<style lang="scss">
.day-view > .week-day:first-child {
  width: 10%;
}
.time-block:hover > button {
  visibility: visible;
  opacity: 7.0;
}
</style>
<script>
import MultiDayView from "@/components/view_types/MultiDayView";

export default {
  components: {MultiDayView},
  props: {
    selectedDate: Date
  }
}
</script>




