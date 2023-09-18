import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/password',
    name: 'password',
    component: () => import('@/views/password.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const WHILE_LIST = ['/login', '/register']
router.beforeEach((to, from, next) => {
  let token = Cookies.get('token')
  if (!WHILE_LIST.includes(to.path) && !token) {
    router.push('/login')
  } else {
    next()
  }
})

export default router
