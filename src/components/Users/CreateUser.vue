<template>
  <v-dialog
    v-model="dialog"
    :persistent="true"
    max-width="800px"
  >
    <v-card>
      <v-card-text class="pa-0">
        <div
          class="pt-4 pl-5 pr-5 pb-3 d-flex justify-space-between"
          style="line-height: 32px;"
        >
          <h2>Create user</h2>
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
        <v-form
          class="pt-5 pl-5 pr-5 pb-5"
          v-if="!emailSent"
          v-model="valid"
          @keyup.native.enter="valid && onCreateUser()"
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
          ></v-text-field>
          <v-text-field
            v-model="formData.phone_number"
            :rules="phoneRule"
            filled
            label="PHONE"
            required
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
          <v-card-actions class="pl-0 pr-0">
            <v-spacer></v-spacer>
            <v-btn
              :disabled="loading"
              :loading="loading"
              class="mainLightGrey w-30"
              large
              @click="clearForm"
            >
              CLEAR
            </v-btn>
            <v-btn
              :disabled="loading"
              :loading="loading"
              class="primary w-70"
              large
              @click="onCreateUser"
            >
              Create user
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import NotificationService from '@/common/NotificationService';
import UserService from '@/common/UserService';

export default {
  name: 'CreateUser',
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
    confirmPassword: '',
    valid: false,
    loading: false,
    emailSent: false,
    show1: false,
    show2: false,
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
  }),

  computed: {
    passwordConfirmationRule() {
      return () => (this.formData.password === this.confirmPassword && this.confirmPassword.length > 0) || 'The passwords do not match';
    },
  },

  props: {
    dialog: {
      type: Boolean,
    },
  },

  methods: {
    async onCreateUser() {
      this.loading = true;
      if (this.valid) {
        try {
          await UserService.createUser(this.formData);
          this.emailSent = true;
          NotificationService.success('Account has been created');
          this.closeDialog();
          this.clearForm();
        } catch (e) {
          NotificationService.error(e);
          this.loading = false;
        }
      } else {
        NotificationService.error('Form is invalid. Please fill all fields.');
        this.loading = false;
      }
    },

    clearForm() {
      this.formData = {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        company_name: '',
        description: '',
        password: '',
      };
      this.confirmPassword = '';
      this.valid = false;
      this.loading = false;
      this.emailSent = false;
      this.show1 = false;
      this.show2 = false;
    },

    closeDialog() {
      this.$emit('closeDialog');
    },
  },
};
</script>
