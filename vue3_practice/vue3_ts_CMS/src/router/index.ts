import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login/Login.vue'
import NotFound from '@/views/notfound/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: 'Home',
      path: '/home',
      component: () => import('@/views/home/Home.vue'),
    },
    {
      name: 'Login',
      path: '/login',
      component: Login,
    },
    {
      path: '/:pathMatch(.*)',
      component: NotFound,
    },
  ],
})

export default router
