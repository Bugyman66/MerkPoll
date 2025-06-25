import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import WalletLogin from '../views/WalletLogin.vue'
import Elections from '../views/Elections.vue'
import Vote from '../views/Vote.vue'
import Admin from '../views/Admin.vue'
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
    path: '/vote/:id',
    name: 'Vote',
    component: Vote,
    props: true
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
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
