<template>
  <div class="events-calendar">

    <navigation-header
        @prev="browse('prev')"
        @next="browse('next')"
        @today="browseToToday"
        ref="navigationHeader">
    </navigation-header>

    <month-view v-if="viewType==='month'" :selected-date="selectedDate"></month-view>
    <week-view @move="eventMoved" ref="weekView" v-if="viewType==='week'" :selected-date="selectedDate"></week-view>
    <day-view v-if="viewType==='day'" :selected-date="selectedDate"></day-view>

    <new-event-dialog @newEvent="eventAdded" ref="newEventDialog"></new-event-dialog>
    <event-dialog @deleteEvent="deleteEvent" ref="eventDialog"></event-dialog>
  </div>
</template>
<style>
.events-calendar {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
<script>
import MonthView from "@/components/view_types/MonthView";
import WeekView from "@/components/view_types/WeekView";
import DayView from "@/components/view_types/DayView";
import NavigationHeader from "@/components/NavigationHeader";
import moment from "moment";
import Config from '@/Config';
import NewEventDialog from "@/components/NewEventDialog";
import EventDialog from "@/components/EventDialog";

export default {
  name: "events-calendar",
  components: {MonthView, WeekView, DayView, NavigationHeader, NewEventDialog, EventDialog},
  props: {
    msg: String
  },
  mounted() {
    this.updateRange();
    this.fetchEvents();
  },
  watch: {
    viewType() {
      this.selectedDate = moment(this.selectedDate).startOf(this.viewType).toDate();
    },
    selectedDate() {
      this.updateRange();
    },
  },
  methods: {

    eventMoved(eventId, destination) {
      const dateSplits = destination.date.split("-");
      const timeSplits = destination.time.split(":");
      const destinationTime = new Date(dateSplits[0], parseInt(dateSplits[1]) - 1, dateSplits[2], timeSplits[0], timeSplits[1]);

      const postDataStr = this.$root.helper.dictionaryToPostData({
        start: moment(destinationTime).format("YYYY-MM-DD HH:mm:00"),
      });
      fetch(`${Config.api_host}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postDataStr
      }).then(async response => {
        const jsonResponse = await response.json();
        if (!jsonResponse.ok) {
          // @todo show error
          return;
        }
        // @todo show success message
        this.fetchEvents(true);
      })
    },
    eventAdded(newEvent) {

      let start = new Date(newEvent.date);

      start.setHours(parseInt(newEvent.from_time.split(":")[0]));
      start.setMinutes(parseInt(newEvent.from_time.split(":")[1]));

      const postDataStr = this.$root.helper.dictionaryToPostData({
        start: moment(start).format("YYYY-MM-DD HH:mm:00"),
        description: newEvent.description,
        duration: this.$root.helper.eventDuration(newEvent.from_time, newEvent.to_time)
      });

      fetch(`${Config.api_host}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postDataStr
      }).then(async response => {
        const jsonResponse = await response.json();
        if (!jsonResponse.ok) {
          this.$refs.newEventDialog.errors.server = jsonResponse.error;
          this.$refs.newEventDialog.$forceUpdate();
          return;
        }

        this.$refs.newEventDialog.close();
        this.fetchEvents();

      })

    },
    getProperDialogPosition(event) {
      let pageX = event.pageX;
      let pageY = event.pageY;
      const dialogComponent = this.$refs.newEventDialog;
      const dialogWidth = dialogComponent.clientWidth ? dialogComponent.clientWidth : 600;
      const dialogHeight = dialogComponent.clientHeight ? dialogComponent.clientHeight : 420;
      console.info(dialogWidth, dialogHeight);
      if (pageX + dialogWidth > document.body.clientWidth) {
        pageX = document.body.clientWidth - dialogWidth;
      }
      pageY += 10;
      pageX += 10;
      return {top: pageY, left: pageX};
    },
    openEventDialog(event, calendarEvent) {
      console.info(this.$refs.eventDialog);
      this.$refs.eventDialog.open(event, calendarEvent);
    },
    openNewEventDialog(event, date, time) {
      this.$refs.newEventDialog.open(event, date, time);
    },
    fetchEvents(clearEventsData = false) {

      const month = [
        this.selectedDate.getFullYear(),
        this.$root.helper.intWithLeadingZero(this.selectedDate.getMonth() + 1)
      ].join("-")

      fetch(`${Config.api_host}/events?month=${month}`).then(async response => {
        if (!response.ok) {
          this.flashErrors(response.errors);
          return;
        }

        if (clearEventsData) {
          this.eventsData = {};
        }

        const jsonResponse = await response.json();

        jsonResponse.events.forEach(event => {
          if (this.eventsData[event.date] === undefined) {
            this.eventsData[event.date] = new Map();
          }

          const start = moment(event.start).toDate();
          const timeBlockStr = [start.getHours(), start.getMinutes()].map(this.$root.helper.intWithLeadingZero).join(":");

          this.eventsData[event.date].set(timeBlockStr, event);

          this.fillTimeBlocksForLongEvents(start, event);
        });

        this.$forceUpdate();


      }, error => {
        this.flashErrors([error]);
      });
    },
    /**
     * for events that have a duration more than 30 minutes,
     * the next time blocks will be also assigned to that event
     * but hidden from the calendar
     * @param start
     * @param event
     */
    fillTimeBlocksForLongEvents(start, event) {
      for (let timeBlock = 30; timeBlock < event.duration; timeBlock += 30) {
        start.setMinutes(start.getMinutes() + timeBlock);
        const timeBlockStr = [start.getHours(), start.getMinutes()].map(this.$root.helper.intWithLeadingZero).join(":");
        this.eventsData[event.date].set(timeBlockStr, {...{hidden: true}, ...event});
      }
    },
    flashErrors(errors) {
      errors;
    },
    updateRange() {
      this.fromDate = moment(this.selectedDate).startOf(this.viewType).toDate();
      this.toDate = moment(this.selectedDate).endOf(this.viewType).toDate();
    },
    browseToToday() {
      this.selectedDate = new Date();
      this.updateRange();
    },
    browse(direction) {
      if (this.viewType === 'month') {
        this.selectedDate.setMonth(this.selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
      }
      if (this.viewType === 'week') {
        this.selectedDate.setDate(this.selectedDate.getDate() + (direction === 'next' ? 7 : -7));
      }
      this.selectedDate = new Date(this.selectedDate);
      this.updateRange();
      this.fetchEvents();
    },
    dateFormatForTitle(date) {
      return date.toLocaleDateString("en-US", {
        month: 'long',
        day: 'numeric',
      })
    },

    deleteEvent(calendarEventId) {
      fetch(`${Config.api_host}/events/${calendarEventId}`, {
        method: 'DELETE',
      }).then(async response => {
        const jsonResponse = await response.json();
        if (!jsonResponse.ok) {
          // @todo show error
          return;
        }

        // @todo show success message
        this.fetchEvents(true);
      })
    }
  },
  data() {
    return {
      eventsData: {},
      selectedDate: new Date(),
      viewType: "month",
      fromDate: null,
      toDate: null,
    }
  }
}
</script>

<style lang="scss">
.events-calendar > header {
  margin-bottom: 12px;
}


.view-types {
  min-width: 220px;
  display: flex;
  justify-content: space-between;
}

.grid-container {
  grid-row-gap: 0;
  grid-column-gap: 0;
  align-items: stretch;
  display: grid;
}


</style>
