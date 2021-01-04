<template>
  <v-row
    class="align-right"
    justify="center"
  >
    <v-col class="text-center">
      <h1
        class="mb-0; font-weight-light"
        style="font-size: 10rem; line-height: 9rem"
      >404</h1>
      <h5
        class="mb-5 font-weight-light"
        style="font-size: 2.3rem"
      >Page Not Found</h5>
      <v-btn
        :to="'/dashboard'"
        color="primary"
        text
        x-large
      >Home
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>
