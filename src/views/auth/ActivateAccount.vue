<template>
  <v-row
    class="align-center"
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
      <div v-if="loading">
        <h2>Loading, please wait...</h2>
      </div>
      <div v-if="!loading && success">
        <h2>Account has been activated successfully</h2>
        <p class="mb-10">You will be redirect to login page in {{ redirection }}...</p>
      </div>
      <div v-if="!loading && !success">
        <h2>Account activation error</h2>
        <p class="mb-10">Your account has been activated already or activation link is invalid / expired. If you are
                         unable to login, please contact <a
            href="https://patryk.in/"
            target="_blank"
          >patryk.in</a>.
        </p>
      </div>
      <v-row
        class="align-center"
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
    </v-col>
  </v-row>
</template>

<script>
import ApiService from '@/common/ApiService';
import AuthService from '../../common/AuthService';
import NotificationService from '../../common/NotificationService';

export default {
  name: 'RemindPassword',

  data: () => ({
    loading: true,
    success: false,
    redirection: 5,
  }),

  mounted() {
    this.activateAccount();
  },

  methods: {
    async activateAccount() {
      if (this.$route.params.token) {
        ApiService.setHeader(this.$route.params.token);
        try {
          await AuthService.activateAccount();
          NotificationService.success('Account has been activated successfully.');
          await this.onSuccessActivation();
        } catch (e) {
          ApiService.removeHeader();
          NotificationService.error(e || 'Account has been activated already or activation link is invalid / expired.');
          this.loading = false;
          this.success = false;
        }
      } else {
        ApiService.removeHeader();
        NotificationService.error('Activation link is invalid.');
        this.loading = false;
        this.success = false;
      }
    },

    onSuccessActivation() {
      ApiService.removeHeader();
      this.success = true;
      this.loading = false;
      for (let i = 0; i <= 5; i++) {
        setTimeout(() => {
          this.redirection--;
        }, 1000);
      }
      this.$router.push({name: 'Login'});
    },
  },
};
</script>
