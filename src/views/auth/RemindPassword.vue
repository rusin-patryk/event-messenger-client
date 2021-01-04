<template>
  <v-row
    class="align-right"
    justify="center"
  >
    <v-col
      class="pa-4"
      cols="12"
      lg="4"
      md="6"
      sm="8"
      xs="6"
    >
      <div v-if="!emailSent">
        <h2>Remind your password</h2>
        <p class="mb-10">Please, type your e-mail. We will send you a reset password link.</p>
      </div>
      <div v-if="emailSent">
        <h2>Password reset link has been sent</h2>
        <p class="mb-10">Check your inbox and follow the instructions. You can close this tab.</p>
      </div>
      <v-form
        v-model="valid"
        @keyup.native.enter="valid && onRemindPassword()"
      >
        <v-text-field
          v-if="!emailSent"
          v-model="email"
          :autofocus="true"
          :rules="emailRules"
          filled
          label="Your e-mail"
          required
        ></v-text-field>
        <v-row
          class="align-right"
          justify="center"
        >
          <v-col cols="6"></v-col>
          <v-col
            class="text-right"
            cols="6"
          >
            <v-btn
              :to="'/login'"
              link
              small
              text
            >
              Back to login
            </v-btn>
          </v-col>
        </v-row>
        <v-btn
          v-if="!emailSent"
          :disabled="loading"
          :loading="loading"
          block
          class="mt-4"
          color="primary"
          large
          @click="onRemindPassword()"
        >
          Remind password
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import AuthService from '../../common/AuthService';
import NotificationService from '../../common/NotificationService';

export default {
  name: 'RemindPassword',

  data: () => ({
    email: '',
    emailRules: [
      v => !!v || 'Email is required',
      v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Email must be valid',
    ],
    valid: false,
    emailSent: false,
    loading: false,
  }),

  methods: {
    async onRemindPassword() {
      this.loading = true;
      if (this.valid) {
        try {
          await AuthService.remindPassword({email: this.email}, this.$route.params.token);
          await this.emailSentEvent();
        } catch (e) {
          NotificationService.error(e);
          this.loading = false;
        }
      } else {
        NotificationService.error('Form is invalid. Please fill required fields.');
        this.loading = false;
      }
    },

    emailSentEvent() {
      NotificationService.success('Password reset link has been sent');
      this.emailSent = true;
      this.loading = false;
    },
  },
};
</script>
