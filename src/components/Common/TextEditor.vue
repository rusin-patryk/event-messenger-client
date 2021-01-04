<template>
  <v-dialog
    v-model="dialogStatus"
    :persistent="persistent"
    max-width="1170px"
  >
    <v-card>
      <v-card-text class="pt-3 pa-0 text-editor">
        <div class="pl-5 pt-1 pr-5 pb-2 d-flex justify-space-between dialog-title-bar">
          <h2>{{ title }}</h2>
          <v-btn
            class="dialog-close"
            color="base"
            fab
            text
            x-small
            @click="closeDialog"
          >
            <v-icon>fas fa-times</v-icon>
          </v-btn>
        </div>
        <div class="pl-5 pr-5 pb-3">
          <v-text-field
            v-if="isEnabled('name')"
            v-model="editedName"
            class="pt-4"
            filled
            label="Name"
            @change="persistent = true"
          ></v-text-field>
          <v-menu
            v-if="isEnabled('date')"
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            min-width="290px"
            offset-y
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="editedDate"
                v-bind="attrs"
                v-on="on"
                filled
                label="Date"
                prepend-inner-icon="fas fa-calendar-alt"
                readonly
                @change="persistent = true"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              color="base"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="menu = false"
              >Cancel
              </v-btn>
              <v-btn
                color="primary"
                @click="$refs.menu.save(date)"
              >OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <tiptap-vuetify
            v-if="isEnabled('wysiwyg')"
            v-model="editedContent"
            :extensions="extensions"
            class="pt-4"
          />
          <div
            v-if="isEnabled('wysiwyg') && textLimit"
            :class="{'invalid': editedContent.length > textLimit}"
            class="text-right pb-1"
            style="font-size: 12px;"
          >
            <small>HINT: Pictures can be very large in size. Add files with <strong>low resolution</strong> and <strong>.jpg</strong>
                   extension.</small>
            <span class="mr-1 ml-1">|</span>
            <span v-if="textLimit <= 50000">Characters: {{ editedContent.length }} / {{ textLimit }}</span>
            <span v-if="textLimit > 50000">Allowed size: ~ {{ Math.floor(editedContent.length / 10) / 100 }}
              /
              {{ Math.floor(textLimit / 10) / 100 }} kB</span>
          </div>
          <v-file-input
            v-if="isEnabled('file')"
            v-model="editedFile"
            :rules="sizeRule"
            accept="image/*, video/*, audio/*, .pdf, .doc, .docx, .zip, .tar, .gz, .svg, .rar, .txt, .xls, .xlsm, .7z, .ttf, .otf, .html, .ppt, .pptx"
            class="pt-4"
            counter
            filled
            label="File"
            prepend-inset-icon="fas fa-file-upload"
            show-size
            @change="persistent = true"
          ></v-file-input>
          <v-card-actions class="pl-0 pr-0 mt-2 dialog-footer-bar">
            <v-spacer></v-spacer>
            <v-btn
              :disabled="loading"
              :loading="loading"
              class="primary w-100"
              large
              @click="save"
            >SAVE
            </v-btn>
          </v-card-actions>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  HardBreak,
  Heading,
  History,
  HorizontalRule,
  Image,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Paragraph,
  Strike,
  TiptapVuetify,
  Underline,
} from 'tiptap-vuetify';
import NotificationService from '@/common/NotificationService';

export default {
  name: 'TextEditor',

  components: {
    TiptapVuetify,
  },

  data: () => ({
    dialogStatus: null,
    persistent: false,
    menu: false,
    editedName: '',
    editedDate: '',
    editedContent: '',
    editedFile: '',
    sizeRule: [
      v => !v || v.size < 16000100 || 'File size should be less than 16 MB!',
    ],
    extensions: [
      History,
      Paragraph,
      [Heading, {
        options: {
          levels: [1, 2, 3, 4],
        },
      }],
      Bold,
      Italic,
      Underline,
      Strike,
      Image,
      ListItem,
      BulletList,
      OrderedList,
      Blockquote,
      Link,
      Code,
      HorizontalRule,
      HardBreak,
    ],
  }),

  props: {
    dialog: Boolean,
    loading: {
      type: Boolean,
      default: () => false,
    },
    textLimit: {
      type: Number,
      default: () => (6000),
    },
    fields: {
      type: Array,
      default: () => ([]),
    },
    name: {
      type: String,
      default: () => (''),
    },
    date: {
      type: String,
      default: () => (''),
    },
    content: {
      type: String,
      default: () => (''),
    },
    file: {
      default: () => null,
    },
    title: {
      type: String,
      default: () => ('Text editor'),
    },
    data: {
      default: () => null,
    },
  },

  watch: {
    dialog: {
      handler(val) {
        this.dialogStatus = val;
        if (!val) {
          this.closeDialog();
        }
        this.persistent = false;
      },
      immediate: true,
    },
    editedContent: {
      handler() {
        this.persistent = true;
      },
      immediate: true,
    },
  },

  created() {
    this.parseData();
  },

  methods: {
    parseData() {
      this.editedName = this.name;
      this.editedDate = this.date;
      this.editedContent = this.content;
      this.editedFile = this.file;
    },

    closeDialog() {
      this.$emit('closeDialog', false);
    },

    save() {
      if (this.textLimit && this.editedContent.length > this.textLimit) {
        NotificationService.error('The number of characters exceeds the limit.');
        return;
      }
      const obj = {};
      if (this.isEnabled('name') && this.editedName) {
        obj.name = this.editedName;
      } else if (this.isEnabled('name')) {
        NotificationService.error('"Name" field is required.');
        return;
      }

      if (this.isEnabled('date') && this.editedDate) {
        obj.date = this.editedDate;
      } else if (this.isEnabled('date')) {
        NotificationService.error('"Date" field is required.');
        return;
      }

      if (this.isEnabled('wysiwyg') && this.editedContent) {
        obj.content = this.editedContent;
      } else if (this.isEnabled('content')) {
        NotificationService.error('"Content" field is required.');
        return;
      }

      if (this.isEnabled('file') && this.editedFile) {
        const formData = new FormData();
        formData.append('file', this.editedFile, this.editedFile.name);
        obj.file = formData;
      } else if (this.isEnabled('file')) {
        NotificationService.error('"File" field is required.');
        return;
      }

      if (this.data) {
        obj.data = this.data;
      }

      this.$emit('closeDialog', obj);
    },

    isEnabled(check) {
      return this.fields.find((element) => {
        return element === check;
      });
    },
  },
};
</script>
