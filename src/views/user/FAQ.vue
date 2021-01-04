<template>
  <v-row
    class="align-center"
    justify="center"
  >
    <v-col
      class="pl-lg-16 pr-lg-16 pl-sm-10 pr-sm-10"
      cols="12"
      lg="8"
      md="7"
      sm="6"
      xs="12"
    >
      <v-skeleton-loader
        :loading="loading"
        type="text, paragraph, text, paragraph, text, paragraph"
      >
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="mb-4"
        >
          <strong>{{ faq.title }}</strong>
          <div v-html="faq.content"></div>
          <div
            v-if="!!isAdmin"
            class="text-right mb-5"
          >
            <v-btn
              class="mr-3"
              color="red"
              outlined
              small
              @click="askForDelete(faq)"
            >
              <span class="mr-1">Delete</span>
              <v-icon size="15">fas fa-trash</v-icon>
            </v-btn>
            <v-btn
              color="base"
              outlined
              small
              @click="editFaq(faq)"
            >
              <span class="mr-1">Edit</span>
              <v-icon size="15">fas fa-edit</v-icon>
            </v-btn>
          </div>
        </div>
        <div v-if="!faqs.length > 0">
          <h1>FAQs list is empty.</h1>
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
            @click="createFaq"
          >
            <span class="mr-2">Add</span>
            <v-icon size="18">fas fa-plus</v-icon>
          </v-btn>
          <TextEditor
            v-if="createDialog"
            :dialog="createDialog"
            :fields="['name', 'wysiwyg']"
            :loading="loading"
            :textLimit="4000000"
            :title="'Add FAQ'"
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
            :textLimit="4000000"
            :title="'Edit FAQ'"
            @closeDialog="closeEditDialog"
          />
          <Confirmation
            :id="edit.id"
            :dialog="confirm"
            :loading="loading"
            @closeDialog="deleteFaq"
          />
        </div>
      </v-skeleton-loader>
    </v-col>
    <v-col
      lg="4"
      md="5"
      sm="6"
      xs="12"
    ></v-col>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex';
import TextEditor from '@/components/Common/TextEditor';
import Confirmation from '@/components/Common/Confirmation';
import EventsService from '@/common/EventsService';
import NotificationService from '@/common/NotificationService';
import StorageService from '@/common/StorageService';
import FaqsService from '@/common/FaqsService';

export default {
  name: 'FAQ',

  data: () => ({
    faqs: [],
    loading: true,
    isAdmin: false,
    edit: {dialog: false, content: '', name: ''},
    createDialog: false,
    confirm: false,
  }),

  components: {
    TextEditor,
    Confirmation,
  },

  mounted() {
    this.getFaqs();
  },

  watch: {
    getPickedEvent() {
      this.getFaqs();
    },
  },

  computed: {
    ...mapGetters(['getPickedEvent']),
  },

  created() {
    this.isAdmin = StorageService.isAdmin();
  },

  methods: {
    async getFaqs() {
      this.loading = true;
      if (!this.getPickedEvent) {
        this.loadingWait();
        return;
      }
      try {
        this.faqs = await EventsService.getFaqs({
          event_id: this.getPickedEvent,
          sortBy: 'title',
          orderBy: 'asc',
          elementsNumber: 20,
          pageNumber: 1,
        });
        this.loading = false;
        this.faqs.forEach((element) => {
          element.dialog = false;
        });
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    loadingWait() {
      setTimeout(() => {
        this.loading = false;
      }, 4000);
    },

    createFaq() {
      if (this.createDialog) {
        this.createDialog = false;
      }
      this.$nextTick(() => {
        this.createDialog = true;
      });
    },

    askForDelete(faq) {
      this.edit = JSON.parse(JSON.stringify(faq));
      if (this.confirm) {
        this.confirm = false;
      }

      this.confirm = true;
    },

    async deleteFaq(id) {
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
        await FaqsService.deleteFaq(id);
        this.edit = {dialog: false, content: ''};
        for (let i = 0; i < this.faqs.length; i++) {
          if (this.faqs[i].id === id) {
            this.faqs.splice(i, 1);
          }
        }
        this.confirm = false;
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    editFaq(update) {
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
        await FaqsService.editFaq(data.data.id, {
          title: data.name,
          content: data.content,
        });
        for (let i = 0; i < this.faqs.length; i++) {
          if (this.faqs[i].id === data.data.id) {
            this.faqs[i].title = data.name;
            this.faqs[i].content = data.content;
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
        const response = await FaqsService.createFaq({
          event_id: this.getPickedEvent,
          title: data.name,
          content: data.content,
        });
        this.faqs.push({
          id: response.id,
          title: response.title,
          content: response.content,
          created_at: new Date(),
        });
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
