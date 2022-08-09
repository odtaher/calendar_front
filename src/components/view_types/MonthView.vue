<template>
  <div class="grid-container month-view">
    <div v-for="day in lastDayOfMonth" :key="day">
      <div class="day-number">
        {{ day }}
      </div>

      <day-block
          :calendar-events="eventsForDate($root.helper.formatDayOfMonth(firstDayOfMonth, day))"
          :date="year+'-'+$root.helper.intWithLeadingZero(month)+'-'+$root.helper.intWithLeadingZero(day)"
      ></day-block>

    </div>
  </div>

</template>

<script>

import DayBlock from "@/components/DayBlock";

export default {
  name: 'month-view',
  components: {DayBlock},
  mounted() {
    this.$forceUpdate();
  },
  methods: {
    eventsForDate(date) {
      const eventEntries = this.$root.$refs.eventsCalendar?.eventsData[date]?.entries();
      if (!eventEntries) {
        return;
      }

      return Array.from(eventEntries).map(entry => entry[1]).filter(entry => !entry.hidden);
    },
  },
  computed: {
    lastDayOfMonth() {
      const month = new Date(this.year, this.month, 0);
      return month.getDate();
    },
    firstDayOfMonth() {
      return new Date(this.year, this.month - 1, 0);
    }
  },
  props: {
    selectedDate: Date,
  },

  data() {
    return {

      year: (new Date()).getFullYear(),
      month: (new Date()).getMonth() + 1,
    }
  },
}
</script>

<style lang="scss" scoped>

div.month-view {
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 200px);

  > div {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  button.new-event {
    right: auto;
    bottom: auto !important;
  }

  .day-number {
    text-align: right;

    span {
      font-size: 16px;
      font-weight: bold;
    }
  }
}

.month-view > div:nth-child(7n-6) {
  border-left-width: 1px;
}

.month-view > div:nth-child(-n+7) {
  border-top-width: 1px;
}

.month-view > div {
  padding: 6px 12px 0 0;
  border: 1px solid black;
  border-left-width: 0;
  border-top-width: 0;
  max-width: 200px;
}

</style>


