<template>
  <v-row
    class="align-center"
    justify="center"
  >
    <v-col
      class="pl-lg-16 pr-lg-14 pl-sm-10 pr-sm-8 pt-0 pb-4 pb-sm-0"
      cols="12"
      lg="8"
      md="7"
      sm="6"
      xs="12"
    >
      <v-skeleton-loader
        :loading="loading"
        type="paragraph, paragraph, paragraph"
      >
        <div
          :class="{'admin': !!userInfo.user.is_admin}"
          class="dashboard-container pr-lg-2 pr-sm-2"
        >
          Welcome, <strong>{{ userInfo.user.first_name }} {{ userInfo.user.last_name }}</strong>,
          <div
            v-if="event && event.content.length > 0"
            class="pt-3"
            v-html="event.content"
          ></div>
        </div>
        <div v-if="!event || !event.content.length > 0">
          <h1>Thank you for registering your account. You will be assigned to your event within 24 hours.</h1>
        </div>
        <div
          v-if="event && !!userInfo.user.is_admin"
          class="text-right"
        >
          <v-btn
            class="mt-3"
            color="base"
            outlined
            @click="openDialog"
          >
            <span class="mr-2">Edit</span>
            <v-icon size="18">fas fa-edit</v-icon>
          </v-btn>
          <TextEditor
            v-if="dialog"
            :content="event.content"
            :dialog="dialog"
            :fields="['wysiwyg']"
            :loading="loading"
            :textLimit="8000000"
            :title="'Edit home page info'"
            @closeDialog="closeDialog"
          />
        </div>
      </v-skeleton-loader>
    </v-col>
    <v-col
      v-if="event"
      class="pt-0 pb-0"
      cols="12"
      lg="4"
      md="5"
      sm="6"
      xs="12"
    >
      <UpdatesList
        :data="event.statements"
        :loading="loading"
      />
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex';
import TextEditor from '@/components/Common/TextEditor';
import StorageService from '@/common/StorageService';
import EventsService from '@/common/EventsService';
import NotificationService from '@/common/NotificationService';
import UpdatesList from '../../components/Dashboard/UpdatesList';

export default {
  name: 'Dashboard',

  components: {
    UpdatesList,
    TextEditor,
  },

  data: () => ({
    event: {content: '', statements: []},
    dialog: false,
    loading: true,
    userInfo: {},
  }),

  watch: {
    getPickedEvent() {
      this.refreshEvent();
    },
    getEvents() {
      this.refreshEvent();
    },
  },

  computed: {
    ...mapGetters(['getEvents', 'getPickedEvent']),
  },

  created() {
    this.userInfo = StorageService.getUserInfo();
  },

  mounted() {
    this.refreshEvent();
  },

  methods: {
    async updateEvent(content) {
      this.loading = true;
      if (!this.getPickedEvent) {
        NotificationService.error('Please refresh page.');
        return;
      }
      try {
        await EventsService.updateEvent(this.getPickedEvent, {
          title: this.event.title,
          content: content,
        });
        this.event.content = content;
        this.dialog = false;
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    findEventById(element) {
      return element.id === this.getPickedEvent;
    },

    refreshEvent() {
      this.loading = true;
      this.event = this.getEvents.find(this.findEventById);
      if (!this.event) {
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      } else {
        this.loading = false;
        this.event.statements.forEach((element) => {
          element.dialog = false;
        });
      }
    },

    openDialog() {
      if (this.dialog) {
        this.dialog = false;
      }
      this.$nextTick(() => {
        this.dialog = true;
      });
    },

    closeDialog(obj) {
      if (obj.content) {
        this.updateEvent(obj.content);
      } else this.dialog = false;
    },
  },
};
</script>
