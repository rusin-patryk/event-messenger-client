<template>
  <div>
    <v-list-item @click="directTo(participant)">
      <v-list-item-avatar>
        <img
          v-if="participant.profilePicture"
          :src="participant.profilePicture"
          alt="avatar"
        >
        <img
          v-else
          alt="avatar"
          src="../../assets/default-avatar.png"
        >
      </v-list-item-avatar>
      <v-list-item-content :class="{'disabled': participant.name}">
        <v-list-item-title
          class="font-weight-medium"
        >
          {{ participant.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ participant.company_name }}<br>
          <small v-if="participant.is_disabled"><strong>READ-ONLY</strong>, account disabled</small>
        </v-list-item-subtitle>
      </v-list-item-content>
      <Badge :badge-value="participant.new_messages" />
    </v-list-item>
    <v-divider />
  </div>
</template>

<script>
import Badge from '@/components/Common/Badge';
import NotificationService from '@/common/NotificationService';

export default {
  name: 'Participant',
  data: () => ({
    apiPath: '',
  }),
  components: {
    Badge,
  },
  props: {
    participant: {
      type: Object,
      default: () => ({
        name: 'Unknown user',
        id: false,
        company_name: '&nbsp;',
        profilePicture: null,
        newMessages: 0,
      }),
    },
  },

  methods: {
    directTo(participant) {
      if (participant.is_disabled) {
        NotificationService.warning(`${participant.name} account is disabled. The conversation is read-only.`);
      }
      this.$emit('directTo', participant);
    },
  },
};
</script>
