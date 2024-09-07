import { createRouter, createWebHashHistory } from 'vue-router'
import Style from '@/views/StatusView.vue'
import Home from '@/views/HomeView.vue'
import { useUserStore } from '@/stores/userStore';  // Import the user store

const routes = [
  {
    meta: {
      title: 'Select style'
    },
    path: '/',
    name: 'style',
    component: Style,
    // beforeEnter: async (to, from, next) => {
    //   const userStore = useUserStore();
    //   await userStore.fetchUser();  // Ensure the user data is loaded before navigation

    //   if (userStore.userStatus) {
    //     // If user already has a status, redirect to the dashboard
    //     next({ name: 'dashboard' });
    //   } else {
    //     // If user has no status (null or empty), allow access to the style page
    //     next();
    //   }
    // }
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/dashboard',
    name: 'dashboard',
    component: Home
  },
  {
    meta: {
      title: 'Tables'
    },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue')
  },
  {
    meta: {
      title: 'Forms'
    },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Ui'
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue')
  },
  {
    meta: {
      title: 'Responsive layout'
    },
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: {
      title: 'Error'
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
