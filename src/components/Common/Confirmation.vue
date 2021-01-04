<template>
  <v-dialog
    v-model="dialogStatus"
    max-width="320px"
  >
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>

      <v-card-text>
        {{ subtitle }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          :disabled="loading"
          :loading="loading"
          color="green darken-1"
          text
          @click="closeDialog(false)"
        >
          No
        </v-btn>

        <v-btn
          :disabled="loading"
          :loading="loading"
          color="red darken-1"
          text
          @click="closeDialog(id)"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'Confirmation',

  data: () => ({
    dialogStatus: null,
  }),

  props: {
    dialog: Boolean,
    loading: {
      type: Boolean,
      default: () => false,
    },
    id: {
      type: Number,
      default: () => null,
    },
    title: {
      type: String,
      default: () => ('Do you want to delete the item?'),
    },
    subtitle: {
      type: String,
      default: () => ('This action is permanent.'),
    },
  },

  watch: {
    dialog(val) {
      this.dialogStatus = val;
      this.persistent = false;
    },
    dialogStatus(val) {
      if (!val) {
        this.closeDialog();
      }
    },
  },

  methods: {
    closeDialog(id) {
      this.$emit('closeDialog', id);
    },
  },
};
</script>
