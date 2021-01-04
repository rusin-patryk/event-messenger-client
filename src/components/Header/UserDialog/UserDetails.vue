<template>
  <div>
    <v-form v-model="formValid" @keyup.native.enter="formValid && updateUserInfo()">
      <v-row>
        <v-col class="pb-0 pt-4 pl-3 pr-3" cols="12" sm="6">
          <v-text-field
            v-model="userInfo.user.first_name"
            :rules="requiredRule25"
            counter="25"
            filled
            label="FIRST NAME"
            required
            @input="disableClear = false"
          ></v-text-field>
        </v-col>
        <v-col class="pb-0 pt-4 pl-3 pr-3" cols="12" sm="6">
          <v-text-field
            v-model="userInfo.user.last_name"
            :rules="requiredRule25"
            counter="25"
            filled
            label="LAST NAME"
            required
            @input="disableClear = false"
          ></v-text-field>
        </v-col>
        <v-col class="pb-0 pt-2 pl-3 pr-3" cols="12">
          <v-text-field
            v-model="userInfo.email"
            :rules="mailRule"
            filled
            hint="Please contact Admin to change e-mail."
            label="E-MAIL"
            readonly
            required
            @input="disableClear = false"
          ></v-text-field>
        </v-col>
        <v-col class="pb-0 pt-2 pl-3 pr-3" cols="12">
          <v-text-field
            v-model="userInfo.user.phone_number"
            :rules="phoneRule"
            filled
            label="PHONE"
            required
            @input="disableClear = false"
          ></v-text-field>
        </v-col>
        <v-col class="pb-0 pt-2 pl-3 pr-3" cols="12">
          <v-text-field
            v-model="userInfo.user.company_name"
            :rules="requiredRule35"
            counter="35"
            filled
            label="COMPANY"
            required
            @input="disableClear = false"
          ></v-text-field>
        </v-col>
        <v-col class="pb-0 pt-2 pl-3 pr-3" cols="12">
          <v-text-field
            v-model="userInfo.user.description"
            :rules="requiredRule35"
            counter="35"
            filled
            label="ROLE"
            required
            @input="disableClear = false"
          ></v-text-field>
        </v-col>
        <v-col class="pb-0 pt-2 pl-3 pr-3 d-flex" cols="12">
          <v-file-input
            v-model="userPic"
            :rules="sizeRule"
            accept="image/png, image/jpeg"
            counter
            filled
            label="USERPIC"
            placeholder="Add or change user pic."
            prepend-icon="fas fa-camera"
            show-size
            @input="disableClear = false"
          ></v-file-input>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-if="userInfo.user.profile_image_path"
                     v-bind="attrs" v-on="on"
                     :disabled="loading"
                     :loading="loading"
                     class="error mt-2 ml-3"
                     fab
                     small
                     @click="deleteImage">
                <v-icon size="18">fas fa-trash</v-icon>
              </v-btn>
            </template>
            <span>Delete current pic.</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-form>
    <v-card-actions class="pl-0 pr-0">
      <v-spacer></v-spacer>
      <v-btn
        :disabled="loading || disableClear"
        :loading="loading"
        class="mainLightGrey w-30"
        large @click="clearForm">
        RESET
      </v-btn>
      <v-btn
        :disabled="loading"
        :loading="loading"
        class="primary w-70"
        large
        @click="updateUserInfo">
        SAVE
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import UserService from '@/common/UserService';
import StorageService from '@/common/StorageService';
import NotificationService from '@/common/NotificationService';

export default {
  name: 'UserDetails',

  data: () => ({
    dialogStatus: null,
    tab: null,
    formValid: true,
    phoneRule: [
      v => /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm.test(v) || 'Phone must be valid.',
    ],
    mailRule: [
      v => !!v || 'Email is required',
      v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Mail must be valid.',
    ],
    requiredRule25: [
      v => !!v || 'This field is required',
      v => v.length <= 25 || 'A maximum of 25 characters is allowed',
    ],
    requiredRule35: [
      v => !!v || 'This field is required',
      v => v.length <= 35 || 'A maximum of 30 characters is allowed',
    ],
    sizeRule: [
      v => !v || v.size < 1000100 || 'Picture size should be less than 1 MB!',
    ],
    formData: {},
    loading: false,
    userPic: null,
    disableClear: true,
  }),

  props: {
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
  },

  methods: {
    async updateUserInfo() {
      this.loading = true;
      const data = {
        first_name: this.userInfo.user.first_name,
        last_name: this.userInfo.user.last_name,
        phone_number: this.userInfo.user.phone_number,
        company_name: this.userInfo.user.company_name,
        description: this.userInfo.user.description,
      };
      if (this.formValid) {
        try {
          await UserService.updateUser(data);
          if (this.userPic) {
            await this.updateFile();
          } else {
            this.loading = false;
            StorageService.saveUserInfo(this.userInfo);
            NotificationService.success('Personal data has been changed');
            this.closeDialog();
            this.clearForm();
          }
        } catch (e) {
          NotificationService.error(e);
          this.loading = false;
        }
      } else {
        NotificationService.error('Form is invalid. Please fill required fields.');
        this.loading = false;
      }
    },
    async deleteImage() {
      this.loading = true;
      try {
        await UserService.deleteFile();
        this.userInfo.user.profile_image_path = '';
        StorageService.saveUserInfo(this.userInfo);
        NotificationService.success('user pic. has been deleted');
        this.clearForm();
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },
    async updateFile() {
      this.loading = true;
      const formData = new FormData();
      formData.append('image', this.userPic, this.userPic.name);
      try {
        const response = await UserService.updateFile(formData);
        this.userInfo.user.profile_image_path = response.data.profile_image_path;
        StorageService.saveUserInfo(this.userInfo);
        NotificationService.success('Personal data has been changed');
        this.closeDialog();
        this.clearForm();
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    clearForm() {
      this.disableClear = true;
      this.$emit('clearForm');
    },

    closeDialog() {
      this.$emit('closeDialog');
    },
  },
};
</script>
