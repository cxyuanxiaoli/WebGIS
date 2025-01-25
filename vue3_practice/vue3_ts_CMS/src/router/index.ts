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

//确定用户是否登录
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.path === '/home' && !token) {
    return '/login'
  }
})

export default router
