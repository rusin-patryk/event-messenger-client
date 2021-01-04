export default [
  {
    path: '/',
    name: 'Auth',
    component: () => import('../AuthView.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/auth/Login.vue'),
        meta: {
          title: 'Login',
          public: true,
          admin: false,
        },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../views/auth/Register.vue'),
        meta: {
          title: 'Sign Up',
          public: true,
          admin: false,
        },
      },
      {
        path: 'remind-password',
        name: 'Remind password',
        component: () => import('../views/auth/RemindPassword.vue'),
        meta: {
          title: 'Remind password',
          public: true,
          admin: false,
        },
      },
      {
        path: 'reset-password/:token',
        name: 'Reset password',
        component: () => import('../views/auth/ResetPassword.vue'),
        meta: {
          title: 'Reset password',
          public: true,
          admin: false,
        },
      },
      {
        path: 'activate-account/:token',
        name: 'Activate account',
        component: () => import('../views/auth/ActivateAccount.vue'),
        meta: {
          title: 'Activate account',
          public: true,
          admin: false,
        },
      },
    ],
  },
];
