import { createRouter, createWebHistory } from 'vue-router'
import { tokenTestRequest } from '@/request/login'
import { ElMessage } from 'element-plus'

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
      redirect: '/home/coretech',
      component: () => import('@/views/home/Home.vue'),
      children: [],
    },
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/views/login/Login.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('@/views/notfound/NotFound.vue'),
    },
  ],
})

//确定用户是否登录
router.beforeEach(async (to) => {
  const token = localStorage.getItem('token')

  if (to.path.startsWith('/home')) {
    if (!token) {
      return '/login'
    } else {
      try {
        await tokenTestRequest()
      } catch (err: any) {
        ElMessage.error(err.message)
        return '/login'
      }
    }
  }
})

export default router
