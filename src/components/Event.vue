<template>
  <div class="event" @click="$root.$refs.eventsCalendar.openEventDialog($event, eventData)">
    <span class="time" v-if="showTime">{{eventData.time}}</span>
    <span >{{eventData.description}}</span>
  </div>
</template>

<style lang="scss" scoped>
@import "./src/style/colors";
.event {
  height: 100%;
  background-color: beige;
  border: 1px solid #333;
}

.event:hover {
  border: 1px solid $button-blue;
}
</style>

<script>
export default {
  name: 'calendar-event',
  mounted() {

    Object.keys(this.eventData).forEach(key => {
      this.$data[key] = this.eventData[key];
    });
    this.start = new Date(this.eventData.start);
    if (this.$parent.updateBasis) {
      this.$parent.updateBasis();
    }
  },
  data() {
    return {
      start: null,
      description: null,
      time: null,
      id: null,
    }
  },
  props: {
    showTime: {
      type: Boolean,
      default: false
    },
    eventData: Object,
  },
}
</script>


