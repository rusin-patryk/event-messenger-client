<template>
  <v-dialog
    v-model="dialogStatus"
    :persistent="persistent"
    max-width="600px"
  >
    <v-card>
      <v-card-text class="pa-0">
        <div
          class="pt-4 pl-5 pr-5 pb-3 d-flex justify-space-between"
          style="line-height: 32px;"
        >
          <h2>Assign user {{ userName }} to events</h2>
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
        <div class="pt-5 pl-5 pr-5 pb-5">
          <v-select
            v-model="newSelectedEvents"
            :chips="true"
            :deletable-chips="true"
            :disabled="loading"
            :items="events"
            :loading="loading"
            :multiple="true"
            hint="Click outside the event list to close the pop-up selection box."
            persistent-hint
            dense
            :menu-props="{'maxHeight': 160 }"
            class="pb-10"
            item-text="title"
            item-value="id"
            label="Pick events to user"
            @change="persistent = true"
          ></v-select>
          <v-card-actions class="pl-0 pr-0 pt-15">
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
export default {
  name: 'AssignUser',

  data: () => ({
    dialogStatus: null,
    newSelectedEvents: [],
    persistent: true,
    userName: '',
  }),

  props: {
    dialog: Boolean,
    loading: {
      type: Boolean,
      default: () => false,
    },
    selectedEvents: {
      type: Array,
      default: () => [],
    },
    events: {
      type: Array,
      default: () => [],
    },
    id: {
      type: Number,
      default: () => {
      },
    },
    name: {
      type: String,
      default: () => '',
    },
  },

  watch: {
    dialog: {
      handler(val) {
        this.dialogStatus = val;
        if (!val) {
          this.closeDialog();
        }
        // this.persistent = false;
      },
      immediate: true,
    },
  },

  created() {
    this.parseData();
  },

  methods: {
    parseData() {
      if (!this.dialog) {
        this.closeDialog();
      }
      this.dialogStatus = this.dialog;
      const newSelectedEvents = [];
      if (this.selectedEvents) {
        this.selectedEvents.forEach((event) => {
          newSelectedEvents.push(event.id);
        });
      }
      this.newSelectedEvents = newSelectedEvents;
      this.userName = JSON.parse(JSON.stringify(this.name));
    },

    closeDialog() {
      this.$emit('closeDialog', false);
    },

    save() {
      const obj = {selectedEvents: this.newSelectedEvents, id: this.id};
      this.$emit('closeDialog', obj);
    },
  },
};
</script>
