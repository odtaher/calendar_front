<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "PopoverComponent",
  props: {
    title: String
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    handleOuterClick(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      console.info("handleOuterClick");
      let target = ev.target;
      while (target) {
        if (target.classList.contains('popover')) {
          this.removeOuterClickHandler();
          return;
        }
        target = target?.parentElement;
      }
      this.close();
    },

    removeOuterClickHandler() {
      document.body.removeEventListener('click', this.handleOuterClick);
    },

    open(mousePosition) {
      this.isOpen = true;
      let left = 0;
      let top = 0;
      const mainElement = this.$refs.popoverDiv;

      if (window.innerWidth > 400 && window.innerHeight > 500) {

        const popoverHeight = mainElement.clientHeight === 0 ? 400 : mainElement.clientHeight;
        const popoverWidth = mainElement.clientWidth === 0 ? 300 : mainElement.clientWidth;

        top = mousePosition.y;

        if (top + popoverHeight > window.innerHeight) {
          top -= popoverHeight;
        }

        left = mousePosition.x;

        if (left + popoverWidth > window.innerWidth) {
          left -= popoverWidth;
        }
      }

      mainElement.style.top = top + "px";
      mainElement.style.left = left + "px";


      this.removeOuterClickHandler();

      setTimeout(() => {
        document.body.addEventListener('click', this.handleOuterClick);
      }, 10);
    },
    close() {
      this.isOpen = false;
      this.$emit("close");
      this.removeOuterClickHandler();

    }
  }
});
</script>

<template>
  <div ref="popoverDiv"
       :class="{'visible': isOpen, 'invisible': !isOpen, 'opacity-100': isOpen, 'opacity-0': !isOpen, 'transition-opacity': true, 'duration-300': true, popover: true, container:true, absolute: true, 'bg-grey-50': true, 'reuez-10': true}">
    <div
        class="p-4 w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
      <form class="space-y-3" action="#">
        <h5 class="text-xl font-medium text-gray-900 dark:text-white">{{ title }}</h5>
        <slot></slot>
      </form>
    </div>
  </div>
</template>
<style>
.popover {
  width: auto !important;
  z-index: 100;
}
</style>
