<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventFormPopover from '@/components/EventFormPopover';
import {defineComponent} from "vue";
import Api from "@/Api";
import config from "@/Config";
import moment from 'moment';
import ErrorView from "@/components/ErrorView";
import SuccessView from "@/components/SuccessView";
import ListPlugin from '@fullcalendar/list';

export default defineComponent({
  components: {
    FullCalendar,
    EventFormPopover,
    ErrorView,
    SuccessView,
  },
  methods: {

    flashSuccessMessage(message) {

      this.message = message;
      setTimeout(() => {
        this.message = "";
      }, 3000);
    },

    flashErrors(errors) {
      this.errors = errors;
      setTimeout(() => {
        this.errors = {};
      }, 5000);
    },

    closePopover() {
      this.$refs.eventFormPopover.$refs.popover.close();
    },

    handleDateClick(dateClickInfo) {
      this.closePopover();

      if (this.isMobileBrowser()) {
        const evtDialogComp = this.$refs.eventFormPopover;
        evtDialogComp.load(dateClickInfo.date, dateClickInfo.date);
        evtDialogComp.allDay = dateClickInfo.allDay;
        evtDialogComp.$refs.popover.open({});
      }
      console.info('datelickc', dateClickInfo);
    },

    handleDateSet() {

      if (window.localStorage.getItem("lastDate") !== this.calendarApi.getCurrentData().currentDate.toISOString()) {
        this.fetchEvents(true);
      }

      window.localStorage.setItem("lastDate", this.calendarApi.getCurrentData().currentDate.toISOString());
      window.localStorage.setItem("calendarView", this.calendarApi.view.type);


      return () => {

      }
    },

    handleEventAllow(dropInfo) {
      // console.info("dropInfo", dropInfo);

      return dropInfo.start > new Date()
    },
    handleSelectAllow(selectInfo) {
      return selectInfo.start >= new Date();
    },
    handleEventDelete(eventId) {
      this.api.delete(`events/${eventId}`)
          .then(async response => {
            const jsonResponse = await response.json();
            if (!jsonResponse.ok) {
              this.flashErrors(jsonResponse.errors);
              return;
            }
            this.closePopover();

            setTimeout(() => { // only to notice the event being deleted
              this.fetchEvents();
            }, 400);

            this.flashSuccessMessage("Event deleted");


          }, () => {
            this.flashErrors(["Bad server response"]);
          });
    },

    handleEventClick(calendarEvent) {
      this.selectedEvent = calendarEvent.event;

      const evtDialogComp = this.$refs.eventFormPopover;
      evtDialogComp.load(calendarEvent.event.start, calendarEvent.event.end);
      evtDialogComp.id = calendarEvent.event.id;
      evtDialogComp.description = calendarEvent.event.title;
      evtDialogComp.editingEvent = true;
      evtDialogComp.$refs.popover.open({
        x: calendarEvent.jsEvent.pageX,
        y: calendarEvent.jsEvent.pageY,
      });
    },

    handleEventOverlap(stillEvent, movingEvent) {
      stillEvent; movingEvent;
      // two all-day events can't happen at the same day
      if (stillEvent.allDay && movingEvent.allDay) {
        return false;
      }

      if (stillEvent.allDay) {
        return true;
      }

      if (movingEvent.start.getTime() < stillEvent.end.getTime() && movingEvent.end.getTime() > stillEvent.start.getTime()) {
        return false;
      }

      return true;
    },

    handleChange(calendarEvent) {

      const evtData = {
        start: new moment(calendarEvent.event.start).utc().format(this.formats.datetime),
        description: calendarEvent.event.title,
        all_day: calendarEvent.event.allDay
      };

      if (calendarEvent.event.end) {
        evtData['end'] = new moment(calendarEvent.event.end).utc().format(this.formats.datetime);
      } else if (!calendarEvent.event.allDay) { // event moved from all-day to time specific
        evtData['end'] = new moment(calendarEvent.event.start).add(30, 'minutes').utc().format(this.formats.datetime); // event moved from all
      }

      if (!this.validateEvent(evtData)) {
        return false;
      }

      delete evtData['id'];


      this.api.update(`events/${calendarEvent.event.id}`, evtData).then(async response => {
        const jsonResponse = await response.json();
        this.status = false;
        if (!jsonResponse.ok) {
          this.flashErrors(jsonResponse.errors);
          console.error(jsonResponse.error);
          return;
        }

        this.flashSuccessMessage("Event updated");

      }, () => {
        this.flashErrors(["Bad server response"]);
      });
    },

    handleEventUpdate(eventData) {
      console.info("updating", eventData, this.api);
      this.status = "loading";
      const eventId = eventData.id;
      delete eventData['id'];
      this.api.update(`events/${eventId}`, eventData).then(async response => {
        const jsonResponse = await response.json();
        console.info("response", jsonResponse);
        this.status = false;
        if (!jsonResponse.ok) {
          this.flashErrors(jsonResponse.errors);
          return;
        }
        this.flashSuccessMessage("Event updated");

        this.closePopover();
        this.fetchEvents();
      }, () => {
        this.flashErrors(["Bad server response"]);
      });
    },


    handleEventCreate(eventData) {
      console.info("adding", eventData, this.api);
      this.status = "loading";

      this.api.post("events", eventData).then(async response => {
        const jsonResponse = await response.json();
        console.info("response", jsonResponse);
        this.status = false;
        if (!jsonResponse.ok) {
          this.flashErrors(jsonResponse.errors);
          return;
        }
        this.closePopover();
        this.$refs.eventFormPopover.reset();
        this.fetchEvents();
        this.flashSuccessMessage("Event created");

      }, () => {
        this.flashErrors(["Bad server response"]);
      });
    },

    handleSelect(calendarEvent) {

      this.closePopover();

      this.selected = {
        start: calendarEvent.start,
        end: calendarEvent.end,
      };

      const evtDialogComp = this.$refs.eventFormPopover;
      evtDialogComp.load(this.selected.start, this.selected.end);
      evtDialogComp.allDay = calendarEvent.allDay;
      evtDialogComp.$refs.popover.open({
        x: calendarEvent.jsEvent.pageX,
        y: calendarEvent.jsEvent.pageY,
      });

    },

    fetchEvents(enableCaching = false) {
      const range = this.calendarApi.getCurrentData().dateProfile.currentRange;

      this.status = "loading";
      this.api.get("events", {
        start_date: moment(range.start).startOf('month').format(this.formats.date),
        end_date: moment(range.end).endOf('month').format(this.formats.date)
      }, enableCaching)
          .then(async response => {
            this.status = false;
            const jsonResponse = await response.json();
            this.calendarOptions.events = [];
            jsonResponse.events.forEach(ev => {

              this.calendarOptions.events.push({
                id: ev._id,
                title: ev.description,
                start: new Date(ev.start),
                end: new Date(ev.end),
                allDay: ev.all_day
              });

            });


          }, () => {
            this.flashErrors(["Bad server response"]);

          });
    },


    handleEvents() {
      this.closePopover();
    },


  },
  computed: {
    statusShown() {
      return true;
    },
    calendarApi() {
      return this.$refs.fullCalendar.getApi();
    }
  },
  created() {
    this.api = new Api(config.api_host);
  },
  data() {

    const calendarOptions = {
      currentRequest: null,
      events: [],
      currentDate: null,
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, ListPlugin],
      initialView: window.localStorage.getItem('calendarView') ? window.localStorage.getItem('calendarView') : 'dayGridMonth',
      initialDate: window.localStorage.getItem('lastDate') ? new Date(window.localStorage.getItem('lastDate')) : new Date(),
      weekends: true,
      editable: true,
      datesSet: this.handleDateSet,
      eventAllow: this.handleEventAllow,
      eventClick: this.handleEventClick,
      eventDrop: this.handleChange,
      eventResize: this.handleChange,
      select: this.handleSelect,
      eventOverlap: this.handleEventOverlap,
      selectAllow: this.handleSelectAllow,
      selectMirror: true,
      selectable: true,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      }
    };

    // single selection is not available on mobile, a click on a date will toggle the event form popover
    if (this.isMobileBrowser()) {
      calendarOptions['dateClick'] = this.handleDateClick;
    }

    return {
      message: "",
      selectedEvent: null,
      errors: {},
      selected: {start: null, end: null},
      api: null,
      events: [],
      status: false,
      calendarOptions: calendarOptions
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="w-100" v-if="Object.keys(errors).length">
      <error-view v-for="error in Object.values(errors)" :error="error" :key="error"></error-view>
    </div>
    <div
        :class="{'w-100': true, 'transition':true, 'duration-300':true, 'opacity-100': message.length, 'opacity-0': !message.length}">
      <success-view :message="message"></success-view>
    </div>

    <full-calendar ref="fullCalendar" :options="calendarOptions"></full-calendar>
    <event-form-popover @event-delete="handleEventDelete" @event-create="handleEventCreate"
                        @event-update="handleEventUpdate"
                        ref="eventFormPopover"></event-form-popover>
  </div>
</template>


<style lang="scss">
.fc {
  padding-top: 4rem;
}

@media (max-width: 600px) {
  .fc .fc-toolbar {
    flex-direction: column;
  }
}

</style>
