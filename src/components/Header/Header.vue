<template>
  <v-app-bar
    app
    color="mainLightGrey"
    flat
    height="80"
  >
    <div class="d-flex justify-space-between w-100">
      <div class="hide-on-mobile mt-1">
        <v-app-bar-nav-icon
          class="ml-1"
          color="mainDarkBlue"
          @click.stop="handleSidebarStatus"
        ></v-app-bar-nav-icon>
        <v-btn
          class="menu-text-button"
          color="mainDarkBlue"
          medium
          text
          @click.stop="handleSidebarStatus"
        >
          MENU
        </v-btn>
      </div>

      <div class="show-on-mobile mt-1">
        <v-app-bar-nav-icon
          class="ml-1"
          color="mainDarkBlue"
          @click.stop="drawerChange"
        ></v-app-bar-nav-icon>
        <v-btn
          class="menu-text-button"
          color="mainDarkBlue"
          medium
          text
          @click.stop="drawerChange"
        >
          MENU
        </v-btn>
      </div>
      <div class="d-flex align-center event-picker-container">
        <div class="font-weight-medium d-flex flex-row">
          <div>EVENT:</div>
          <Badge
            :badge-value="1"
            :dense="true"
            :events="events"
          />
        </div>
        <v-select
          v-model="pickedEvent"
          :disabled="loading"
          :items="events"
          :loading="loading"
          class="font-weight-bold event-picker"
          color="#25E2AA"
          flat
          item-text="title"
          item-value="id"
          label="PICK EVENT"
          required
          solo
          @change="pickEvent"
        >
          <template v-slot:item="{ item }">
            <div class="d-flex flex-row justify-space-between w-100">
              <div class="item">{{ item.title }}</div>
              <Badge :badge-value="item.new_messages" />
            </div>
          </template>
        </v-select>
      </div>
      <Avatar
        :user-info="userInfo"
        @openDialog="openDialog"
      />
    </div>
    <UserDialog
      :dialog="dialog"
      :persistent="persistent"
      :user-info="userInfo"
      @closeDialog="closeDialog"
      @refreshData="refreshData"
    />
  </v-app-bar>
</template>

<script>
import {mapGetters} from 'vuex';
import store from '@/store/store';
import EventsService from '@/common/EventsService';
import NotificationService from '@/common/NotificationService';
import StorageService from '@/common/StorageService';
import Avatar from './Avatar';
import UserDialog from './UserDialog/UserDialog';
import Badge from '../Common/Badge';

export default {
  name: 'Header',
  data: () => ({
    drawer: null,
    dialog: false,
    sidebarStatus: null,
    interval: null,
    events: [],
    loading: true,
    pickedEvent: null,
    userInfo: {},
    persistent: false,
  }),
  components: {
    Avatar,
    UserDialog,
    Badge,
  },

  props: {
    sidebarOpen: Boolean,
  },

  computed: {
    ...mapGetters(['getTriggerEventsReload']),
  },

  watch: {
    getTriggerEventsReload: {
      handler() {
        this.getEvents();
        store.commit('triggerEventsReload', false);
      },
      immediate: true,
    },
  },

  created() {
    this.userInfo = StorageService.getUserInfo();
    this.persistent = !(this.userInfo.email && this.userInfo.user.first_name && this.userInfo.user.last_name && this.userInfo.user.phone_number && this.userInfo.user.description && this.userInfo.user.company_name);
  },

  mounted() {
    this.sidebarStatus = this.sidebarOpen;
    this.interval = setInterval(() => {
      if (!this.loading) {
        this.getEvents(true);
      }
    }, 15000);
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  methods: {
    async getEvents(noLoading) {
      if (!noLoading) {
        this.loading = true;
      }
      try {
        this.events = await EventsService.getUserEvents({
          sortBy: 'title',
          orderBy: 'asc',
        });
        store.commit('events', this.events);
        this.checkAndPickEvent();
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },
    refreshData() {
      this.userInfo = {};
      this.userInfo = StorageService.getUserInfo();
    },
    checkAndPickEvent() {
      const pickedEvent = typeof this.events.find(this.findEventById) === 'undefined' ? false : this.events.find(this.findEventById);
      if (pickedEvent) this.pickedEvent = pickedEvent.id;
      if (!this.pickedEvent && this.events.length > 0) {
        this.pickedEvent = this.events[0].id;
      }
      this.pickEvent(this.pickedEvent);
    },
    pickEvent(eventId) {
      if (!eventId) {
        return;
      }
      StorageService.pickEvent(eventId);
      store.commit('pickedEvent', eventId);
      const newMessages = this.events.find((element) => {
        return element.id === eventId;
      });
      store.commit('unreadMessages', newMessages.new_messages);
    },
    findEventById(element) {
      const eventId = StorageService.getPickedEvent() || null;
      return element.id === eventId;
    },
    handleSidebarStatus() {
      this.sidebarStatus = !this.sidebarStatus;
      localStorage.setItem('sidebarOpen', this.sidebarStatus.toString());
      this.$emit('handleSidebarStatus', this.sidebarStatus);
    },

    drawerChange() {
      this.drawer = true;
      this.$emit('drawerChange', this.drawer);
    },

    openDialog() {
      if (this.dialog) {
        this.dialog = false;
      }
      this.$nextTick(() => {
        this.dialog = true;
      });
    },

    closeDialog() {
      this.dialog = false;
    },
  },
};
</script>
