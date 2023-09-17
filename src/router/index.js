import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/index.vue')
  }
  //   {
  //     path: '/home',
  //     name: 'home',
  //     component: () => import('../views/home.vue')
  //   },
  //   {
  //     path: '/login',
  //     name: 'login',
  //     component: () => import('../views/login.vue')
  //   }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  next()
  // 判断有没有登录
  //   if (!localStorage.getItem('token')) {
  //     if (to.name == 'login') {
  //       next()
  //     } else {
  //       router.push('login')
  //     }
  //   } else {
  //     next()
  //   }
})

export default router
