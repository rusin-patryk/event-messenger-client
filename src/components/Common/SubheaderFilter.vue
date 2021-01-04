<template>
  <v-col
    cols="6"
    class="header-filters pl-3 pt-2"
  >
    <v-icon
      size="20"
      class="mr-3"
    >fas fa-random
    </v-icon>
    <small>
          <span
            @click="onChange(true)"
            :class="{'font-weight-black': sortAZ}"
            class="filter-element"
          >A-Z</span>
      &nbsp;|&nbsp;
      <span
        @click="onChange(false)"
        :class="{'font-weight-black': !sortAZ}"
        class="filter-element"
      >Recent</span>
    </small>
  </v-col>
</template>

<script>
export default {
  name: 'SubheaderFilter',

  props: {
    sortAZ: {
      type: Boolean,
      default: () => false,
    },
  },

  methods: {
    onChange(status) {
      this.$emit('changeStatus', status);
    },
  },
};
</script>
