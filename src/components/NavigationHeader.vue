<template>
  <header>
    <div class="nav-buttons-container">
      <div class="nav-buttons">
        <button @click="$emit('prev')" class="blue nav-previous">
          &lt;
        </button>
        <button @click="$emit('next')" class="blue nav-next">
          &gt;
        </button>
      </div>
      <button @click="$emit('today')" class="light-blue nav-next">Today</button>
    </div>

    <div class="date-range" v-if="['month', 'week'].indexOf($parent.fromDate && $parent.viewType)>-1">
      <b> {{ dateFormatForTitle($parent.fromDate) }} - {{ dateFormatForTitle($parent.toDate ) }}</b>
    </div>
    <div class="date-range" v-if="$parent.fromDate && $parent.viewType === 'day'">
      <b> {{ dateFormatForTitle($parent.fromDate) }} </b>
    </div>

    <div class="view-types">
      <button :class="{blue:true, active:$parent.viewType==='month'}" @click="$parent.viewType='month'">Month</button>
      <button :class="{blue:true, active:$parent.viewType==='week'}" @click="$parent.viewType='week'">Week</button>
      <button :class="{blue:true, active:$parent.viewType==='day'}" @click="$parent.viewType='day'">Day</button>
      <button :class="{blue:true, active:$parent.viewType==='list'}" @click="$parent.viewType='list'">List</button>
    </div>
  </header>
</template>

<script>
export default {
  name: "navigation-header",
  data() {
    return {
      dateRange: ""
    }
  },
  methods: {
    dateFormatForTitle(date) {
      return date ? date.toLocaleDateString("en-US", {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }) : ""
    }
  }
}
</script>

<style lang="scss" scoped>

header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  align-items: center;
}

.nav-buttons-container {

  display: flex;
  justify-content: space-between;
  min-width: 130px;

  .nav-buttons {
    display: flex;
    min-width: 60px;
    justify-content: space-between;

  }
}
</style>