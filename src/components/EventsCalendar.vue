<template>
  <div class="events-calendar">

    <navigation-header
        @prev="browse('prev')"
        @next="browse('next')"
        ref="navigationHeader">
    </navigation-header>

    <month-view v-if="viewType=='month'"></month-view>
    <week-view :selected-date="selectedDate" v-if="viewType=='week'"></week-view>
    <day-view v-if="viewType=='day'"></day-view>
  </div>
</template>

<script>
import MonthView from "@/components/view_types/MonthView";
import WeekView from "@/components/view_types/WeekView";
import DayView from "@/components/view_types/DayView";
import NavigationHeader from "@/components/NavigationHeader";
import moment from "moment";
import Config from '@/Config';

export default {
  name: "events-calendar",
  components: {MonthView, WeekView, DayView, NavigationHeader},
  props: {
    msg: String
  },
  mounted() {
    this.updateRange();
    this.fetchEvents();
  },
  watch: {
    viewType() {
      this.selectedDate = moment(this.selectedDate).startOf(this.viewType).toDate();
    },
    selectedDate() {
      this.updateRange();
    },
  },
  methods: {

    fetchEvents() {

      const month = [
        this.selectedDate.getFullYear(),
        this.$root.intWithLeadingZero(this.selectedDate.getMonth() + 1)
      ].join("-")

      fetch(`${Config.api_host}/events?month=${month}`).then(async response => {
        if (!response.ok) {
          this.flashErrors(response.errors);
          return;
        }

        const jsonResponse = await response.json();

        console.info("response", jsonResponse);

        jsonResponse.events.forEach(event => {
          if (this.eventsData[event.date] === undefined) {
            this.eventsData[event.date] = new Map();
          }
          const start = new Date(event.start);
          if (start.getMinutes() < 30) {
            start.setMinutes(0);
          } else {
            start.setMinutes(30);
          }

          const timeBlockStr = [start.getHours(), start.getMinutes()].map(this.$root.intWithLeadingZero).join(":");
          this.eventsData[event.date].set(timeBlockStr, event);

          for (let timeBlock = 30; timeBlock < event.duration; timeBlock += 30) {
            start.setMinutes(start.getMinutes() + timeBlock);
            const timeBlockStr = [start.getHours(), start.getMinutes()].map(this.$root.intWithLeadingZero).join(":");
            this.eventsData[event.date].set(timeBlockStr, {...{hidden: true}, ...event});
          }

        });
      }, error => {
        this.flashErrors([error]);
      });
    },
    flashErrors(errors) {
      errors;
    },
    updateRange() {
      this.fromDate = moment(this.selectedDate).startOf(this.viewType).toDate();
      this.toDate = moment(this.selectedDate).endOf(this.viewType).toDate();
    },
    browse(direction) {
      if (this.viewType === 'month') {
        this.selectedDate.setMonth(this.selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
      }
      if (this.viewType === 'week') {
        this.selectedDate.setDate(this.selectedDate.getDate() + (direction === 'next' ? 7 : -7));
      }
      this.selectedDate = new Date(this.selectedDate);
      this.updateRange();
      this.fetchEvents();
    },
    dateFormatForTitle(date) {
      return date.toLocaleDateString("en-US", {
        month: 'long',
        day: 'numeric',
      })
    }
  },
  data() {
    return {
      eventsData: {},
      selectedDate: new Date(),
      viewType: "month",
      fromDate: null,
      toDate: null,
    }
  }
}
</script>

<style lang="scss">
.events-calendar > header {
  margin-bottom: 12px;
}


.view-types {
  min-width: 220px;
  display: flex;
  justify-content: space-between;
}

.grid-container {
  grid-row-gap: 0;
  grid-column-gap: 0;
  align-items: stretch;
  display: grid;
}


</style>
