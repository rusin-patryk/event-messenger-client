import Vue from 'vue';
import ApiService from '@/common/ApiService';
import StorageService from '@/common/StorageService';
import Constants from './Constants';
import router from '../router';

class NotificationService {
  static success(message) {
    Vue.prototype.$awn.success(message, {labels: {success: 'Success'}});
  }

  static info(message) {
    Vue.prototype.$awn.info(message, {labels: {info: 'Info'}});
  }

  static error(message) {
    if (typeof message.response !== 'undefined') {
      if (message.response && message.response.status === 401 && !router.history.current.meta.public) {
        Vue.prototype.$awn.alert(Constants('UNAUTHORIZED'), {labels: {alert: 'Error'}});
        ApiService.removeHeader();
        StorageService.clearCredentials();
        router.push({name: 'Login'});
      } else if (message.response && message.response.status === 401) {
        Vue.prototype.$awn.alert(Constants('UNAUTHORIZED'), {labels: {alert: 'Error'}});
      } else if (message.response && message.response.data && !message.response.data.message) {
        const error = typeof message.response.data === 'string' ? {Code: 'UNEXPECTED_ERROR'} : message.response.data;
        Vue.prototype.$awn.alert(Constants(error.Code), {labels: {alert: 'Error'}});
      } else if (message.response && message.response.data.message) {
        Vue.prototype.$awn.alert(message.response.data.message, {labels: {alert: 'Error'}});
      }
    } else if (typeof message === 'string') {
      Vue.prototype.$awn.alert(message, {labels: {alert: 'Error'}});
    } else if (Array.isArray(message) && message.length > 0) {
      Vue.prototype.$awn.alert(message[0], {labels: {alert: 'Error'}});
    } else if (message && message.content && Array.isArray(message.content) && message.content.length > 0) {
      Vue.prototype.$awn.alert(message.content[0], {labels: {alert: 'Error'}});
    } else if (message && message.content) {
      Vue.prototype.$awn.alert(message.content, {labels: {alert: 'Error'}});
    } else {
      Vue.prototype.$awn.alert(Constants('There is a technical break, please try again later.'), {labels: {alert: 'Error'}});
    }
  }

  static warning(message) {
    Vue.prototype.$awn.warning(message, {labels: {warning: 'Warning'}});
  }
}

export default NotificationService;
