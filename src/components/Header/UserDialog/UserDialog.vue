<template>
  <v-dialog
    v-model="dialogStatus"
    :persistent="persistent"
    max-width="600px"
  >
    <v-card>
      <v-card-text class="pa-0">
        <div
          v-if="!persistent"
          class="pt-4 pl-5 pr-5 pb-1 d-flex justify-space-between"
          style="line-height: 32px;"
        >
          <h2>Your account details</h2>
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
        <div
          v-if="persistent"
          class="pt-3 pl-5 pr-5 pb-2"
          style="line-height: 32px;"
        >
          <h2>Please complete your profile information before continuing</h2>
        </div>
        <v-container>
          <v-tabs
            v-model="tab"
            :grow="true"
            flat
            style="border-radius: 5px 5px 0 0"
          >
            <v-tabs-slider></v-tabs-slider>
            <v-tab>
              Personal data
            </v-tab>
            <v-tab :disabled="persistent">
              Password
            </v-tab>
            <v-tab-item
              class="pa-4"
              flat
              style="min-height: 664px"
            >
              <UserDetails
                :user-info="userInfo"
                @clearForm="clearForm"
                @closeDialog="closeDialog"
              />
            </v-tab-item>
            <v-tab-item
              class="pa-4"
              style="min-height: 664px"
            >
              <ChangePassword @closeDialog="closeDialog" />
            </v-tab-item>
          </v-tabs>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import UserDetails from '@/components/Header/UserDialog/UserDetails';
import ChangePassword from '@/components/Header/UserDialog/ChangePassword';

export default {
  name: 'UserDialog',

  components: {
    UserDetails,
    ChangePassword,
  },

  data: () => ({
    dialogStatus: null,
    tab: null,
  }),

  props: {
    dialog: Boolean,
    userInfo: {
      type: Object,
      default: () => ({
        user: {
          first_name: '',
          last_name: '',
          phone_number: '',
          company_name: '',
          description: '',
          profile_image_path: '',
        },
      }),
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    dialog(val) {
      this.dialogStatus = val;
    },
    dialogStatus(val) {
      if (!val) {
        this.closeDialog();
      }
    },
  },

  methods: {
    clearForm() {
      this.$emit('refreshData');
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
  },
};
</script>
