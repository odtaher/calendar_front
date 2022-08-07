<template>
  <div class="grid-container month-view">
    <div v-for="day in lastDayOfMonth" :key="day">
      <div class="day-number">
        <span>{{ day }}</span>
      </div>

    </div>
  </div>

</template>

<script>
export default {
  name: 'month-view',
  computed: {
    lastDayOfMonth() {
      const month = new Date(this.year, this.month + 1, 0);
      return month.getDate();
    }
  },

  data() {
    return {
      year: (new Date()).getFullYear(),
      month: (new Date()).getMonth(),
    }
  },
}
</script>

<style lang="scss" scoped>

div.month-view {
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 100%);

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
}

</style>


