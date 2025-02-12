import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import 'normalize.css'
import '@/assets/css/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import registerStore from './store'

const app = createApp(App)

//状态管理
app.use(registerStore)
//路由
app.use(router)
//ui组件库，图标库
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
