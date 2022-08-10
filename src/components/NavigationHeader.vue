<template>
  <header :class="{floating: floatingHeader}">
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
      <b> {{ dateFormatForTitle($parent.fromDate) }} - {{ dateFormatForTitle($parent.toDate) }}</b>
    </div>
    <div class="date-range" v-if="$parent.fromDate && $parent.viewType === 'day'">
      <b> {{ dayFormatForTitle($parent.fromDate) }} </b>
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
  mounted() {
    this.listenForPageScrolls();
  },
  name: "navigation-header",
  data() {
    return {
      floatingHeader: false,
      dateRange: ""
    }
  },
  methods: {
    listenForPageScrolls() {
      document.addEventListener( "scroll", () => {
        this.floatingHeader = window.scrollY > 100;
      })
    },
    isSmallScreen() {
      return window.outerWidth < 600;
    },
    dateFormatForTitle(date) {

      let options = {
        month: 'short',
        day: 'numeric',
      };
      if (!this.isSmallScreen()) {
        options['year'] = 'numeric';
        options['month'] = 'long';
      }

      if (!date) {
        return "";
      }

      return date.toLocaleDateString("en-US", options);
    },
    dayFormatForTitle(date) {

      let options = {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
        year: 'numeric'
      }
      if (this.isSmallScreen()) {
        options = {weekday: "short"};
      }

      if (!date) {
        return "";
      }

      return date.toLocaleDateString("en-US", options);
    }
  }
}
</script>

<style lang="scss" scoped>

@import "src/style/colors.scss";

header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  align-items: center;
  position: relative;
  padding: 12px 0;
  border: 1px solid $border-color;

  top: 0;
  max-width: 1200px;
  background-color: #bdc1be;
}

header.floating {
  position: fixed;
  z-index: 99;
  border-bottom-top: 0;
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