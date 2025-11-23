import { createRouter, createWebHistory } from "vue-router"
import Home from '@/views/Home.vue'
import News from '@/views/News.vue'
import About from '@/views/About.vue'
import Detail from '@/views/Detail.vue'

const router = createRouter({
  history: createWebHistory(),  //工作模式
  routes: [{
    name: 'shouye',
    path: '/home',
    component: Home
  }, {
    name: 'xinwen',
    path: '/news',
    component: News,
    children: [{
      name: 'xijie',
      path: 'detail/:id/:title/:content',
      component: Detail,

      props: true

      // props(to) {
      //   return to.params
      // }

      // props:{
      //   id:'1',
      //   title:'2',
      //   content:'3'
      // }
    }]
  }, {
    name: 'guanyu',
    path: '/about',
    component: About
  }, {
    path: '/',
    redirect: '/home'
  }]
})

export default router