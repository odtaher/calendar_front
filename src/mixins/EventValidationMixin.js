export default {
    methods: {
        validateEvent(event) {
            let ret = true;
            if (event.start < new Date()) { // can't create past events
                this.errors.general_error = "Can't create events in the past";
                ret = false;
            }

            if (!event.allDay && event.start > this.end) { // can't create past events
                this.errors.general_error = "End time can't be later than start time";
                ret = false;
            }

            if (event.description.trim().length === 0) {
                this.errors.description = "Description is required";
                ret = false;
            }
            return ret;
        }
    },
    data() {
        return {
            errors: {}
        }
    }
}