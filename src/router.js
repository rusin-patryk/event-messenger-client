import Vue from 'vue';
import Constants from '@/common/Constants';
import Router from 'vue-router';
import NotificationService from '@/common/NotificationService';
import StorageService from '@/common/StorageService';
import AuthRoutes from './routing/AuthRoute.js';
import PanelRoutes from './routing/PanelRoute.js';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    ...AuthRoutes,
    ...PanelRoutes,
  ],
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);
  const isAdminArea = to.matched.some(record => record.meta.admin);
  const loggedIn = StorageService.isLoggedIn();
  const isAdmin = StorageService.isAdmin();
  if ((!isPublic && !loggedIn) || (to.fullPath === '/' && !loggedIn)) {
    if (to.fullPath !== '/') {
      NotificationService.error(Constants('UNAUTHORIZED'), {labels: {alert: 'Error'}});
    }
    return next({
      path: '/login',
    });
  } else if ((isPublic && loggedIn) || (to.fullPath === '/' && loggedIn)) {
    return next({
      path: '/dashboard',
    });
  }
  if (isAdminArea && !isAdmin) {
    NotificationService.warning(Constants('NOT_ALLOWED'), {labels: {alert: 'Warning'}});
    return next({
      path: '/dashboard',
    });
  }
  return next();
});
export default router;
