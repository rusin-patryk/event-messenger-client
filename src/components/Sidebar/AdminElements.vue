<template>
  <div>
    <v-list-item
      :to="'/events'"
      class="pt-2 pb-2 icon-field"
      link
    >
      <v-list-item-action>
        <div
          :class="{'mini-variant-icons': miniVariant}"
          class="d-flex justify-space-between"
        >
          <v-icon size="18">fas fa-calendar-day</v-icon>
        </div>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title class="font-weight-light f-17">Events</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      :to="'/users'"
      class="pt-2 pb-2 icon-field"
      link
    >
      <v-list-item-action>
        <div
          :class="{'mini-variant-icons': miniVariant}"
          class="d-flex justify-space-between"
        >
          <v-icon size="18">fas fa-users</v-icon>
        </div>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title class="font-weight-light f-17">Users</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
export default {
  name: 'AdminElements.vue',
  props: {
    miniVariant: Boolean,
  },
};
</script>
