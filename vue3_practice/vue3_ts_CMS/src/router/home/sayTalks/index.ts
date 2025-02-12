import { type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'YourStory',
    path: '/home/yoursto',
    component: () => import('@/views/homeMain/sayTalks/YourStory.vue'),
  },
  {
    name: 'StoryList',
    path: '/home/storyli',
    component: () => import('@/views/homeMain/sayTalks/StoryList.vue'),
  },
]
export default routes
