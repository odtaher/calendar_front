<script>
import PopoverComponent from "@/components/PopoverComponent";
import ErrorView from "@/components/ErrorView";
import DatePicker from "vue3-datepicker";
import moment from 'moment';
import {defineComponent} from "vue";
import DeleteIcon from 'vue-material-design-icons/Delete';

export default defineComponent({
  name: "EventFormPopover",
  components: {
    PopoverComponent,
    ErrorView,
    DeleteIcon,
    DatePicker,
  },
  watch: {
    startDate() {
      this.fixEndTime();
    }
  },
  methods: {

    deleteEvent() {
      this.$emit('event-delete', this.id);
    },

    reset() {
      this.start = null;
      this.end = null;
      this.description = "";
      this.all_day = false;
      this.id = false;
    },

    saveEvent() {
      let newEvt = {
        // convert to utc before saving
        description: this.description,
        all_day: this.allDay,
        start: this.start,
        end: this.end,
      };

      let emitVal = 'event-create';

      if (this.id) {
        newEvt['id'] = this.id;
        emitVal = 'event-update';
      }

      if (this.overlappingWithNearbyEvents(newEvt)) {
        this.errors.description = "Overlapping events are not allowed";
        return;
      }

      if (this.validateEvent(newEvt)) {

        newEvt['start'] = new moment(this.start).utc().format(this.formats.datetime)
        newEvt['end'] = new moment(this.end).utc().format(this.formats.datetime)

        this.$emit(emitVal, newEvt);
      }
    },

    load(startDateTime, endDateTime) {
      this.startDate = startDateTime;
      this.endDate = endDateTime;
      this.startTime = moment(startDateTime).format("HH:mm");
      this.endTime = moment(endDateTime).format("HH:mm");

      this.startDate.setHours(0);
      this.startDate.setMinutes(0);
      this.startDate.setSeconds(0);
      if (this.endDate) {
        this.endDate.setHours(0);
        this.endDate.setMinutes(0);
        this.endDate.setSeconds(0);
      }

    },

    timeToSeconds(timeString) {
      return parseInt(timeString.split(":")[0]) * 60 * 60 + parseInt(timeString.split(":")[1]) * 60;
    },

    fixEndTime() {

      if (moment(this.startDate).format(this.formats.date) === moment(this.endDate).format(this.formats.date) &&
          this.timeToSeconds(this.startTime) > this.timeToSeconds(this.endTime)) {
        this.endTime = "23:59";
      }
    }


  },
  emits: ["event-create"],
  computed: {
    dialogTitle() {
      return this.id ? "Update event" : "Create event"
    },
    saveTitle() {
      return this.id ? "Update" : "Create";
    },
    start: {
      get() {
        console.info('start computed', this.startDate.getTime() + this.timeToSeconds(this.startTime) * 1000);
        return new Date(this.startDate.getTime() + this.timeToSeconds(this.startTime) * 1000);
      },
      cached: false
    },
    end: {
      get() {
        console.info('end computed', this.endDate.getTime() + this.timeToSeconds(this.endTime) * 1000);
        return new Date(this.endDate.getTime() + this.timeToSeconds(this.endTime) * 1000);
      },
      cached: false
    },
  },

  data() {
    return {
      errors: [],
      allDay: false,
      startDate: null,
      endDate: null,
      startTime: '',
      endTime: '',
      description: '',
      editingEvent: null,
      dialogOpen: false,
      id: false
    }
  }
});
</script>


<template>
  <popover-component @close="reset" :title="dialogTitle" ref="popover">

    <div>
      <input type="checkbox" id="from-all-day"
             v-model="allDay"
             class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
      <label for="from-all-day" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">All Day</label>
    </div>

    <div class="grid grid-cols-2 space-x-3">

      <div>
        <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
            allDay ? "Date" : "Start"
          }}</label>
        <date-picker id="start-date"
                     v-model="startDate"
                     :lowerLimit="new Date()"
                     :upperLimit="endDate"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"></date-picker>
      </div>
      <div class="space-y-2">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">&nbsp;</label>
        <input type="time"
               v-show="!allDay"
               v-model="startTime"
               :disabled="allDay"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"/>

      </div>
    </div>

    <div class="grid grid-cols-2 space-x-3" v-show="!allDay">
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">End</label>
        <date-picker id="start-date"
                     v-model="endDate"
                     :lowerLimit="startDate"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"></date-picker>
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">&nbsp;</label>
        <div>
          <input
              type="time"
              @blur="fixEndTime"
              v-model="endTime"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"/>
        </div>
      </div>
    </div>

    <div>
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Description</label>
      <textarea id="description"
                v-model="description"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      ></textarea>
      <error-view v-show="errors.description" :error="errors.description"></error-view>

    </div>
    <div class="flex space-x-4 mt-4 justify-between items-center">
      <div class="flex space-x-4">
        <button type="button"
                @click="$refs.popover.close()"
                class="bg-white-500 hover:bg-white-700 text-gray-900 font-bold py-2 px-4 border border-blue-700 rounded">
          Cancel
        </button>
        <button @click.prevent="saveEvent"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
          {{ saveTitle }}
        </button>
      </div>
      <div v-if="id">
        <button @click.prevent="deleteEvent"
          class="hover:bg-white-700 text-red-600 hover:text-red-800 font-bold py-2 px-4">
          <delete-icon></delete-icon>
        </button>
      </div>
    </div>

  </popover-component>

</template>
<style lang="scss">
.popper {
  transform: none !important;
}
</style>
