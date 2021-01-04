<template>
  <v-btn
    class="d-flex text-right avatar-btn avatar-btn"
    color="mainDarkBlue"
    text
    x-large
    @click.stop="onClick"
  >
    <div class="mr-4 d-flex flex-column justify-center user-name-container">
      <div>{{ this.userInfo.user.first_name }} {{ this.userInfo.user.last_name }}</div>
      <span
        class="font-weight-light"
        style="font-size: .88rem; line-height: 1.2rem;"
      >{{ this.userInfo.user.company_name }}</span>
    </div>
    <v-avatar
      size="56px"
    >
      <img
        v-if="!userInfo.user.profile_image_path"
        alt="Avatar"
        src="../../assets/default-avatar.png"
      >
      <img
        v-if="userInfo.user.profile_image_path"
        :src="`${apiPath}/user/avatar/${userInfo.user.profile_image_path}`"
        alt="Avatar"
        style="width: auto !important; height: 100% !important;"
      >
    </v-avatar>
  </v-btn>
</template>

<script>
export default {
  name: 'Avatar',
  data: () => ({
    apiPath: '',
  }),
  props: {
    userInfo: {
      type: Object,
      default: () => ({
        user: {
          first_name: '',
          last_name: '',
          company_name: '',
          profile_image_path: '',
        },
      }),
    },
  },

  mounted() {
    this.apiPath = process.env.VUE_APP_API;
  },

  methods: {
    onClick() {
      this.$emit('openDialog');
    },
  },
};
</script>

<style
  lang="scss"
  scoped
>
.avatar-btn {
  height: auto !important;
  letter-spacing: unset !important;
  text-transform: unset !important;
}

.user-name-container {
  font-size: .96rem;
  line-height: 1.3rem
}

@media (max-width: 700px) {
  .user-name-container {
    display: none !important;
  }
}
</style>
