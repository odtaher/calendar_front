<template>
  <multi-day-view @error="(err) => $emit('error', err)" @move="move" view-type="week-view" :selected-date="selectedDate"></multi-day-view>
</template>

<script>
import MultiDayView from "@/components/view_types/MultiDayView";

export default {
  components: {MultiDayView},
  props: {
    move: Function,
    selectedDate: Date
  }
}
</script>




