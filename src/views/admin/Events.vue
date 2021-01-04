<template>
  <v-row
    class="align-center"
    justify="center"
  >
    <v-col
      class="pl-lg-16 pr-lg-16 pl-sm-10 pr-sm-10"
      cols="12"
      xs="12"
    >
      <v-skeleton-loader
        :loading="loading"
        type="table"
      >
        <v-data-table
          :headers="headers"
          :items="events"
          :sort-desc="true"
          class="elevation-1"
          sort-by="created_at"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Events list</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="loading"
                :loading="loading"
                class="mb-2"
                color="base"
                dark
                @click.stop="createEvent"
              >New event
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.content="{ item }">
            <span v-if="item.content.length <= 50000">Characters: {{ item.content.length }}</span>
            <span v-if="item.content.length > 50000">Allowed size: ~ {{
                Math.floor(item.content.length / 10) / 100
                                                     }}</span>
          </template>
          <template v-slot:item.statements="{ item }">
            {{ item.statements.length }}
          </template>
          <template v-slot:item.created_at="{ item }">
            {{ item.created_at | formatDateTime }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              color="red darken-2"
              icon
              @click.stop="askForDelete(item.id)"
            >
              <v-icon size="18">
                fas fa-trash
              </v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              color="base"
              icon
              @click.stop="editEvent(item)"
            >
              <v-icon size="18">
                fas fa-edit
              </v-icon>
            </v-btn>
          </template>
          <template v-slot:no-data>
            No data
          </template>
        </v-data-table>
      </v-skeleton-loader>
      <TextEditor
        v-if="createDialog"
        :dialog="createDialog"
        :fields="['name', 'wysiwyg']"
        :loading="loading"
        :textLimit="6000"
        :title="'Create event'"
        @closeDialog="closeCreateDialog"
      />
      <TextEditor
        v-if="edit.dialog"
        :content="edit.content"
        :data="edit"
        :dialog="edit.dialog"
        :fields="['name', 'wysiwyg']"
        :loading="loading"
        :name="edit.title"
        :textLimit="6000"
        :title="'Edit event'"
        @closeDialog="closeEditDialog"
      />
      <Confirmation
        :id="deleteId"
        :dialog="confirm"
        :loading="loading"
        @closeDialog="deleteEvent"
      />
    </v-col>
  </v-row>
</template>

<script>
import store from '@/store/store';
import TextEditor from '@/components/Common/TextEditor';
import Confirmation from '@/components/Common/Confirmation';
import EventsService from '@/common/EventsService';
import NotificationService from '@/common/NotificationService';

export default {
  name: 'Events',

  data: () => ({
    events: [],
    loading: true,
    edit: {dialog: false, content: '', name: ''},
    createDialog: false,
    deleteId: null,
    confirm: false,
    headers: [
      {
        text: 'Name', value: 'title',
      }, {
        text: 'Dashboard content', value: 'content', sortable: false,
      }, {
        text: 'Updates', value: 'statements',
      }, {
        text: 'Created at', value: 'created_at',
      }, {
        text: 'Actions', value: 'actions', sortable: false, align: 'end',
      },
    ],
  }),

  components: {
    TextEditor,
    Confirmation,
  },

  mounted() {
    this.getEvents();
  },

  methods: {
    async getEvents() {
      this.loading = true;
      try {
        this.events = await EventsService.getAllEvents({
          sortBy: 'created_at',
          orderBy: 'desc',
        });
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    createEvent() {
      if (this.createDialog) {
        this.createDialog = false;
      }
      this.createDialog = true;
    },

    askForDelete(id) {
      this.deleteId = JSON.parse(JSON.stringify(id));
      if (this.confirm) {
        this.confirm = false;
      }

      this.confirm = true;
    },

    async deleteEvent(id) {
      this.deleteId = null;
      if (!id) {
        this.confirm = false;
        return;
      }
      this.loading = true;
      try {
        await EventsService.deleteEvent(id);
        await this.getEvents();
        store.commit('triggerEventsReload', true);
        this.edit = {dialog: false, content: '', name: ''};
        this.confirm = false;
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    editEvent(event) {
      this.edit = JSON.parse(JSON.stringify(event));
      if (this.edit.dialog) {
        this.edit.dialog = false;
      }

      this.edit.dialog = true;
    },

    async closeEditDialog(data) {
      if (!data) {
        this.edit = {dialog: false, content: '', name: ''};
        return;
      }
      this.loading = true;
      try {
        await EventsService.updateEvent(data.data.id, {
          title: data.name,
          content: data.content,
        });
        await this.getEvents();
        store.commit('triggerEventsReload', true);
        this.edit = {dialog: false, content: '', name: ''};
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    async closeCreateDialog(data) {
      if (!data) {
        this.createDialog = false;
        return;
      }
      this.loading = true;
      try {
        await EventsService.createEvent({
          title: data.name,
          content: data.content,
        });
        await this.getEvents();
        store.commit('triggerEventsReload', true);
        this.createDialog = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },
  },
};
</script>
