<template>
  <v-row
    class="align-right"
    justify="center"
  >
    <v-col
      class="pa-4"
      cols="12"
      lg="6"
      md="10"
      sm="10"
      xl="4"
      xs="12"
    >
      <div v-if="!emailSent">
        <h2>Sign up</h2>
        <p class="mb-10">Please, fill fields below.</p>
      </div>
      <div v-if="emailSent">
        <h2>Thank you for registering your account. You will be assigned to your event within 24 hours.</h2>
        <p class="mb-10">Check your inbox for further instructions. If you don't see the email, check your spam folder
                        or contact <a href="https://patryk.in/">patryk.in</a>. You can close
                        this tab.</p>
      </div>
      <v-form
        v-if="!emailSent"
        v-model="valid"
        @keyup.native.enter="valid && onRegister()"
      >
        <div class="d-flex">
          <v-text-field
            v-model="formData.first_name"
            :autofocus="true"
            :rules="requiredRule"
            class="mr-2"
            filled
            label="FIRST NAME"
            required
          ></v-text-field>
          <v-text-field
            v-model="formData.last_name"
            :rules="requiredRule"
            class="ml-2"
            filled
            label="LAST NAME"
            required
          ></v-text-field>
        </div>

        <v-text-field
          v-model="formData.email"
          :rules="mailRule"
          filled
          label="E-MAIL"
          required
          :error="this.errors && this.errors.email"
          persistent-hint
          :hint="this.errors && this.errors.email ? this.errors.email[0] : false"
        ></v-text-field>
        <v-text-field
          v-model="formData.phone_number"
          :rules="phoneRule"
          filled
          label="PHONE"
          required
          :error="this.errors && this.errors.phone_number"
          persistent-hint
          :hint="this.errors && this.errors.phone_number ? this.errors.phone_number[0] : false"
        ></v-text-field>

        <v-text-field
          v-model="formData.company_name"
          :rules="requiredRule"
          filled
          label="COMPANY"
          required
        ></v-text-field>
        <v-text-field
          v-model="formData.description"
          :rules="requiredRule"
          filled
          label="ROLE"
          required
        ></v-text-field>

        <div class="d-flex">
          <v-text-field
            v-model="formData.password"
            :append-icon="show1 ? 'fas fa-eye-slash' : 'fas fa-eye'"
            :rules="passwordStrongRule"
            :type="show1 ? 'text' : 'password'"
            class="mr-2"
            counter
            filled
            label="New password"
            required
            style="width: 50%"
            @click:append="show1 = !show1"
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            :append-icon="show2 ? 'fas fa-eye-slash' : 'fas fa-eye'"
            :rules="[passwordConfirmationRule]"
            :type="show2 ? 'text' : 'password'"
            class="ml-2"
            filled
            label="Confirm password"
            required
            style="width: 50%"
            @click:append="show2 = !show2"
          ></v-text-field>
        </div>
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
          @click="onRegister()"
        >
          Sign up
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import AuthService from '../../common/AuthService';
import NotificationService from '../../common/NotificationService';

export default {
  name: 'Register',

  data: () => ({
    formData: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      company_name: '',
      description: '',
      password: '',
    },
    phoneRule: [
      v => /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm.test(v) || 'Phone must be valid.',
    ],
    mailRule: [
      v => !!v || 'Email is required',
      v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Mail must be valid.',
    ],
    requiredRule: [
      v => !!v || 'This field is required',
    ],
    passwordStrongRule: [
      v => /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/.test(v) || 'At least 8 characters, containing at least 1 uppercase, 1 lowercase and 1 digit',
    ],
    confirmPassword: '',
    valid: false,
    loading: false,
    emailSent: false,
    show1: false,
    show2: false,
    errors: null,
  }),

  computed: {
    passwordConfirmationRule() {
      return () => (this.formData.password === this.confirmPassword && this.confirmPassword.length > 0) || 'The passwords do not match';
    },
  },

  methods: {
    async onRegister() {
      this.loading = true;
      if (this.valid) {
        try {
          await AuthService.register(this.formData);
          this.emailSent = true;
          NotificationService.success('Account has been created');
        } catch (e) {
          this.errors = e.response.data;
          NotificationService.error(e.response.statusText);

          this.loading = false;
        }
      } else {
        NotificationService.error('Form is invalid. Please fill all fields.');
        this.loading = false;
      }
    },
  },
};
</script>
