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
      <div>
        <h2>Reset your password</h2>
        <p class="mb-10">Please, type your new password twice.</p>
      </div>
      <v-form
        v-model="valid"
        @keyup.native.enter="valid && onResetPassword()"
      >
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'fas fa-eye-slash' : 'fas fa-eye'"
          :autofocus="true"
          :rules="passwordRules"
          :type="show1 ? 'text' : 'password'"
          counter
          filled
          label="New password"
          required
          @click:append="show1 = !show1"
        ></v-text-field>
        <v-text-field
          v-model="confirmPassword"
          :append-icon="show2 ? 'fas fa-eye-slash' : 'fas fa-eye'"
          :rules="[passwordRequiredRule, passwordConfirmationRule]"
          :type="show2 ? 'text' : 'password'"
          class="mt-2"
          filled
          label="Confirm password"
          required
          @click:append="show2 = !show2"
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
          :disabled="loading"
          :loading="loading"
          block
          class="mt-4"
          color="primary"
          large
          @click="onResetPassword()"
        >
          Remind password
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import ApiService from '@/common/ApiService';
import AuthService from '../../common/AuthService';
import NotificationService from '../../common/NotificationService';

export default {
  name: 'ResetPassword',

  data: () => ({
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/.test(v) || 'At least 8 characters, containing at least 1 uppercase, 1 lowercase and 1 digit',
    ],
    confirmPassword: '',
    valid: false,
    emailSent: false,
    loading: false,
    show1: false,
    show2: false,
  }),

  computed: {
    passwordConfirmationRule() {
      return () => (this.password === this.confirmPassword) || 'Passwords do not match';
    },
    passwordRequiredRule() {
      return () => (!!this.confirmPassword) || 'Confirm password is required';
    },
  },

  methods: {
    async onResetPassword() {
      this.loading = true;
      if (this.valid) {
        ApiService.setHeader(this.$route.params.token);
        try {
          await AuthService.resetPassword({password: this.password, password_confirmation: this.confirmPassword});
          NotificationService.success('Password has been successfully reset');
          ApiService.removeHeader();
          await this.$router.push({name: 'Login'});
        } catch (e) {
          ApiService.removeHeader();
          NotificationService.error(e);
          this.loading = false;
        }
      } else {
        ApiService.removeHeader();
        NotificationService.error('Form is invalid. Please fill required fields.');
        this.loading = false;
      }
    },
  },
};
</script>
