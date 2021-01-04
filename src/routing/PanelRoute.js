export default [
  {
    path: '/',
    name: 'Panel',
    component: () => import('../PanelView.vue'),
    children: [
      {
        path: '/dashboard/',
        name: 'Dashboard',
        component: () => import('../views/user/Dashboard.vue'),

        meta: {
          title: 'Dashboard',
          public: false,
          admin: false,
        },
      },
      {
        path: '/files/',
        name: 'Files',
        component: () => import('../views/user/Files.vue'),

        meta: {
          title: 'Files',
          public: false,
          admin: false,
        },
      },
      {
        path: '/messenger/',
        name: 'Messenger',
        component: () => import('../views/user/Messenger/Messenger.vue'),

        meta: {
          title: 'Messenger',
          public: false,
          admin: false,
        },
      },
      {
        path: '/faq/',
        name: 'FAQ',
        component: () => import('../views/user/FAQ.vue'),

        meta: {
          title: 'FAQ',
          public: false,
          admin: false,
        },
      },
      {
        path: '/events/',
        name: '[A] Events',
        component: () => import('../views/admin/Events.vue'),

        meta: {
          title: 'Events',
          public: false,
          admin: true,
        },
      },
      {
        path: '/users/',
        name: '[A] Users',
        component: () => import('../views/admin/Users.vue'),

        meta: {
          title: 'Users',
          public: false,
          admin: true,
        },
      },
      {
        path: '*',
        name: 'Not Found',
        component: () => import('../views/NotFound.vue'),

        meta: {
          title: 'Not Found',
          public: false,
          admin: false,
        },
      },
    ],
  },
];
