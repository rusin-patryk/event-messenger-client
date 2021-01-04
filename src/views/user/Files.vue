<template>
  <div class="w-100">
    <v-row
      v-if="files.length > 0"
      class="pl-lg-16 pr-lg-16 pl-sm-10 pr-sm-10 align-right"
      justify="center"
    >
      <SubheaderFilter
        :sortAZ="sortAZ"
        @changeStatus="(status) => {this.sortAZ = status}"
      />
      <v-col
        v-for="(file, index) in sortedFiles(files)"
        :key="index"
        class="pa-4"
        cols="12"
        md="4"
        sm="6"
        xl="3"
        xs="6"
      >
        <v-skeleton-loader
          :loading="loading"
          class="mx-auto"
          style="z-index: 2"
          type="card"
        >
          <v-card
            class="mx-auto file-box"
            flat
          >
            <v-card-subtitle>
              {{ file.created_at | formatDate }}
            </v-card-subtitle>
            <v-card-title class="font-weight-regular">
              {{ file.name }}
            </v-card-title>

            <v-card-actions>
              <v-btn
                :disabled="fileDownloading"
                :loading="fileDownloading"
                class="font-weight-bold"
                color="mainDarkBlue"
                download
                text
                @click="downloadFile(file.id, file.name)"
              >
                <v-icon
                  class="mr-3"
                  color="#25E2AA"
                >fas fa-download
                </v-icon>
                Download
              </v-btn>
              <v-btn
                v-if="isAdmin"
                color="red"
                outlined
                small
                @click="askForDelete(file)"
              >
                <v-icon size="15">fas fa-trash</v-icon>
              </v-btn>
            </v-card-actions>

            <div class="file-hover d-flex flex-column justify-end">
              <div
                class="pa-3"
                v-html="file.content"
              >
              </div>

              <v-card-actions>
                <v-btn
                  :disabled="fileDownloading && file.loading"
                  :loading="fileDownloading && file.loading"
                  class="font-weight-bold mt-1"
                  color="mainDarkBlue"
                  download
                  text
                  @click="downloadFile(file)"
                >
                  <v-icon color="#25E2AA">fas fa-download</v-icon>
                  Download
                </v-btn>
                <v-btn
                  v-if="isAdmin"
                  class="ml-2"
                  color="red"
                  outlined
                  small
                  @click="askForDelete(file)"
                >
                  <v-icon size="15">fas fa-trash</v-icon>
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-row
      v-if="!files.length > 0"
      class="pl-lg-16 pr-lg-16 pl-sm-10 pr-sm-10 align-right"
      justify="center"
    >
      <v-col
        class="pa-4"
        cols="12"
      >
        <h1>File list is empty.</h1>
      </v-col>
    </v-row>
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
        @click="createFile"
      >
        <span class="mr-2">Add</span>
        <v-icon size="18">fas fa-plus</v-icon>
      </v-btn>
      <TextEditor
        v-if="createDialog"
        :dialog="createDialog"
        :fields="['file', 'wysiwyg']"
        :loading="loading"
        :textLimit="255"
        :title="'Upload file'"
        @closeDialog="closeCreateDialog"
      />
      <Confirmation
        :id="edit.id"
        :dialog="confirm"
        :loading="loading"
        @closeDialog="deleteFile"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Confirmation from '@/components/Common/Confirmation';
import TextEditor from '@/components/Common/TextEditor';
import NotificationService from '@/common/NotificationService';
import FilesService from '@/common/FilesService';
import StorageService from '@/common/StorageService';
import SubheaderFilter from '@/components/Common/SubheaderFilter';

export default {
  name: 'Files',

  data: () => ({
    files: [],
    loading: true,
    fileDownloading: false,
    createDialog: false,
    edit: {dialog: false, content: '', file: null},
    confirm: false,
    isAdmin: false,
    sortAZ: false,
  }),

  components: {
    TextEditor,
    Confirmation,
    SubheaderFilter
  },

  watch: {
    getPickedEvent() {
      this.refreshFiles();
    },
  },

  computed: {
    ...mapGetters(['getPickedEvent']),
  },

  beforeMount() {
    for (let i = 0; i < 4; i++) {
      this.files.push(
        {
          id: i++, created_at: '', name: '', content: '', size: 0, path: '',
        },
      );
    }
  },

  mounted() {
    this.refreshFiles();
  },

  created() {
    this.isAdmin = StorageService.isAdmin();
  },

  methods: {
    async refreshFiles() {
      this.loading = true;
      if (!this.getPickedEvent) {
        this.files = [];
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      } else {
        try {
          const response = await FilesService.getFiles({
            event_id: this.getPickedEvent,
            sortBy: 'created_at',
            orderBy: 'desc',
            elementsNumber: 64,
            pageNumber: 1,
          });
          this.files = response.data;
          this.loading = false;
        } catch (e) {
          NotificationService.error(e);
          this.loading = false;
        }
      }
    },

    sortedFiles() {
      const files = JSON.parse(JSON.stringify(this.files));

      if (!this.sortAZ) {
        return this.files;
      }

      return files.sort((a, b) => {
        const textA = a.name.toUpperCase();
        const textB = b.name.toUpperCase();
        if (textA < textB) {
          return -1;
        } else if (textA > textB) {
          return 1;
        } else {
          return 0;
        }
      });
    },

    createFile() {
      if (this.createDialog) {
        this.createDialog = false;
      }
      this.$nextTick(() => {
        this.createDialog = true;
      });
    },

    askForDelete(file) {
      this.edit = JSON.parse(JSON.stringify(file));
      if (this.confirm) {
        this.confirm = false;
      }
      this.$nextTick(() => {
        this.confirm = true;
      });
    },

    async deleteFile(id) {
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
        await FilesService.deleteFile(id);
        this.edit = {dialog: false, content: ''};
        for (let i = 0; i < this.files.length; i++) {
          if (this.files[i].id === id) {
            this.files.splice(i, 1);
          }
        }
        this.confirm = false;
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    async downloadFile(file) {
      file.loading = true;
      this.fileDownloading = true;
      try {
        const response = await FilesService.downloadFile(file.id, file.name);
        const blob = new Blob([response.data], {type: response.headers['content-type']});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        this.fileDownloading = false;
        file.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.fileDownloading = false;
        file.loading = false;
      }
    },

    async closeCreateDialog(data) {
      if (!data) {
        this.createDialog = false;
        return;
      }
      if (data.file) {
        data.file.append('content', data.content);
        data.file.append('event_id', this.getPickedEvent);
      }
      const formData = data.file;
      this.loading = true;
      if (!this.getPickedEvent) {
        NotificationService.error('Please refresh page.');
        return;
      }
      try {
        const response = await FilesService.createFile(formData);
        this.files.unshift(...[{
          id: response.data.id,
          content: response.data.content,
          event_id: response.data.event_id,
          name: response.data.name,
          path: response.data.path,
          created_at: response.data.created_at,
          size: response.data.size,
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
