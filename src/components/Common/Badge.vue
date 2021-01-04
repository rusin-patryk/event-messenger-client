<template>
  <div
    v-if="badgeValue && badgeValue > 0"
    :class="{'dense': dense, 'new-messages': newsMessages}"
    class="badge"
  >
    <span v-if="!dense">{{ badgeValue }}</span>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Badge.vue',

  data: () => ({
    newsMessages: false,
  }),

  props: {
    badgeValue: Number,
    events: Array,
    dense: Boolean,
  },

  computed: {
    ...mapGetters(['getPickedEvent']),
  },

  watch: {
    events: {
      handler() {
        this.checkEvents();
      },
      immediate: true,
      deep: true,
    },
    getPickedEvent: {
      handler() {
        this.checkEvents();
      },
      immediate: true,
    },
  },

  created() {
    this.checkEvents();
  },

  methods: {
    checkEvents() {
      if (this.dense && this.events && this.events.length > 0 && this.getPickedEvent) {
        this.newsMessages = this.events.find((element) => {
          return (element.id !== this.getPickedEvent && element.new_messages > 0);
        });
        this.newsMessages = this.newsMessages && this.newsMessages.new_messages && this.newsMessages.new_messages > 0;
      } else {
        this.newsMessages = false;
      }
    },
  },
};
</script>
