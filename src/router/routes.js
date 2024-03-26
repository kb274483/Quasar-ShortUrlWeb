import initializeStore  from '../store';
const store = initializeStore();

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/history',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '',
        component: () => import('pages/ShortUrlHistory.vue'),
        beforeEnter: (to, from, next) => {
          if (store.state.module.isLoginStatus) {
            next();
          } else {
            next('/'); 
          }
        }
      }
    ]
  },
  {
    path: '/schedule',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '',
        component: () => import('pages/Schedule.vue'),
        beforeEnter: (to, from, next) => {
          if (store.state.module.isLoginStatus) {
            next();
          } else {
            next('/'); 
          }
        }
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
]

export default routes
