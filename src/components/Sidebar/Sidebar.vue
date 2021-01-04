<template>
  <v-list
    active-class="active-color"
    class="pt-0 sidebar-list"
    dense
  >
    <div class="text-right">
      <h2 v-if="miniVariant">
        MC
      </h2>
      <h2 v-else>
        Messenger Client
      </h2>
    </div>
    <UserElements
      :mini-variant="miniVariant"
      :unread-messages="getUnreadMessages"
    />
    <v-divider
      v-if="isAdmin"
      class="mt-4 mb-4"
    />
    <AdminElements
      v-if="isAdmin"
      :mini-variant="miniVariant"
    />
    <v-list-item
      class="pt-2 pb-2 icon-field logout-button"
      link
      @click="logout"
    >
      <v-list-item-action>
        <div
          :class="{'mini-variant-icons': miniVariant}"
          class="d-flex justify-space-between"
        >
          <img
            alt="logo"
            height="20"
            src="../../assets/logout.svg"
            width="28"
          />
        </div>
      </v-list-item-action>
      <v-list-item-content style="margin-left: -20px">
        <v-list-item-title
          v-if="!loading"
          class="font-weight-light f-17"
        >Logout
        </v-list-item-title>
        <v-list-item-title
          v-if="loading"
          class="font-weight-light f-17"
        >Please wait...
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import {mapGetters} from 'vuex';
import StorageService from '@/common/StorageService';
import ApiService from '@/common/ApiService';
import AuthService from '@/common/AuthService';
import AuthFactory from '@/common/AuthFactory';
import NotificationService from '@/common/NotificationService';
import UserElements from '@/components/Sidebar/UserElements';
import AdminElements from '@/components/Sidebar/AdminElements';

export default {
  name: 'Sidebar',
  data: () => ({
    loading: false,
    isAdmin: false,
  }),

  components: {
    UserElements,
    AdminElements,
  },

  props: {
    miniVariant: Boolean,
  },

  created() {
    this.isAdmin = StorageService.isAdmin();
  },

  computed: {
    ...mapGetters(['getUnreadMessages']),
  },

  methods: {
    async logout() {
      this.loading = true;
      try {
        const response = await AuthService.logout();
        StorageService.saveUserInfo(AuthFactory.toUserInfo({email: this.email, password: this.password}, response));
        ApiService.removeHeader();
        this.loading = false;
        await StorageService.clearCredentials();
        await this.$router.push({name: 'Login'});
      } catch (e) {
        NotificationService.error(e);
        ApiService.removeHeader();
        this.loading = false;
        await StorageService.clearCredentials();
        await this.$router.push({name: 'Login'});
      }
    },
  },
};
</script>
