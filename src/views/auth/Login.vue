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
      <h2>Login to Events Messenger app</h2>
      <p class="mb-10">Please, type your e-mail and password to login.</p>
      <v-form
        v-model="valid"
        @keyup.native.enter="valid && onLogin()"
      >
        <v-text-field
          v-model="email"
          :autofocus="true"
          :rules="emailRules"
          filled
          label="Your e-mail"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="show ? 'fas fa-eye-slash' : 'fas fa-eye'"
          :rules="passwordRules"
          :type="show ? 'text' : 'password'"
          class="mt-4"
          filled
          label="Password"
          required
          @click:append="show = !show"
        ></v-text-field>
        <v-row
          class="align-right"
          justify="center"
        >
          <v-col cols="6">
            <v-checkbox
              v-model="remember"
              label="Remember me"
            ></v-checkbox>
          </v-col>
          <v-col
            class="text-right"
            cols="6"
          >
            <v-btn
              :to="'/remind-password'"
              link
              small
              text
            >
              Forgot password?
            </v-btn>
          </v-col>
        </v-row>
        <v-btn
          :disabled="loading"
          :loading="loading"
          block
          color="primary"
          large
          @click="onLogin()"
        >Login
        </v-btn>
      </v-form>
      <div class="text-center mt-4">
        If you don't have account yet,
        <v-btn
          :to="'/register'"
          class="pl-1 pr-1"
          link
          small
          text
        >
          <strong>Sign up!</strong>
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import LogRocket from 'logrocket';
import StorageService from '../../common/StorageService';
import AuthService from '../../common/AuthService';
import ApiService from '../../common/ApiService';
import AuthFactory from '../../common/AuthFactory';
import NotificationService from '../../common/NotificationService';

export default {
  name: 'Login',

  data: () => ({
    email: '',
    emailRules: [
      v => !!v || 'Email is required',
      v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Email must be valid',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
    ],
    valid: false,
    remember: true,
    loading: false,
    show: false,
  }),

  methods: {
    async onLogin() {
      this.loading = true;
      if (this.valid) {
        try {
          const response = await AuthService.login({email: this.email, password: this.password});
          StorageService.saveUserInfo(AuthFactory.toUserInfo({email: this.email, password: this.password}, response));
          ApiService.setHeader(response.access_token);
          this.logRocket(response);
          await this.$router.push({name: 'Dashboard'});
          this.loading = false;
        } catch (e) {
          NotificationService.error(e);
          this.loading = false;
        }
      } else {
        NotificationService.error('Form is invalid. Please fill required fields.');
        this.loading = false;
      }
    },

    logRocket(response) {
      if (process.env.NODE_ENV === 'production') {
        LogRocket.identify(response.user.id, {
          id: response.user.id,
          name: `${response.user.first_name} ${response.user.last_name}`,
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          email: response.user.email,
          email_verified_at: response.user.email_verified_at,
          created_at: response.user.created_at,
          phone_number: response.user.phone_number,
          profile_image_path: response.user.profile_image_path,
          description: response.user.description,
          company_name: response.user.company_name,
          is_admin: !!response.user.is_admin,
        });
      }
    },
  },
};
</script>
