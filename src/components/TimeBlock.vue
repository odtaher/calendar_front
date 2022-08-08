<template>
  <div class="time-block" v-show="calendarEvent === null || !calendarEvent.hidden">
    <button class="blue">+</button>
    <calendar-event ref="eventComponent" v-if="calendarEvent" :event-data="calendarEvent">
    </calendar-event>
  </div>
</template>

<style scoped>
.time-block > button {
  visibility: hidden;
  z-index: 10;
  opacity: 0;
  transition: visibility 0s, opacity 0.3s linear;
  font-weight: bold;
  position: absolute;
  left: 0;
  margin: 0 auto;
  right: 0;
  width: 40px;
}

.time-block:hover > button {
  visibility: visible;
  opacity: 7.0;
}

</style>

<script>
import CalendarEvent from "@/components/Event";

export default {
  name: 'time-block',
  components: {CalendarEvent},
  mounted() {
    if (this.calendarEvent) {
      this.$el.style.flexBasis = (40 * Math.floor(this.$refs.eventComponent.duration / 30)) + "px";
    }
  },
  data() {
    return {
      rows: 1,
    }
  },
  props: {
    calendarEvent: {
      type: Object,
      default: null
    },
  },
}
</script>


