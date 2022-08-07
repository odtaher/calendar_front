<template>
  <div class="grid-container week-view">
    <div v-for="day in 7*24*2" :key="day">
      {{day}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'week-view',
}
</script>

<style lang="scss" scoped>
div.week-view {
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(24*2, 100%);
}
</style>


