<template>
  <div :class="viewType">

    <div class="week-day">
      <div>&nbsp;</div>
      <div v-for="timeIndex in 48" :key="timeIndex">
        {{ $root.helper.timeByIndex(timeIndex) }}
      </div>
    </div>
    <div class="week-day" v-for="day in daysToShow" :key="day">
      <div v-if="viewType==='week-view'"><span>{{ dayNames[day - 1] }} {{ $root.helper.shortDateByDay(selectedDate, day) }}</span></div>
      <time-block
          @move="move"
          @error="error"
          :date="$root.helper.formatDayOfMonth(selectedDate, day)"
          :time="$root.helper.timeByIndex(timeIndex)"
          :calendar-event="$root.$refs.eventsCalendar.eventsData[$root.helper.formatDayOfMonth(selectedDate, day)]?.get($root.helper.timeByIndex(timeIndex))"
          v-for="timeIndex in 48" :key="timeIndex">
      </time-block>
    </div>


  </div>
</template>

<style lang="scss" scoped>

.week-view, .day-view {

  width: 100%;
  justify-content: space-between;

  display: flex;
  flex-direction: row;

  .week-day {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: stretch;

    > div {
      height: 40px;
      border: 1px solid black;
      border-bottom-width: 0;
      border-right-width: 0;
      box-sizing: border-box;
      position: relative;

    }
  }

  .week-day:last-child > div {
    border-right-width: 1px;
  }

  .week-day > div:last-child {
    border-bottom-width: 1px;
  }

}

div.hours-container {
  justify-content: start;
  align-items: flex-start;
  grid-template-rows: repeat(24, 30px);
}
</style>

<script>
import TimeBlock from "@/components/TimeBlock";

export default {
  components: {TimeBlock},
  name: 'week-view',
  props: {
    move: Function,
    error: Function,
    viewType: String,
    selectedDate: Date,
  },
  computed: {
    daysToShow() {
      return this.viewType === 'week-view' ? 7 : 1;
    }
  },
  data() {
    return {
      dayNames: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
    }
  },
}
</script>




