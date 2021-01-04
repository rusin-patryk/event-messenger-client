<template>
  <v-row
    class="align-center users-table"
    justify="center"
  >
    <v-col
      class="pl-lg-16 pr-lg-16 pl-sm-10 pr-sm-10"
      cols="12"
      xs="12"
    >
      <v-skeleton-loader
        :loading="loading"
        type="table"
      >
        <v-data-table
          :headers="headers"
          :items="usersFilter()"
          class="elevation-1"
          sort-by="last_name"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Users list</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-btn
                icon
                norm
                @click="getEvents"
              >
                <v-icon size="20">fas fa-sync</v-icon>
              </v-btn>
              <v-divider
                class="mx-4 ml-2"
                inset
                vertical
              ></v-divider>
              <v-text-field
                v-model="searchValue"
                :disabled="loading"
                :loading="loading"
                class="mt-3 ml-1 mr-1"
                dense
                label="Search..."
                prepend-inner-icon="fas fa-search"
                solo
                style="max-width: 240px; margin-top: 0 !important;"
                @input="onSearch"
              ></v-text-field>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-select
                v-model="filterBy"
                :disabled="loading"
                :items="events"
                :loading="loading"
                dense
                item-text="title"
                item-value="id"
                label="Event filter"
                solo
                style="max-width: 240px; margin-top: 0 !important;"
              ></v-select>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-btn
                :disabled="loading"
                :loading="loading"
                class="mb-1 mt-1"
                color="base"
                dark
                @click.stop="createUser"
              >Create
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.email="{ item }">
            <span class="font-weight-medium">
              <a
                v-if="item.email"
                :href="`mailto:${item.email}`"
                class="table-link"
              >{{ item.email }}</a>
            </span>
            <br>
            <a
              v-if="item.phone_number"
              :href="`tel:${item.phone_number}`"
              class="table-link"
            >{{ item.phone_number }}</a>
          </template>
          <template v-slot:item.company_name="{ item }">
            <span class="font-weight-medium">{{ item.company_name }}</span><br>
            {{ item.description }}
          </template>
          <template v-slot:item.events="{ item }">
            <div v-if="item.events && item.events.length > 0">
              <v-chip
                v-for="event in item.events.slice(0, 2)"
                :key="`${event.id}-x`"
                class="mr-2 mt-1 mb-1 pa-2"
                small
              >
                <span style="font-size: 14px">
                  {{ event.title.length > 20 ? `${event.title.slice(0, 18)}...` : event.title }}
                </span>
              </v-chip>
              <v-tooltip
                v-if="item.events.length > 2"
                right
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2 mt-1 mb-1 pa-2 font-weight-bold"
                    small
                    style="font-size: 14px"
                  >
                    ...
                  </v-chip>
                </template>
                <span
                  v-for="(event, index) in item.events.slice(2, item.events.length)"
                  :key="index"
                  class="font-weight-medium"
                  style="font-size: 14px"
                >
                  <span v-if="index > 0">, </span>
                  {{ event.title.length > 20 ? `${event.title.slice(0, 18)}...` : event.title }}
                </span>
              </v-tooltip>
            </div>
            <div v-else>
              No events
            </div>
          </template>
          <template v-slot:item.created_at="{ item }">
            {{ item.created_at | formatDate }}
            <span class="mr-2 ml-1">|</span>
            <v-icon
              v-if="!!item.is_active"
              size="18"
              color="green"
            >
              fas fa-check
            </v-icon>
            <v-icon
              v-else
              size="18"
              color="red"
            >
              fas fa-times
            </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              color="green darken-1"
              icon
              v-if="!item.is_active"
              @click.stop="activateUser(item.id)"
            >
              <v-icon size="18">
                fas fa-check-circle
              </v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              color="red darken-2"
              icon
              v-if="userInfo && userInfo.user && userInfo.user.id !== item.id"
              @click.stop="askForDelete(item.id)"
            >
              <v-icon size="18">
                fas fa-trash
              </v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              color="primary"
              icon
              @click.stop="assignUser(item)"
            >
              <v-icon size="18">
                fas fa-calendar-check
              </v-icon>
            </v-btn>
          </template>
          <template v-slot:no-data>
            No data
          </template>
        </v-data-table>
      </v-skeleton-loader>
      <AssignUser
        v-if="assign.dialog"
        :id="assign.id"
        :dialog="assign.dialog"
        :events="eventsList"
        :loading="loading"
        :name="`${assign.first_name} ${assign.last_name}`"
        :selected-events="assign.events"
        @closeDialog="closeAssignDialog"
      />
      <TextEditor
        v-if="createDialog"
        :dialog="createDialog"
        :fields="['name', 'wysiwyg']"
        :loading="loading"
        :textLimit="6000"
        :title="'Create event'"
        @closeDialog="closeCreateDialog"
      />
      <TextEditor
        v-if="edit.dialog"
        :content="edit.content"
        :data="edit"
        :dialog="edit.dialog"
        :fields="['name', 'wysiwyg']"
        :loading="loading"
        :name="edit.title"
        :textLimit="6000"
        :title="'Edit event'"
        @closeDialog="closeEditDialog"
      />
      <Confirmation
        :id="deleteId"
        :dialog="confirm"
        :loading="loading"
        @closeDialog="deleteUser"
      />
      <CreateUser
        :dialog="createUserDialog"
        @closeDialog="createUserDialog = false"
      />
    </v-col>
  </v-row>
</template>

<script>
import AssignUser from '@/components/Users/AssignUser';
import TextEditor from '@/components/Common/TextEditor';
import Confirmation from '@/components/Common/Confirmation';
import UsersService from '@/common/UserService';
import NotificationService from '@/common/NotificationService';
import CreateUser from '@/components/Users/CreateUser';
import EventsService from '@/common/EventsService';
import StorageService from '@/common/StorageService';

export default {
  name: 'Users',

  data: () => ({
    users: [],
    createUserDialog: false,
    loading: true,
    edit: {dialog: false, content: '', name: ''},
    assign: {
      dialog: false, id: null, events: null, first_name: '', last_name: '',
    },
    createDialog: false,
    deleteId: null,
    searchValue: '',
    confirm: false,
    filterBy: 0,
    filteredUsers: [],
    events: [],
    eventsList: [],
    userInfo: null,
    headers: [
      {
        text: 'First name', value: 'first_name',
      }, {
        text: 'Last name', value: 'last_name',
      }, {
        text: 'E-mail, Phone', value: 'email',
      }, {
        text: 'Company name, Role', value: 'company_name',
      }, {
        text: 'Events', value: 'events',
      }, {
        text: 'Created at | Active', value: 'created_at',
      }, {
        text: 'Actions', value: 'actions', sortable: false, align: 'end',
      },
    ],
  }),

  components: {
    TextEditor,
    Confirmation,
    AssignUser,
    CreateUser,
  },

  mounted() {
    this.getEvents();
  },

  methods: {
    async getEvents() {
      this.loading = true;
      try {
        const events = await EventsService.getAllEvents({
          sortBy: 'created_at',
          orderBy: 'desc',
        });
        this.eventsList = JSON.parse(JSON.stringify(events));
        this.events = events;
        this.events.unshift(...[{id: 0, title: 'All events'}]);
        this.getUsers();
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    async getUsers() {
      this.loading = true;
      try {
        const response = await UsersService.getAllUsers({
          sortBy: 'last_name',
          orderBy: 'asc',
          elementsNumber: 2000,
          pageNumber: 1,
        });
        this.users = response.data;
        this.userInfo = StorageService.getUserInfo();
        this.onSearch();
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    assignUser(user) {
      user.dialog = true;
      this.assign = JSON.parse(JSON.stringify(user));
    },

    async closeAssignDialog(obj) {
      if (!obj) {
        this.assign = {
          dialog: false, id: null, events: null, first_name: '', last_name: '',
        };
        return;
      }
      this.loading = true;
      try {
        await UsersService.assignEvents(obj.id, {eventIds: obj.selectedEvents});
        await this.getUsers();
        this.assign = {
          dialog: false, id: null, events: null, first_name: '', last_name: '',
        };
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    async activateUser(id) {
      if (!id) {
        return;
      }
      this.loading = true;
      try {
        await UsersService.activateUser(id);
        await this.getUsers();
        NotificationService.success('User has been activated.');
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    usersFilter() {
      if (this.filterBy) {
        const users = [];
        this.filteredUsers.forEach((user) => {
          user.events.forEach((event) => {
            if (event.id === this.filterBy) {
              users.push(user);
            }
          });
        });
        return users;
      } else {
        return this.filteredUsers;
      }
    },

    createUser() {
      this.createUserDialog = true;
    },

    askForDelete(id) {
      this.deleteId = JSON.parse(JSON.stringify(id));
      if (this.confirm) {
        this.confirm = false;
      }

      this.confirm = true;
    },

    async deleteUser(id) {
      this.deleteId = null;
      if (!id) {
        this.confirm = false;
        return;
      }
      this.loading = true;
      try {
        await UsersService.deleteUser(id);
        await this.getUsers();
        this.edit = {dialog: false, content: '', name: ''};
        this.confirm = false;
        this.loading = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    editUser(user) {
      this.edit = JSON.parse(JSON.stringify(user));
      if (this.edit.dialog) {
        this.edit.dialog = false;
      }

      this.edit.dialog = true;
    },

    async closeEditDialog(data) {
      if (!data) {
        this.edit = {dialog: false, content: '', name: ''};
        return;
      }
      this.loading = true;
      try {
        await UsersService.updateUser(data.data.id, {
          title: data.name,
          content: data.content,
        });
        await this.getUsers();
        this.edit = {dialog: false, content: '', name: ''};
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },

    onSearch() {
      this.filteredUsers = this.users.filter((user) => {
        return user.first_name.toLowerCase().search(this.searchValue.toLowerCase()) >= 0
          || user.last_name.toLowerCase().search(this.searchValue.toLowerCase()) >= 0
          || user.company_name.toLowerCase().search(this.searchValue.toLowerCase()) >= 0
          || user.email.toLowerCase().search(this.searchValue.toLowerCase()) >= 0
          || user.phone_number.toLowerCase().search(this.searchValue.toLowerCase()) >= 0
          || user.description.toLowerCase().search(this.searchValue.toLowerCase()) >= 0;
      });
    },

    async closeCreateDialog(data) {
      if (!data) {
        this.createDialog = false;
        return;
      }
      this.loading = true;
      try {
        await UsersService.createUser({
          title: data.name,
          content: data.content,
        });
        await this.getUsers();
        this.createDialog = false;
      } catch (e) {
        NotificationService.error(e);
        this.loading = false;
      }
    },
  },
};
</script>
