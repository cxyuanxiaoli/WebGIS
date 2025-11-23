import { type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'UserManage',
    path: '/home/usermana',
    component: () => import('@/views/homeMain/systemManage/UserManage.vue'),
  },
  {
    name: 'DepartManage',
    path: '/home/departmana',
    component: () => import('@/views/homeMain/systemManage/DepartManage.vue'),
  },
  {
    name: 'MenuManage',
    path: '/home/menumana',
    component: () => import('@/views/homeMain/systemManage/MenuManage.vue'),
  },
  {
    name: 'RoleManage',
    path: '/home/rolemana',
    component: () => import('@/views/homeMain/systemManage/RoleManage.vue'),
  },
]
export default routes
