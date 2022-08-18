<template>
  <div class="container m-auto">
    <events-calendar ref="eventsCalendar"></events-calendar>
  </div>
</template>

<script>

import EventsCalendar from "@/components/EventsCalendar";

export default {
  name: "App",
  props: {
    msg: String
  },
  components: {
    EventsCalendar
  },
}

</script>

<style lang="scss">

@tailwind base;
@tailwind components;
@tailwind utilities;

</style>
