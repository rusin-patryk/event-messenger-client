<template>
  <v-app id="inspire">
    <header class="top-float-button">
      <v-btn
        href="https://patryk.in/"
        text
      >
        <v-icon
          class="mr-2"
          dark
          right
        >fas fa-chevron-left
        </v-icon>
        go back to patryk.in
      </v-btn>
    </header>
    <v-main>
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
export default {
  name: 'Auth',

  components: {},

  data: () => ({}),

  methods: {},
};
</script>
