import { type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'GoodsCategory',
    path: '/home/goodscate',
    component: () => import('@/views/homeMain/goodCenter/GoodsCategory.vue'),
  },
  {
    name: 'GoodsInfo',
    path: '/home/goodsinfo',
    component: () => import('@/views/homeMain/goodCenter/GoodsInfo.vue'),
  },
]
export default routes
