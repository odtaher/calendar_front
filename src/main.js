import {createApp} from 'vue';
import App from './App.vue';

import EventValidationMixin from '@/mixins/EventValidationMixin'
import FormatsMixin from '@/mixins/FormatsMixin'
import MobileBrowserMixin from '@/mixins/MobileBrowserMixin'

const app = createApp(App);

app.mixin(EventValidationMixin);
app.mixin(MobileBrowserMixin);
app.mixin(FormatsMixin);
app.mixin({
    computed: {
        calendarApi() {
            return this.$root.$refs.eventsCalendar.$refs.fullCalendar.getApi();
        }
    }
})

app.mount('#app');