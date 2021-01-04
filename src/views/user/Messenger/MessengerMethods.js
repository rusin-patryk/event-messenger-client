import MessengerService from '@/common/MessengerService';
import StorageService from '@/common/StorageService';
import NotificationService from '@/common/NotificationService';
import store from '@/store/store';

export default {
  mounted() {
    this.lastEventId = this.getPickedEvent;
    this.getConversations(false, true);
    if (this.interval) {
      clearInterval(this.interval);
      clearInterval(this.conversationsInterval);
    }
    this.loopGetLastMessagesQuery();
    const tabs = StorageService.getTabs();
    if (tabs && tabs.length > 0 && tabs[0].id === 0 && tabs[0].name === '#general channel') {
      this.tabs = tabs;
    }
  },

  beforeDestroy() {
    clearInterval(this.interval);
    clearInterval(this.conversationsInterval);
  },

  watch: {
    getPickedEvent() {
      if (this.getPickedEvent === this.lastEventId) {
        return;
      }
      this.lastEventId = this.getPickedEvent;
      this.hardLoading = true;
      this.getConversations(false, true);
      if (this.interval) {
        clearInterval(this.interval);
        clearInterval(this.conversationsInterval);
      }
      this.loopGetLastMessagesQuery();
    },
  },

  methods: {
    loopGetLastMessagesQuery() {
      this.interval = setInterval(() => {
        this.getLastMessages();
      }, 3000);
      this.conversationsInterval = setInterval(() => {
        this.getConversations(true);
      }, 12000);
    },

    async getConversations(noLoading = false, firstLoad = false) {
      if (!noLoading) {
        this.loading = true;
      }
      if (!this.getPickedEvent) {
        this.loadingWait();
        return;
      }
      if (!firstLoad && this.blockLoad) {
        return;
      }
      try {
        const conversations = await MessengerService.GetConversation({
          event_id: this.getPickedEvent,
          sortBy: 'recent_conversation',
          orderBy: 'asc',
        });

        for (let i = 0; i < conversations.participants.length; i++) {
          if (!conversations.participants[i].profilePicture) {
            conversations.participants[i].profilePicture = `${process.env.VUE_APP_API}/user/avatar/default-avatar.png`;
          } else {
            conversations.participants[i].profilePicture = `${process.env.VUE_APP_API}/user/avatar/${conversations.participants[i].profilePicture}`;
          }
        }

        this.participants = conversations.participants;

        if (this.tabs.length > 1) {
          for (let i = 1; i < this.tabs.length; i++) {
            const element = this.participants.find((v) => {
              if (v.id === this.tabs[i].id) {
                this.tabs[i].newMessages = v.new_messages;
              }
              return v.id === this.tabs[i].id;
            });
            if (typeof element === 'undefined' && !!this.tabs[i].id) {
              this.tabs.splice(i, 1);
            }
          }
        }
        StorageService.saveTabs(this.tabs);

        if (firstLoad) {
          await this.getMessages(this.selectedConversationId);
        }
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
        this.blockLoad = false;
        this.hardLoading = false;
      }
    },

    async getMessages(userId = null) {
      try {
        const globalMessages = await MessengerService.GetMessages({
          user_id: userId,
          event_id: this.getPickedEvent,
          elementsNumber: 1000,
          pageNumber: 1,
        });

        store.commit('triggerEventsReload', true);

        for (let i = 0; i < globalMessages.data.length; i++) {
          globalMessages.data[i].uploaded = true;
        }

        globalMessages.data = globalMessages.data.filter((thing, index, self) => index === self.findIndex((t) => (
          t.id === thing.id
        )));

        if (globalMessages.data && globalMessages.data.length > 0) {
          globalMessages.data
            .sort((a, b) => {
              return a.id - b.id;
            });
        }

        if (globalMessages.data.length > 20) {
          this.globalMessages.messages = globalMessages.data.slice(globalMessages.data.length - 20, globalMessages.data.length);
          this.globalMessages.messagesToLoad = globalMessages.data.slice(0, globalMessages.data.length - 20);
        } else {
          this.globalMessages.messages = globalMessages.data;
          this.globalMessages.messagesToLoad = [];
        }

        this.loading = false;
        this.blockLoad = false;
        this.hardLoading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
        this.blockLoad = false;
        this.hardLoading = false;
      }
    },

    loadingWait() {
      setTimeout(() => {
        this.loading = false;
      }, 4000);
    },

    closeTab(index) {
      if (index > 0) {
        this.$nextTick(() => {
          this.tabs.splice(index, 1);
          if (index <= this.tabs.length - 1) {
            this.pickConversation(this.tabs[index].id);
          } else {
            this.pickConversation(0);
          }
        });
        StorageService.saveTabs(this.tabs);
      }
    },

    onSearch() {
      let participants = JSON.parse(JSON.stringify(this.participants));
      participants = participants.filter((participant) => {
        return participant.name.toLowerCase().search(this.searchValue.toLowerCase()) >= 0 || participant.company_name.toLowerCase().search(this.searchValue.toLowerCase()) >= 0;
      });

      if (!this.sortAZ) {
        return participants;
      }

      return participants.sort((a, b) => {
        const textA = a.name.toUpperCase();
        const textB = b.name.toUpperCase();
        if (textA < textB) {
          return -1;
        } else if (textA > textB) {
          return 1;
        } else {
          return 0;
        }
      });
    },

    directTo(participant) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].id === participant.id) {
          this.activeTab = i;
          this.pickConversation(this.tabs[i].id);
          return;
        }
      }
      this.tabs.push({
        name: participant.name,
        id: participant.id,
        image: participant.profilePicture,
        fixed: false,
        newMessages: null,
      });
      this.activeTab = this.tabs.length - 1;
      this.pickConversation(participant.id);
      StorageService.saveTabs(this.tabs);
      this.mobileToggle = false;
    },

    checkAccountStatus() {
      if (!this.selectedConversationId) {
        return false;
      }
      return !!this.participants.find(x => x.id === this.selectedConversationId).is_disabled;
    },

    pickConversation(id) {
      if (id === this.selectedConversationId || (id === 0 && this.selectedConversationId === null)) {
        return;
      }
      this.blockLoad = true;
      if (!id) {
        this.selectedConversationId = null;
      } else {
        this.selectedConversationId = id;
      }
      this.getConversations(false, true);
      clearInterval(this.interval);
      clearInterval(this.conversationsInterval);
      this.loopGetLastMessagesQuery();
    },

    onType() {
      // here you can set any behavior
    },

    loadMoreMessages(resolve) {
      setTimeout(() => {
        resolve(this.globalMessages.messagesToLoad);
        const messages = this.globalMessages.messages;
        let toLoad = this.globalMessages.messagesToLoad;
        if (toLoad.length >= 20) {
          messages.unshift(...toLoad.slice(toLoad.length - 20, toLoad.length));
          toLoad = toLoad.slice(0, toLoad.length - 20);
        } else {
          messages.unshift(...toLoad);
          toLoad = [];
        }
        this.globalMessages.messages = messages;
        this.globalMessages.messagesToLoad = toLoad;
      }, 1000);
    },

    async onMessageSubmit(message, retry = 0) {
      if (!message.content.replace(/(\r\n|\n|\r)/gm, '')) {
        NotificationService.error('You cannot send an empty message.');
        this.blockLoad = false;
        return;
      }
      if (retry === 0) {
        this.globalMessages.messages.push(message);
      }
      if (this.blockLoad && retry > 0 && retry <= 10) {
        retry++;
        this.onMessageSubmit(message, retry);
        return;
      }
      if (this.blockLoad && retry > 10) {
        NotificationService.error('The message could not be delivered, please try again later.');
        return;
      }
      if (retry > 3) {
        NotificationService.error('The message could not be delivered, please try again later.');
        this.blockLoad = false;
        return;
      }
      if (await this.getLastMessages()) {
        this.blockLoad = true;
        try {
          const response = await MessengerService.sendMessage({
            event_id: this.getPickedEvent,
            to: this.selectedConversationId,
            content: message.content,
          });
          message.uploaded = true;
          message.id = response.id;
          this.checkIsUploaded(response.id);
          this.blockLoad = false;
        } catch (e) {
          retry++;
          setTimeout(() => {
            this.onMessageSubmit(message, retry);
          }, 2000);
          if (retry === 3) {
            NotificationService.error(e);
          }
        }
      }
    },

    checkIsUploaded(id) {
      this.$nextTick(() => {
        setTimeout(() => {
          const messages = this.globalMessages.messages;
          for (let i = 0; i < messages.length; i++) {
            if (messages[i].id === id && !messages[i].uploaded) {
              messages[i].uploaded = true;
            }
          }
          this.globalMessages.messages = messages;
        }, 4000);
      });
    },

    async getLastMessages() {
      if (this.blockLoad) {
        return true;
      }
      const sendObj = {
        user_id: this.selectedConversationId,
        event_id: this.getPickedEvent,
        elementsNumber: 1000,
        pageNumber: 1,
      };

      const messages = this.globalMessages.messages;

      messages
        .sort((a, b) => {
          return a.id - b.id;
        });

      if (messages.length > 0) {
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].id) {
            sendObj.last_message_id = messages[i].id;
            break;
          }
        }
      }
      try {
        const response = await MessengerService.GetMessages(sendObj);
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].uploaded = true;
        }
        this.globalMessages.messages = messages.concat(response.data);
        this.globalMessages.messages
          .sort((a, b) => {
            return a.id - b.id;
          });
        this.globalMessages.messages = this.globalMessages.messages
          .filter((thing, index, self) => index === self
            .findIndex((t) => (
              t.id === thing.id
            )));
        return true;
      } catch (e) {
        NotificationService.error(e);
        return false;
      }
    },
  },
};
