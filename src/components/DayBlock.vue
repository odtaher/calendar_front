<template>
  <div class="day-block">
    <button @click="(ev) => { $root.$refs.eventsCalendar.openNewEventDialog(ev, date, null)}"
            class="blue new-event">+
    </button>
    <div class="time-block" :key="eventData" v-for="eventData in calendarEvents">
      <calendar-event :show-time="true" :event-data="eventData">
      </calendar-event>
    </div>
  </div>
</template>

<style lang="scss">
@import "src/style/layout";
.day-block {
  width: 100%;
  height: 100%;
  text-align: left;

  .event {
    padding: 0 6px;

    @include text-overflow;
  }

  .time {
    padding-right: 6px;
  }
}

.day-block button.new-event {
  visibility: hidden;
  z-index: 10;
  opacity: 0;
  transition: visibility 0s, opacity 0.3s linear;
  position: absolute;
  margin: auto auto;
  left: 0;
  top: 0;
  width: 30px;
  height: 30px;
}

.month-view > div:hover button {
  visibility: visible;
  opacity: 7.0;
}

</style>

<script>
import CalendarEvent from "@/components/Event";

export default {
  name: 'day-block',
  components: {CalendarEvent},
  mounted() {
  },
  data() {
    return {
      rows: 1,
    }
  },
  props: {
    date: String,
    calendarEvents: {
      type: Object,
    },
  },
}
</script>


