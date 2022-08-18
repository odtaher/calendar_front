import moment from "moment";

export default {
    methods: {
        getNearbyEvents(event) {
            let allEventsOrdered = Array.from(this.calendarApi.getEvents());

            allEventsOrdered = allEventsOrdered.filter(ev => !ev.allDay && ev.id !== event.id); // from all day events and same event

            // console.info('allEventsOrdered', allEventsOrdered[0].title, moment(allEventsOrdered[0].start).utc().toDate());
            // console.info('allEventsOrdered', moment(event.start).toDate());

            allEventsOrdered.sort((a, b) =>  // sort by closest to event
                Math.abs(moment(a.start).utc().toDate().getTime() - moment(event.start).toDate().getTime()) - Math.abs(moment(b.start).utc().toDate().getTime() - moment(event.start).toDate().getTime())
            );

            return allEventsOrdered.slice(0, 2);
        },

        eventNotOverlappingWith(stillEvent, movingEvent) {
            // two all-day events can't happen at the same day
            if (stillEvent.allDay && movingEvent.allDay) {
                return false;
            }

            if (stillEvent.allDay || movingEvent.allDay) {
                return true;
            }

            if (movingEvent.start.getTime() < stillEvent.end?.getTime() && movingEvent.end?.getTime() > stillEvent.start.getTime()) {
                return false;
            }

            return true;
        },

        overlappingWithNearbyEvents(eventData) {

            for (let nearbyEvent of this.getNearbyEvents(eventData)) {
                if (!this.eventNotOverlappingWith(nearbyEvent, {
                    start: moment(eventData.start).toDate(),
                    end: moment(eventData.end).toDate(),
                    id: eventData.id,
                    allDay: eventData.all_day
                })) {
                    return true;
                }
            }
            return false;
        },
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