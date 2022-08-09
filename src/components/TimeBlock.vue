<template>
  <div @dragover.prevent @drop="eventDropped($event, {date:date, time:time})" class="time-block" v-show="calendarEvent === null || !calendarEvent.hidden">
    <button v-if="!calendarEvent" @click="(ev) => { $root.$refs.eventsCalendar.openNewEventDialog(ev, date, time)}"
            class="blue new-event">
      +
    </button>
    <calendar-event @dragstart="eventDragged($event, calendarEvent)" draggable="true" ref="eventComponent" v-if="calendarEvent" :event-data="calendarEvent">
    </calendar-event>
  </div>
</template>

<style lang="scss" scoped>
@import "src/style/layout";

.time-block > button {
  visibility: hidden;
  z-index: 10;
  opacity: 0;
  transition: visibility 0s, opacity 0.3s linear;
  position: absolute;
  margin: auto auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 30px;
  height: 30px;
}

.time-block:hover > button {
  visibility: visible;
  opacity: 7.0;
}

.nowrap {
  .event {
    white-space: normal;
  }
}

.event {
  max-width: 200px;
  @include text-overflow;
}

</style>

<script>
import CalendarEvent from "@/components/Event";

export default {
  name: 'time-block',
  components: {CalendarEvent},
  mounted() {
    this.updateBasis();
  },
  methods: {
    eventDropped(ev, destinationTimeBlock) {
      // emitting to WeekView component, so we can use the callback in EventsCalendar component
      this.$parent.$parent.$emit("move", ev.dataTransfer.getData('eventId'), destinationTimeBlock);
    },
    eventDragged(ev, item) {
      console.info("drag started", ev.target, item);
      ev.dataTransfer.dropEffect = 'move';
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('eventId', item._id);
    },
    updateBasis() {
      if (this.calendarEvent) {
        this.$el.style.flexBasis = (40 * Math.floor(this.$refs.eventComponent.duration / 30)) + "px";
        if (this.calendarEvent.duration > 30) {
          this.$el.classList.add("nowrap");
        }
      }
    }
  },
  data() {
    return {
      rows: 1,
    }
  },
  props: {
    debug: String,
    date: String,
    time: String,
    calendarEvent: {
      type: Object,
      default: null
    },
  },
}
</script>


