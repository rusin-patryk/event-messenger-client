<template>
  <v-row
    class="align-right"
  >
    <v-col class="text-right pt-0 pr-4">
      <v-switch
        v-model="$vuetify.theme.dark"
        class="mt-2"
        inset
        label="Dark mode"
        style="display: inline-block"
        @change="saveThemeState"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Subheader',

  methods: {
    saveThemeState() {
      localStorage.setItem('themeDark', this.$vuetify.theme.dark.toString());
    },
  },
};
</script>
