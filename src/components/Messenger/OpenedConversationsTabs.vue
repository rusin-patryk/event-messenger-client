<template>
  <v-card style="position:relative; z-index: 2">
    <v-skeleton-loader
      :loading="loading && hardLoading"
      type="list-item-avatar-two-line"
    >
      <v-tabs
        v-model="activeTab"
        active-class="messenger-active-tab"
        background-color="#F1F5F8"
        class="messenger-tabs"
        show-arrows
        slider-size="4"
      >
        <v-tab
          v-for="(tab, index) in tabs"
          :key="index"
          class="pl-6 pr-6"
          @click="pickConversation(tab.id)"
        >
          <v-avatar
            v-if="tab.id"
            class="mr-3"
            size="38px"
          >
            <img
              :src="tab.image"
              alt="Avatar"
            >
          </v-avatar>
          <span :class="{'general': tab.id === 0}">{{ tab.name }}</span>
          <Badge :badge-value="tab.new_messages" />
          <v-btn
            v-if="!tab.fixed"
            class="tab-close-button"
            icon
            x-small
            @click="closeTab(index)"
          >
            <v-icon>fas fa-times</v-icon>
          </v-btn>
        </v-tab>
      </v-tabs>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import Badge from '@/components/Common/Badge';

export default {
  name: 'OpenedConversationsTabs',

  components: {
    Badge,
  },

  props: {
    tabs: {
      type: Array,
      default: () => [{
        id: 0,
        name: '#general channel',
        fixed: true,
        image: false,
      }],
    },
    loading: {
      type: Boolean,
      default: () => true,
    },
    hardLoading: {
      type: Boolean,
      default: () => true,
    },
    activeTab: {
      type: Number,
      default: () => 0,
    },
  },

  methods: {
    pickConversation(tabId) {
      this.$emit('pickConversation', tabId);
    },

    closeTab(index) {
      this.$emit('closeTab', index);
    },
  },
};
</script>
