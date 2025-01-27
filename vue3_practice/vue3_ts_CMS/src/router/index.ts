import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login/Login.vue'
import NotFound from '@/views/notfound/NotFound.vue'
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
      children: [
        {
          name: 'CoreTechnology',
          path: 'coretech',
          component: () => import('@/views/homeMain/systemView/CoreTechnology.vue'),
        },
        {
          name: 'GoodStatic',
          path: 'goodsta',
          component: () => import('@/views/homeMain/systemView/GoodStatic.vue'),
        },
        {
          name: 'UserManage',
          path: 'usermana',
          component: () => import('@/views/homeMain/systemManage/UserManage.vue'),
        },
        {
          name: 'DepartManage',
          path: 'departmana',
          component: () => import('@/views/homeMain/systemManage/DepartManage.vue'),
        },
        {
          name: 'MenuManage',
          path: 'menumana',
          component: () => import('@/views/homeMain/systemManage/MenuManage.vue'),
        },
        {
          name: 'RoleManage',
          path: 'rolemana',
          component: () => import('@/views/homeMain/systemManage/RoleManage.vue'),
        },
        {
          name: 'GoodsCategory',
          path: 'goodscate',
          component: () => import('@/views/homeMain/goodCenter/GoodsCategory.vue'),
        },
        {
          name: 'GoodsInfo',
          path: 'goodsinfo',
          component: () => import('@/views/homeMain/goodCenter/GoodsInfo.vue'),
        },
        {
          name: 'YourStory',
          path: 'yoursto',
          component: () => import('@/views/homeMain/sayTalks/YourStory.vue'),
        },
        {
          name: 'StoryList',
          path: 'storyli',
          component: () => import('@/views/homeMain/sayTalks/StoryList.vue'),
        },
      ],
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
