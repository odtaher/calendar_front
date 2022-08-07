<template>
  <div class="events-calendar">

    <navigation-header
        @prev="browse('prev')"
        @next="browse('next')"
        ref="navigationHeader">
    </navigation-header>

    <month-view v-if="viewType=='month'"></month-view>
    <week-view v-if="viewType=='week'"></week-view>
    <day-view v-if="viewType=='day'"></day-view>
  </div>
</template>

<script>
import MonthView from "@/components/view_types/MonthView";
import WeekView from "@/components/view_types/WeekView";
import DayView from "@/components/view_types/DayView";
import NavigationHeader from "@/components/NavigationHeader";
import moment from "moment";

export default {
  name: "events-calendar",
  components: {MonthView, WeekView, DayView, NavigationHeader},
  props: {
    msg: String
  },
  mounted() {
    this.updateRange();
  },
  watch: {
    selectedDate() {
      this.updateRange();
    },
  },
  methods: {
    updateRange() {
      this.fromDate = moment(this.selectedDate).startOf(this.viewType).toDate();
      this.toDate = moment(this.selectedDate).endOf(this.viewType).toDate();
    },
    browse(direction) {
      this.selectedDate.setMonth(this.selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
      this.updateRange();
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
