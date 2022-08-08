<template>
  <div class="week-view">

    <div class="week-day">
      <div>&nbsp;</div>
      <div v-for="timeIndex in 48" :key="timeIndex">
        {{ timeByIndex(timeIndex) }}
      </div>
    </div>
    <div class="week-day" v-for="day in 7" :key="day">
      <div><span>{{ dayNames[day - 1] }}</span></div>

      <time-block :calendar-event="$parent.eventsData[dateByDay(day)]?.get(timeByIndex(timeIndex-1))"  v-for="timeIndex in 48" :key="timeIndex">
      </time-block>
    </div>


  </div>
</template>

<style lang="scss" scoped>

.week-view {

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
import moment from "moment";

export default {
  components: {TimeBlock},
  methods: {
    dateByDay(day) {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() + day);
      return moment(date).format("YYYY-MM-DD")
    },
    timeByIndex(index) {
      index--;
      let hour = Math.floor(index / 2);
      hour = this.$root.intWithLeadingZero(hour);

      if (index % 2 === 1) { // add half an hour
        return `${hour}:30`;
      }
      return `${hour}:00`;
    }
  },
  name: 'week-view',
  props: {
    selectedDate: Date,
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




