import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import WalletLogin from '../views/WalletLogin.vue'
import Elections from '../views/Elections.vue'
import VoteSimple from '../views/VoteSimple.vue'
import AdminSimple from '../views/AdminSimple.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: WalletLogin
  },
  {
    path: '/elections',
    name: 'Elections',
    component: Elections
  },
  {
    path: '/vote/id/:id',
    name: 'VoteById',
    component: VoteSimple,
    props: true
  },
  {
    path: '/vote/:slug',
    name: 'Vote',
    component: () => import('../views/Vote.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminSimple,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
