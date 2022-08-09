<template>
  <div class="container">
    <events-calendar ref="eventsCalendar">
    </events-calendar>
  </div>
</template>


<script>
import EventsCalendar from "@/components/EventsCalendar";
import Helper from './Helper.js';

export default {
  name: "App",
  props: {
    msg: String
  },
  data() {
    return {
      helper: new Helper()
    }
  },
  components: {
    'events-calendar': EventsCalendar,
  },
  methods: {

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

@import "style/buttons.scss";
@import "style/layout.scss";
@import "style/colors.scss";

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
