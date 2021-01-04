<template>
  <div
    :class="{'theme--dark': $vuetify.theme.dark}"
    class="news-feed-box"
  >
    <div class="pl-6 pt-3 pb-3 pr-6 news-feed-title">
      UPDATES
    </div>
    <div
      v-if="data.length > 0"
      :class="{'pb-6': !isAdmin, 'admin': isAdmin}"
      class="pl-6 pr-6 pt-6 news-feed-container"
    >
      <div
        v-for="update in data"
        :key="update.id"
        class="news-feed-element"
      >
        <v-skeleton-loader
          :loading="loading"
          class="pt-4"
          type="paragraph"
        >
          <div class="font-weight-bold">{{ update.created_at | formatDate }}</div>
          <div v-html="update.content"></div>
          <div
            v-if="!!isAdmin"
            class="text-right mb-5"
          >
            <v-btn
              class="mr-3"
              color="red"
              outlined
              small
              @click="askForDelete(update)"
            >
              <span class="mr-1">Delete</span>
              <v-icon size="15">fas fa-trash</v-icon>
            </v-btn>
            <v-btn
              color="base"
              outlined
              small
              @click="editUpdate(update)"
            >
              <span class="mr-1">Edit</span>
              <v-icon size="15">fas fa-edit</v-icon>
            </v-btn>
          </div>
        </v-skeleton-loader>
      </div>
    </div>
    <div
      v-if="!data.length > 0 || !!isAdmin"
      :class="{'pt-6': !data.length > 0}"
      class="pl-6 pr-6 news-feed-container"
    >
      <div
        v-if="!data.length > 0"
        class="pb-6"
      >
        <strong>No updates</strong>
      </div>
      <div
        v-if="!!isAdmin"
        class="text-right"
      >
        <v-btn
          :disabled="loading"
          :loading="loading"
          class="mb-6"
          color="green"
          outlined
          @click="createUpdate"
        >
          <span class="mr-2">Add</span>
          <v-icon size="18">fas fa-plus</v-icon>
        </v-btn>
        <TextEditor
          v-if="createDialog"
          :dialog="createDialog"
          :fields="['wysiwyg']"
          :loading="loading"
          :textLimit="255"
          :title="'Add update'"
          @closeDialog="closeCreateDialog"
        />
        <TextEditor
          v-if="edit.dialog"
          :content="edit.content"
          :data="edit"
          :dialog="edit.dialog"
          :fields="['wysiwyg']"
          :loading="loading"
          :textLimit="255"
          :title="'Edit update'"
          @closeDialog="closeEditDialog"
        />
        <Confirmation
          :id="edit.id"
          :dialog="confirm"
          :loading="loading"
          @closeDialog="deleteUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TextEditor from '@/components/Common/TextEditor';
import Confirmation from '@/components/Common/Confirmation';
import StorageService from '@/common/StorageService';
import NotificationService from '@/common/NotificationService';
import UpdatesService from '@/common/UpdatesService';
import {mapGetters} from 'vuex';

export default {
  name: 'UpdatesList',

  components: {
    TextEditor,
    Confirmation,
  },

  data: () => ({
    isAdmin: false,
    confirm: false,
    dialogs: [],
    loading: false,
    createDialog: false,
    edit: {dialog: false, content: ''},
  }),

  props: {
    data: {
      type: Array,
      default: () => ([]),
    },
  },

  created() {
    this.isAdmin = StorageService.isAdmin();
  },

  computed: {
    ...mapGetters(['getPickedEvent']),
  },

  methods: {
    createUpdate() {
      if (this.createDialog) {
        this.createDialog = false;
      }
      this.$nextTick(() => {
        this.createDialog = true;
      });
    },

    askForDelete(update) {
      this.edit = JSON.parse(JSON.stringify(update));
      if (this.confirm) {
        this.confirm = false;
      }

      this.confirm = true;
    },

    async deleteUpdate(id) {
      if (!id) {
        this.confirm = false;
        return;
      }
      this.loading = true;
      if (!this.getPickedEvent) {
        NotificationService.error('Please refresh page.');
        return;
      }
      try {
        await UpdatesService.deleteUpdate(id);
        this.edit = {dialog: false, content: ''};
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].id === id) {
            this.data.splice(i, 1);
          }
        }
        this.confirm = false;
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    editUpdate(update) {
      this.edit = JSON.parse(JSON.stringify(update));
      if (this.edit.dialog) {
        this.edit.dialog = false;
      }

      this.edit.dialog = true;
    },

    async closeEditDialog(data) {
      if (!data) {
        this.edit.dialog = false;
        return;
      }
      this.loading = true;
      if (!this.getPickedEvent) {
        NotificationService.error('Please refresh page.');
        return;
      }
      try {
        await UpdatesService.editUpdate(data.data.id, {
          content: data.content,
        });
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].id === data.data.id) {
            this.data[i].content = data.content;
          }
        }
        this.loading = false;
        this.edit.dialog = false;
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
      if (!this.getPickedEvent) {
        NotificationService.error('Please refresh page.');
        return;
      }
      try {
        const response = await UpdatesService.createUpdate({
          event_id: this.getPickedEvent,
          content: data.content,
        });
        this.data.unshift(...[{
          id: response.id,
          content: response.content,
          created_at: new Date(),
        }]);
        this.loading = false;
        this.createDialog = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },
  },
};
</script>

<style
  lang="scss"
  scoped
>

</style>
