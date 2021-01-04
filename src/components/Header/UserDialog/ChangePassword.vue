<template>
  <div>
    <v-form v-model="passwordValid" @keyup.native.enter="passwordValid && changePassword()">
      <v-row>
        <v-col class="pb-0 pt-4 pl-3 pr-3" cols="12">
          <v-text-field
            v-model="password.currentPassword"
            :append-icon="show1 ? 'fas fa-eye-slash' : 'fas fa-eye'"
            :type="show1 ? 'text' : 'password'"
            filled
            label="Current password"
            required
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>
        <v-col class="pb-0 pt-2 pl-3 pr-3" cols="12">
          <v-text-field
            v-model="password.newPassword"
            :append-icon="show2 ? 'fas fa-eye-slash' : 'fas fa-eye'"
            :rules="[passwordStrongRule]"
            :type="show2 ? 'text' : 'password'"
            counter
            filled
            label="New password"
            required
            @click:append="show2 = !show2"
          ></v-text-field>
        </v-col>
        <v-col class="pb-0 pt-2 pl-3 pr-3" cols="12">
          <v-text-field
            v-model="password.confirmPassword"
            :append-icon="show3 ? 'fas fa-eye-slash' : 'fas fa-eye'"
            :rules="[passwordConfirmationRule]"
            :type="show3 ? 'text' : 'password'"
            class="mt-2"
            filled
            label="Confirm password"
            required
            @click:append="show3 = !show3"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-card-actions class="pl-0 pr-0" style="margin-top: 274px">
      <v-spacer></v-spacer>
      <v-btn :disabled="loading" :loading="loading" class="primary w-100" large
             @click="changePassword">CHANGE PASSWORD
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import UserService from '@/common/UserService';
import NotificationService from '@/common/NotificationService';

export default {
  name: 'ChangePassword',

  data: () => ({
    password: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    confirmPassword: '',
    passwordValid: false,
    show1: false,
    show2: false,
    show3: false,
    loading: false,
  }),

  computed: {
    passwordStrongRule() {
      return () => /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/.test(this.password.newPassword) || 'At least 8 characters, containing at least 1 uppercase, 1 lowercase and 1 digit';
    },
    passwordConfirmationRule() {
      return () => (this.password.newPassword === this.password.confirmPassword && this.password.confirmPassword.length > 0) || 'The passwords do not match';
    },
  },

  methods: {
    async changePassword() {
      this.loading = true;
      if (this.passwordValid) {
        try {
          await UserService.updatePassword({
            current_password: this.password.currentPassword,
            new_password: this.password.newPassword,
            new_password_confirmation: this.password.confirmPassword,
          });
          NotificationService.success('Password has been changed');
          this.closeDialog();
          this.password = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          };
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

    closeDialog() {
      this.$emit('closeDialog');
    },
  },
};
</script>
