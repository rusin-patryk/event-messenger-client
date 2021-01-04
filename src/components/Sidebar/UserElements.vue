<template>
  <div class="main-menu">
    <v-list-item
      :to="'/dashboard'"
      class="pt-2 pb-2 icon-field mt-16"
      link
    >
      <v-list-item-action>
        <div
          :class="{'mini-variant-icons': miniVariant}"
          class="d-flex justify-space-between"
        >
          <v-icon size="18">fas fa-home</v-icon>
        </div>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title class="font-weight-light f-17">Dashboard</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      :to="'/files'"
      v-if="getEvents.length > 0"
      class="pt-2 pb-2 icon-field"
      link
    >
      <v-list-item-action>
        <div
          :class="{'mini-variant-icons': miniVariant}"
          class="d-flex justify-space-between"
        >
          <v-icon size="18">fas fa-folder</v-icon>
        </div>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title class="font-weight-light f-17">Files</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      :to="'/messenger'"
      v-if="getEvents.length > 0"
      class="pt-2 pb-2 icon-field"
      link
    >
      <v-list-item-action>
        <div
          :class="{'mini-variant-icons': miniVariant}"
          class="d-flex justify-space-between"
        >
          <v-icon size="18">fas fa-comment</v-icon>
          <Badge
            v-if="miniVariant"
            :badge-value="unreadMessages"
          />
        </div>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title class="font-weight-light f-17">Messenger</v-list-item-title>
      </v-list-item-content>
      <Badge :badge-value="unreadMessages" />
    </v-list-item>
    <v-list-item
      :to="'/faq'"
      v-if="getEvents.length > 0"
      class="pt-2 pb-2 icon-field"
      link
    >
      <v-list-item-action>
        <div
          :class="{'mini-variant-icons': miniVariant}"
          class="d-flex justify-space-between"
        >
          <v-icon size="18">fas fa-question</v-icon>
        </div>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title class="font-weight-light f-17">FAQ</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Badge from '../Common/Badge';

export default {
  name: 'UserElements',
  components: {
    Badge,
  },

  props: {
    miniVariant: Boolean,
    unreadMessages: Number,
  },

  computed: {
    ...mapGetters(['getEvents']),
  },
};

</script>
