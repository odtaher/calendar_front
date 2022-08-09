<template>
  <div v-show="isOpen" class="dialog">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "dialog-component",
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    open(event) {

      const position = this.$root.$refs.eventsCalendar.getProperDialogPosition(event);

      this.$el.style.top = position.top + "px";
      this.$el.style.left = position.left + "px";
      this.isOpen = true;

      this.listenForOuterClicks();
    },

    listenForOuterClicks() {
      const callback = (ev) => {

        let node = ev.target;
        if (node.classList.contains("new-event")) {
          return;
        }
        while (node) {

          if (this.ignoreCloseForClasses.filter(cls => {
            return node.classList?.contains(cls);
          }).length) {
            return;
          }
          node = node.parentNode;
        }
        document.body.removeEventListener('click', callback);
        this.close();
      }
      document.body.addEventListener('click', callback);
    },

    close() {
      this.isOpen = false;
    },
  },
  props: {
    ignoreCloseForClasses: {
      type: Array,
      default: () => ['dialog']
    }
  }
}
</script>

<style lang="scss" scoped>


.dialog {

  @import "../style/colors";
  @import "../style/layout";

  @include modal;

  display: flex;
  flex-direction: column;

}


</style>