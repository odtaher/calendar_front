<template>
  <div class="event">
    {{eventData.description}}
  </div>
</template>

<style lang="scss" scoped>
.event {
  height: 100%;
  background-color: beige;
  border: 1px solid #333;
}
</style>

<script>
export default {
  name: 'calendar-event',
  mounted() {
    Object.keys(this.eventData).forEach ( key => {
      this.$data[key] = this.eventData[key];
    });
    this.start = new Date(this.eventData.start);

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
    eventData: Object,
  },
}
</script>


