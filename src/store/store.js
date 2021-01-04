import Vue from 'vue';
import Vuex from 'vuex';
import StorageService from '@/common/StorageService';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    events: [{content: ''}],
    pickedEvent: StorageService.getPickedEvent(),
    triggerEventsReload: false,
    unreadMessages: 0,
  },
  getters: {
    getEvents: state => state.events,
    getPickedEvent: state => state.pickedEvent,
    getTriggerEventsReload: state => state.triggerEventsReload,
    getUnreadMessages: state => state.unreadMessages,
  },
  mutations: {
    events(data, payload) {
      data.events = payload;
    },
    pickedEvent(data, payload) {
      data.pickedEvent = payload;
    },
    triggerEventsReload(data, payload) {
      data.triggerEventsReload = payload;
    },
    unreadMessages(data, payload) {
      data.unreadMessages = payload;
    },
  },
});
