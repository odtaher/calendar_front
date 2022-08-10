<template>
  <dialog-component :ignore-close-for-classes="['dialog', 'time-block']" ref="dialog" class="show-event-dialog">

    <div v-if="calendarEvent">
      <button class="delete" @click="deleteEvent(calendarEvent)">Delete</button>
      {{ calendarEvent.description }}
      <hr/>
      <div class="event-details">
        <span>{{ calendarEvent.start }}</span>
      </div>
      <div class="event-details">
        <span>Duration:</span> <span>{{ calendarEvent.duration }} min</span>
      </div>
    </div>
  </dialog-component>
</template>
<style lang="scss">
.show-event-dialog {
  height: auto !important;
  width: auto !important;
  min-width: 200px;

  .event-details {
    display: flex;
    flex-direction: column;
  }

  .delete {
    position: absolute;
    bottom: 6px;
    right: 6px;
    color: red;
  }
}
</style>
<script>
import DialogComponent from "@/dialogs/DialogComponent";

export default {
  name: "new-event-dialog",
  components: {DialogComponent},
  methods: {
    deleteEvent(calendarEvent) {
      if (confirm("Sure?")) {
        this.close();
        this.$emit("deleteEvent", calendarEvent._id);
      }
    },
    open(event, calendarEvent) {
      this.$refs.dialog.open(event);
      this.calendarEvent = calendarEvent;
      this.$forceUpdate();
    },

    close() {
      this.$refs.dialog.close();
    },

  },

  data() {
    return {
      calendarEvent: null
    }
  }
}
</script>

