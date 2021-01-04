<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',

  watch: {
    $route: {
      immediate: true,
      handler(to) {
        document.title = to.meta.title ? `${to.meta.title} - Event Messenger` || 'Event Messenger'
                                       : 'Event Messenger';
      },
    },
  },
};
</script>

<style lang="scss">
@import 'styles/main.scss';
</style>
