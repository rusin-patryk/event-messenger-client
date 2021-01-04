import Vue from 'vue';
import StorageService from '@/common/StorageService';
import ApiService from '@/common/ApiService';
import store from '@/store/store';
import moment from 'moment';
import {TiptapVuetifyPlugin} from 'tiptap-vuetify';
import LogRocket from 'logrocket';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import 'tiptap-vuetify/dist/main.css';
import 'vuetify/dist/vuetify.min.css';
import './configs/notifications';
import './registerServiceWorker';
import i18n from './i18n';

Vue.config.productionTip = false;

if (StorageService.getUserInfo()) {
  ApiService.setHeader(StorageService.getUserInfo().access_token);
  if (process.env.NODE_ENV === 'production') {
    LogRocket.identify(StorageService.getUserInfo().user.id, {
      id: StorageService.getUserInfo().user.id,
      name: `${StorageService.getUserInfo().user.first_name} ${StorageService.getUserInfo().user.last_name}`,
      first_name: StorageService.getUserInfo().user.first_name,
      last_name: StorageService.getUserInfo().user.last_name,
      email: StorageService.getUserInfo().user.email,
      email_verified_at: StorageService.getUserInfo().user.email_verified_at,
      created_at: StorageService.getUserInfo().user.created_at,
      phone_number: StorageService.getUserInfo().user.phone_number,
      profile_image_path: StorageService.getUserInfo().user.profile_image_path,
      description: StorageService.getUserInfo().user.description,
      company_name: StorageService.getUserInfo().user.company_name,
      is_admin: !!StorageService.getUserInfo().user.is_admin,
    });
  }
} else {
  StorageService.clearCredentials();
}

Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: 'fa',
});

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

Vue.filter('formatDate', (value) => {
  if (value) {
    return moment(String(value)).format('DD.MM.YYYY');
  }
  return '';
});

Vue.filter('formatDateTime', (value) => {
  if (value) {
    return moment(String(value)).format('DD.MM.YYYY - hh:mm a');
  }
  return '';
});
