<template>
  <div :class="{'active': beingDraggedOver}" @dragleave.prevent="beingDraggedOver=false"
       @dragover.prevent="beingDraggedOver=true" @drop="eventDropped($event, {date:date, time:time})"
       class="time-block" v-show="calendarEvent === null || !calendarEvent.hidden">
    <button v-if="!calendarEvent" @click="(ev) => { $root.$refs.eventsCalendar.openNewEventDialog(ev, date, time)}"
            class="blue new-event">
      +
    </button>
    <calendar-event @dragstart="eventDragged($event, calendarEvent)" draggable="true" ref="eventComponent"
                    v-if="calendarEvent" :event-data="calendarEvent">
    </calendar-event>
  </div>
</template>

<style lang="scss" scoped>
@import "src/style/layout";
@import "src/style/buttons";

.time-block {
  cursor: pointer;
}

.time-block.active {
  background-color: $button-blue;
}

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

    isOverlapping(calendarEvent) {

      const iterator = this.$root.helper.dateFromString(this.date, this.time);

      for (let thirtyMins = 0; thirtyMins <= calendarEvent.duration; thirtyMins += 30) {

        const date = [
          iterator.getFullYear(),
          this.$root.helper.intWithLeadingZero(iterator.getMonth() + 1),
          this.$root.helper.intWithLeadingZero(iterator.getDate()),
        ].join("-");

        const time = [
          this.$root.helper.intWithLeadingZero(iterator.getHours()),
          this.$root.helper.intWithLeadingZero(iterator.getMinutes()),
        ].join(":");

        const overlappingEvent = this.$root.$refs.eventsCalendar.eventsData[date]?.get(time);
        if (overlappingEvent && overlappingEvent._id !== calendarEvent._id) {
          return true;
        }

        iterator.setMinutes(iterator.getMinutes() + 30);
      }

      return false;

    },

    eventDropped(event, destinationTimeData) {
      const source = this.$root.$refs.eventsCalendar.eventsData[event.dataTransfer.getData('date')]?.get(event.dataTransfer.getData('time'));
      this.beingDraggedOver = false;
      if (this.isOverlapping(source)) {
        this.$parent.$parent.$emit("error", 'Events are overlapping');
        return;
      }


      // emitting to WeekView component, so we can use the callback in EventsCalendar component
      this.$parent.$parent.$emit("move", event.dataTransfer.getData('eventId'), destinationTimeData);
    },
    eventDragged(event, item) {

      this.beingDraggedOver = true;
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('eventId', item._id);
      event.dataTransfer.setData('date', item.date);
      event.dataTransfer.setData('time', item.time);
      event.dataTransfer.setData('duration', item.duration);
      console.info("dragged", item);
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
      beingDraggedOver: false,
      rows: 1,
    }
  },
  props: {
    date: String,
    time: String,
    calendarEvent: {
      type: Object,
      default: null
    },
  },
}
</script>


