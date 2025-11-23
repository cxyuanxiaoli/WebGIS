import { type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'CoreTechnology',
    path: '/home/coretech',
    component: () => import('@/views/homeMain/systemView/CoreTechnology.vue'),
  },
  {
    name: 'GoodStatic',
    path: '/home/goodsta',
    component: () => import('@/views/homeMain/systemView/GoodStatic.vue'),
  },
]
export default routes
