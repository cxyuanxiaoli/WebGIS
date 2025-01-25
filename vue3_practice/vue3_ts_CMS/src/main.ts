import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import pinia from './store'
import 'normalize.css'
import '@/assets/css/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
//路由
app.use(router)
//状态管理
app.use(pinia)
//ui组件库，图标库
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
