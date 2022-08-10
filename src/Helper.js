import moment from "moment";

/**
 * A Helper class
 * contains functions for formatting and data conversion
 */

class Helper {


    /**
     * Converts an index (from 0 to 48) to 00:00 to 24:00
     * @param index number
     * @returns {string}
     */
    timeByIndex(index) {
        index--;
        let hour = Math.floor(index / 2);
        hour = this.intWithLeadingZero(hour);

        if (index % 2 === 1) { // add half an hour
            return `${hour}:30`;
        }
        return `${hour}:00`;
    }

    /**
     *
     * @param value number
     * @returns {*|string}
     */
    intWithLeadingZero(value) {
        return value > 9 ? value : "0" + value;
    }

    /**
     *
     * @param fromTime string time in HH:MM format
     * @param toTime string time in HH:MM format
     * @returns {number}
     */
    eventDuration(fromTime, toTime) {
        const fromDT = new Date();
        fromDT.setMinutes(parseInt(fromTime.split(":")[1]));
        fromDT.setHours(parseInt(fromTime.split(":")[0]));

        const toDT = new Date();
        toDT.setMinutes(parseInt(toTime.split(":")[1]));
        toDT.setHours(parseInt(toTime.split(":")[0]));

        return Math.floor((toDT.getTime() - fromDT.getTime()) / 1000 / 60);
    }

    /**
     * @param dict object
     * @returns {string}
     */
    dictionaryToPostData(dict) {
        return Object.keys(dict).map(k => {
            return `${k}=${dict[k]}`;
        }).join("&");
    }


    formatDayOfMonth(sourceDate, day) {
        const date = new Date(sourceDate);
        date.setDate(date.getDate() + day);
        return moment(date).format("YYYY-MM-DD");
    }

    shortDateByDay(sourceDate, day) {
        let date = moment(this.formatDayOfMonth(sourceDate, day)).toDate();
        return date.toLocaleDateString("he-il", {month: "numeric", day: "numeric"});
    }


    dateFromString(date, time) {
        const dateSplits = date.split("-");
        const timeSplits = time.split(":");

        return new Date(dateSplits[0], parseInt(dateSplits[1]) - 1, dateSplits[2], timeSplits[0], timeSplits[1]);
    }
}

export default Helper;