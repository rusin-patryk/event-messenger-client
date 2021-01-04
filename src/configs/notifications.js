import Vue from 'vue';
import VueAWN from 'vue-awesome-notifications';

const options = {
  position: 'top-right',
  icons: {
    success: ' mdi mdi-check-circle',
    alert: ' mdi mdi-alert-circle',
    info: ' mdi mdi-help-circle',
  },
  durations: {
    global: 4000,
  },
};
Vue.use(VueAWN, options);
