<template>
  <v-row
    class="pl-lg-5 pr-lg-5 pl-sm-3 pr-sm-3 pt-0 pb-0 align-right messenger-main-container"
    justify="center"
  >
    <SubheaderFilter
      class="filters-on-desktop"
      :sortAZ="sortAZ"
      @changeStatus="(status) => {this.sortAZ = status}"
    />
    <v-col
      class="participant-button-mobile"
      cols="6"
    >
      <v-btn
        class="menu-text-button"
        color="mainDarkBlue"
        text
        @click.stop="mobileToggle = !mobileToggle"
      >
        <v-icon
          class="mr-3"
          size="28"
        >fas fa-barss
        </v-icon>
        PARTICIPANTS
      </v-btn>
    </v-col>
    <v-col
      :class="{'participant-list-mobile--active': mobileToggle, 'participant-list-mobile--close': !mobileToggle}"
      class="d-flex flex-column participant-list justify-space-between pt-1 pb-2 mb-5 mb-sm-5 mb-xs-5 mb-md-0 mb-lg-0 mb-xl-0"
      cols="12"
      lg="4"
      md="5"
      sm="12"
      style="box-shadow: 0 1px 8px #142E6E30; height: calc(100vh - 180px);"
      xs="12"
    >
      <v-skeleton-loader
        :loading="loading && hardLoading"
        type="list-item-avatar-two-line, divider, list-item-avatar-two-line, divider, list-item-avatar-two-line, divider, list-item-avatar-two-line, divider, list-item-avatar-two-line, divider, list-item-avatar-two-line"
      >
        <SubheaderFilter
          class="filters-on-mobile"
          :sortAZ="sortAZ"
          @changeStatus="(status) => {this.sortAZ = status}"
        />
        <v-list
          v-if="participants"
          style="max-height: calc(100vh - 280px); overflow-y: auto"
          two-line
        >
          <Participant
            v-for="participant in onSearch(participants)"
            :key="participant.id"
            :participant="participant"
            @directTo="directTo"
          />
        </v-list>
        <h4 v-else>No participants in this event</h4>
      </v-skeleton-loader>
      <div class="participant-search">
        <v-divider />
        <v-text-field
          v-model="searchValue"
          class="mt-3 ml-1 mr-1"
          dense
          filled
          label="Search..."
          prepend-inner-icon="fas fa-search"
          @change="onSearch"
        ></v-text-field>
      </div>
    </v-col>
    <v-col
      class="pt-0 mb-sm-5 mb-xs-5"
      cols="12"
      lg="8"
      md="7"
      sm="12"
      style="height: calc(100vh - 200px)"
      xs="12"
    >
      <v-card style="position:relative; z-index: 2">
        <v-skeleton-loader
          :loading="loading && hardLoading"
          type="list-item-avatar-two-line"
        >
          <OpenedConversationsTabs
            :loading="loading"
            :hard-loading="hardLoading"
            :tabs="tabs"
            :active-tab="activeTab"
            @pickConversation="pickConversation"
            @closeTab="closeTab"
          />
        </v-skeleton-loader>
      </v-card>
      <v-skeleton-loader
        :class="{'pt-5 pl-3' : loading}"
        :loading="loading"
        style="height: calc(100vh - 245px); box-shadow: 0 1px 8px #142E6E30; border-radius: 0 !important;"
        type="paragraph, paragraph, paragraph"
      >
        <Chat
          v-if="visible"
          :class="{'disabled': checkAccountStatus()}"
          :async-mode="asyncMode"
          :border-style="borderStyle"
          :chat-title="chatTitle"
          :colors="colors"
          :display-header="false"
          :hide-close-button="true"
          :link-options="linkOptions"
          :load-more-messages="globalMessages.messagesToLoad.length > 0 ? loadMoreMessages : null"
          :messages="globalMessages.messages"
          :myself="myself"
          :participants="participants"
          :placeholder="placeholder"
          :scroll-bottom="scrollBottom"
          :send-images="false"
          :submit-icon-size="submitIconSize"
          :timestamp-config="timestampConfig"
          :zone="0"
          @onMessageSubmit="onMessageSubmit"
          @onType="onType"
        />
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import 'vue-quick-chat/dist/vue-quick-chat.css';
import Participant from '@/components/Messenger/Participant';
import OpenedConversationsTabs from '@/components/Messenger/OpenedConversationsTabs';
import {Chat} from 'vue-quick-chat';
import {mapGetters} from 'vuex';
import MessengerMethods from '@/views/user/Messenger/MessengerMethods';
import StorageService from '@/common/StorageService';
import SubheaderFilter from '@/components/Common/SubheaderFilter';

export default {
  name: 'Messenger',

  data: () => ({
    lastEventId: null,
    visible: true,
    loading: true,
    mobileToggle: false,
    hardLoading: true,
    tabs: [{
      id: 0,
      name: '#general channel',
      fixed: true,
      image: false,
    }],
    activeTab: 0,
    sortAZ: false,
    blockLoad: true,
    searchValue: '',
    interval: null,
    conversationsInterval: null,
    participants: [],
    chatTitle: '',
    selectedConversationId: null,
    myself: {
      name: `${StorageService.getUserInfo().user.first_name} ${StorageService.getUserInfo().user.last_name}`,
      id: StorageService.getUserInfo().user.id,
      profilePicture: StorageService.getUserInfo().user.profile_image_path ? `${process.env.VUE_APP_API}/user/avatar/${StorageService.getUserInfo().user.profile_image_path}` : `${process.env.VUE_APP_API}/user/avatar/default-avatar.png`,
      company_name: StorageService.getUserInfo().user.company_name,
    },
    globalMessages: {
      messages: [],
      messagesToLoad: [],
    },
    placeholder: 'Start typing here',
    colors: {
      message: {
        myself: {
          bg: '#d6e8fd',
          text: '#323c43',
        },
        others: {
          bg: '#F1F5F8',
          text: '#414D55',
        },
        messagesDisplay: {
          bg: '#ffffff',
        },
      },
      submitIcon: '#ffffff',
      submitImageIcon: '#ffffff',
    },
    borderStyle: {
      topLeft: '10px',
      topRight: '10px',
      bottomLeft: '10px',
      bottomRight: '10px',
    },
    submitIconSize: 24,
    asyncMode: true,
    scrollBottom: {
      messageSent: true,
      messageReceived: false,
    },
    displayHeader: false,
    profilePictureConfig: {
      others: true,
      myself: true,
      styles: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
      },
    },
    timestampConfig: {
      format: 'hh:mm a (dd MMM)',
      relative: false,
    },
    linkOptions: {
      myself: {
        className: 'myLinkClass',
        events: {},
        format: function (value, type) { // eslint-disable-line
          if (type === 'url' && value.length > 50) {
            value = `${value.slice(0, 50)}…`;
          }
          return value;
        },
      },
      others: {
        className: 'othersLinkClass',
        events: {},
        format: function (value, type) { // eslint-disable-line
          if (type === 'url' && value.length > 50) {
            value = `${value.slice(0, 50)}…`;
          }
          return value;
        },
      },
    },
  }),

  mixins: [MessengerMethods],

  components: {
    Chat,
    Participant,
    OpenedConversationsTabs,
    SubheaderFilter,
  },

  computed: {
    ...mapGetters(['getPickedEvent']),
  },
};
</script>
