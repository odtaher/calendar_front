<template>
  <dialog-component :ignore-close-for-classes="['dialog', 'new-event']" ref="dialog" class="event-dialog">

    <input @keyup="validate" type="text" placeholder="The task description..." v-model="newEvent.description"/>
    <span class="error" v-if="errors.description">{{ errors.description }}</span>
    <div class="event-details">
      <div>
        <label>Date:</label>
        <datepicker @change="validate" v-model="newEvent.date"></datepicker>
      </div>
      <div class="error" v-if="errors.date">
        <span>{{ errors.date }}</span>
      </div>
      <div>
        <label>From time</label>
        <select @change="validate" v-model="newEvent.from_time">
          <option :key="timeIndex" v-for="timeIndex in 48">{{ $root.helper.timeByIndex(timeIndex) }}</option>
        </select>
      </div>
      <div class="error" v-if="errors.from_time">
        <span>{{ errors.from_time }}</span>
      </div>
      <div>
        <label>To time</label>
        <select @change="validate" v-model="newEvent.to_time">
          <option v-show="showToTime(timeIndex)" :key="timeIndex" v-for="timeIndex in 48">
            {{ $root.helper.timeByIndex(timeIndex) }}
          </option>
        </select>
      </div>
      <div class="error" v-if="errors.to_time">
        <span>{{ errors.to_time }}</span>
      </div>


    </div>
    <div>
      <button :disabled="saveButtonDisabled" @click="save" class="blue">Save</button>
      <button @click="close" class="blue">Cancel</button>
      <div class="error" v-if="errors.server">
        <span>{{ errors.server }}</span>
      </div>
    </div>

  </dialog-component>
</template>

<style lang="scss">

.event-dialog {

  > div.date-and-time {
    display: flex;
    justify-content: space-between;
  }

  > div.event-details {
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    height: 100%;
  }


  > div.event-details > div {
    display: flex;
    justify-content: flex-start;
    width: 100%;

    label {
      width: 20%;
      min-width: 100px;
    }

  }
}

.error {
  text-align: left;
  color: red;

  span {
    color: red;
  }
}

</style>


<script>

import Datepicker from 'vue3-datepicker'
import DialogComponent from "@/dialogs/DialogComponent";

export default {
  name: "event-dialog",
  components: {DialogComponent, Datepicker},
  methods: {
    showToTime(timeIndex) {
      return this.newEvent.from_time?.length && this.$root.helper.eventDuration(this.newEvent.from_time, this.$root.helper.timeByIndex(timeIndex)) > 0;
    },
    open(event, date, time) {
      if (date) {
        this.newEvent.date = new Date(date);
      }
      if (time) {
        this.newEvent.from_time = time;
      }
      this.$refs.dialog.open(event);
    },

    close() {
      this.clear();
      this.$refs.dialog.close();
    },

    clear() {
      this.newEvent = {
        date: null,
        from_time: null,
        to_time: null,
        description: null,
      };
    },
    save() {
      if (this.validate()) {
        this.$emit("newEvent", this.newEvent);
      }
    },
    validate() {
      let valid = true;
      if (!this.newEvent.description?.trim().length) {
        this.errors.description = "Description is required";
        valid = false;
      } else {
        this.errors.description = "";
      }
      if (!this.newEvent.from_time) {
        valid = false;
        this.errors.from_time = "From Time is required";
      } else {
        this.errors.from_time = "";
      }
      if (!this.newEvent.date) {
        valid = false;
        this.errors.date = "Date is required";
      } else {
        this.errors.date = "";
      }
      if (!this.newEvent.to_time) {
        valid = false;
        this.errors.to_time = "To Time is required";
      } else {
        this.errors.to_time = "";
      }
      if (valid && !this.validateTimes()) {
        this.errors.to_time = "To Time has to be later than From Time";
        valid = false;
      }

      this.saveButtonDisabled = !valid;

      return valid;
    },
    validateTimes() {
      const fromHour = parseInt(this.newEvent.from_time.split(":")[0]);
      const toHour = parseInt(this.newEvent.to_time.split(":")[0]);
      if (fromHour > toHour) {
        return false;
      }
      if (fromHour === toHour) {
        const fromMin = parseInt(this.newEvent.from_time.split(":")[1]);
        const toMin = parseInt(this.newEvent.to_time.split(":")[1]);
        return fromMin < toMin;
      }
      return true;

    }
  },

  data() {
    return {
      errors: {},
      newEvent: {
        date: null,
        from_time: null,
        to_time: null,
        description: null,
      },
      saveButtonDisabled: false,
    }
  }
}
</script>

