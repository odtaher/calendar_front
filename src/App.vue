<template>
  <div class="container">
    <events-calendar ref="eventsCalendar">
    </events-calendar>
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
    'events-calendar': EventsCalendar,
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

@import "style/buttons.scss";
@import "style/layout.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  margin: 22px;
}

</style>
