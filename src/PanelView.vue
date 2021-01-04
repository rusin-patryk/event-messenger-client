<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="sidebarOpen"
      app
      color="mainDarkBlue"
      dark
      mini-variant-width="130"
      width="320"
    >
      <Sidebar :mini-variant="sidebarOpen" />
    </v-navigation-drawer>

    <Header
      :sidebar-open="sidebarOpen"
      @drawerChange="drawerChange"
      @handleSidebarStatus="handleSidebarStatus"
    />

    <v-main>
      <v-container
        class="pt-0"
        fluid
        style="position: absolute"
      >
        <Subheader />
      </v-container>
      <v-container
        class="fill-height pt-12 pb-12"
        fluid
      >
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from './components/Sidebar/Sidebar.vue';
import Header from './components/Header/Header';
import Subheader from './components/Header/Subheader.vue';

export default {
  name: 'App',

  components: {
    Sidebar,
    Header,
    Subheader,
  },

  data: () => ({
    sidebarOpen: null,
    drawer: null,
    dialog: false,
  }),

  beforeMount() {
    this.$vuetify.theme.dark = localStorage.getItem('themeDark') === 'true';
    this.sidebarOpen = localStorage.getItem('sidebarOpen') === 'true';
  },

  methods: {
    handleSidebarStatus(value) {
      this.sidebarOpen = value;
    },

    drawerChange(value) {
      this.drawer = value;
      this.sidebarOpen = false;
    },
  },
};
</script>
