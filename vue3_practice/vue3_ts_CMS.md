## 项目搭建规范

### 代码规范

#### 集成editorconfig配置

EditorConfig 有助于为不同IDE编辑器上处理同一项目的多个开发人员维护一致的编码风格。

https://editorconfig.org

```yaml
[*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue}]   #适用的文件类型
charset = utf-8      #编码格式
indent_size = 2      #缩进大小
indent_style = space       #缩进风格(tab|space)
insert_final_newline = true     #在文件末尾插入一行空行
trim_trailing_whitespace = true    #去除行尾空白

end_of_line = lf      #换行符(lf|cr|crlf)
max_line_length = 100      #每行最大字符数
```

安装vscode插件：EditorConfig for VS Code

#### 使用prettier工具

 代码格式化工具

1. 安装prettier

   npm install prettier -D

2. 配置.prettierrc文件

   ```json
   {
     "$schema": "https://json.schemastore.org/prettierrc",
     "semi": false, 
     "singleQuote": true,
     "printWidth": 100
   }
   ```

3. 创建.prettierignore忽略文件

4. vscode安装插件：Prettier - Code formatter

#### 使用ESLint检测

1. vscode安装插件：ESLint

## 项目开发准备

### 目录结构划分

### CSS样式的重置

### 路由配置 - vue router

### 状态管理 - pinia

### 网络请求配置 - axios

### 区分开发环境和生产环境

1. 手动管理

2. 使用vite的环境变量

   vite在一个特殊的 import.meta.env 对象上暴露环境变量

   * import.meta.env.MODE:string    应用运行的模式
   * import.meta.env.PROD:boolean    应用是否运行在生产环境
   * import.meta.env.DEV:boolean    应用是否运行在开发环境
   * import.meta.env.SSR:boolean     应用是否运行在server上

3. 创建环境变量文件

   vite使用 dotenv 从环境目录的下列文件中加载额外的环境变量

   * .env  # 所有情况都加载
   * .env.local  # 所有情况都加载，会被git忽略
   * .env.[mode]  # 只在特定的模式下(开发|生产)加载
   * .env.[mode].local  # 只在特定的模式下(开发|生产)加载，会被git忽略

   只有以 VITE_  为前缀的变量才会暴露给经过 vite 处理的代码

   

### UI组件库的引入 - element plus

安装：npm install element-plus

引入

1. 完整引入

   ```ts
   // main.ts
   import { createApp } from 'vue'
   import ElementPlus from 'element-plus'
   import 'element-plus/dist/index.css'
   import App from './App.vue'
   
   const app = createApp(App)
   
   app.use(ElementPlus)
   app.mount('#app')
   ```

2. 按需导入

   1.  首先你需要安装`unplugin-vue-components` 和 `unplugin-auto-import`这两款插件：

      npm install -D unplugin-vue-components unplugin-auto-import

   2. 然后把下列代码插入到你的 `Vite` 的配置文件中：

      ```ts
      // vite.config.ts
      import { defineConfig } from 'vite'
      import AutoImport from 'unplugin-auto-import/vite'
      import Components from 'unplugin-vue-components/vite'
      import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
      
      export default defineConfig({
        plugins: [
          AutoImport({
            resolvers: [ElementPlusResolver()],
          }),
          Components({
            resolvers: [ElementPlusResolver()],
          }),
        ],
      })
      ```

## 登录页搭建

### 页面搭建

1. App根组件占满视图

   ```css
   .app {
     width: 100vw;
     height: 100vh;
   }
   ```

2. 搭建标题、记住密码、忘记密码、登录按钮

   ```js
     <div class="login">
       <h1>后台管理系统</h1>
       <LoginTabs ref="loginTabs" />
       <div class="controls">
         <el-checkbox v-model="keepPassword" label="记住密码" size="large" />
         <el-link type="primary">忘记密码</el-link>
       </div>
       <el-button class="subBtn" @click="submitInfo" type="primary" size="large">立即登录</el-button>
     </div>
   ```

3. 搭建tab页

   ```js
   <div class="tabs">
       <el-tabs type="border-card" :stretch="true" v-model="selectTab">
         <el-tab-pane label="帐号登录" name="account">
           <template #label>
             <div class="text">
               <div class="icon">
                 <el-icon><UserFilled /></el-icon>
               </div>
               <span>帐号登录</span>
             </div>
           </template>
           <el-form
             label-width="60px"
             :model="accountData"
             label-position="right"
             :rules="accountRules"
             status-icon
             ref="accountForm"
           >
             <el-form-item label="帐号" prop="userName">
               <el-input v-model="accountData.userName" />
             </el-form-item>
             <el-form-item label="密码" prop="password">
               <el-input v-model="accountData.password" show-password />
             </el-form-item>
           </el-form>
         </el-tab-pane>
         <el-tab-pane label="手机号登录" name="phone">
           <template #label>
             <div class="text">
               <div class="icon">
                 <el-icon><Cellphone /></el-icon>
               </div>
               <span>手机号登录</span>
             </div>
           </template>
           <el-form label-width="60px">
             <el-form-item label="手机号">
               <el-input></el-input>
             </el-form-item>
             <el-form-item label="验证码">
               <div class="verifyCode">
                 <el-input></el-input>
                 <el-button type="primary" class="verifyBtn">获取验证码</el-button>
               </div>
             </el-form-item>
           </el-form>
         </el-tab-pane>
       </el-tabs>
     </div>
   ```

### 数据绑定

| 元素        | 属性    | 含义                                                         |
| :---------- | ------- | ------------------------------------------------------------ |
| el-checkbox | v-model | 绑定多选框的选中状态                                         |
| el-tabs     | v-model | 绑定被选中的tab页，默认从0开始，可以配合el-tab-pane的name属性 |
| el-form     | model   | 数据对象                                                     |
| el-form     | rules   | 验证规则对象，需配合el-form-item的prop属性                   |
| el-input    | v-model | 数据对象                                                     |

```js
import { type FormRules, type ElForm, ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useLoginStore } from '@/store/login'

const loginStore = useLoginStore()
//获取选择的tab页
const selectTab = ref('account')
//获取表单组件实例对象
const accountForm = ref<InstanceType<typeof ElForm>>()
//获取父组件传递的keepPassword属性
const props = defineProps(['keepPassword'])
//表单数据
const accountData = reactive({
  userName: localStorage.getItem('username') || '',
  password: localStorage.getItem('password') || '',
})
```

### 表单验证规则配置

```js
const accountRules: FormRules = {
  userName: [
    {
      required: true,
      message: '请输入帐号!',
      trigger: 'blur',
    },
    {
      min: 6,
      max: 20,
      message: '用户名长度在6到20个字符',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码!',
      trigger: 'blur',
    },
    {
      min: 6,
      message: '密码长度不能小于6位',
      trigger: 'blur',
    },
  ],
}
```

### 登录逻辑实现及状态保存

```ts
// request/login/index.ts
import { request } from '..'
import { type IAccount } from '@/types'
//登录接口
export async function loginRequest(account: IAccount) {
  const res = (await request.post('/login', account)) as any
  return res
}
//获取用户信息接口
export async function userinfoRequest(id: number) {
  const res = (await request.get(`/user/${id}`)) as any
  return res
}
//检验token有效性接口
export async function tokenTestRequest() {
  await request.get('/test2')
}
```

```js
// views/login/components/LoginTabs.vue
//登录按钮逻辑
async function submit() {
  //账号密码登录逻辑
  if (selectTab.value === 'account') {
    //表单验证
    try {
      await accountForm.value?.validate()
    } catch (err: any) {
      ElMessage.error('表单验证失败' + err.message)
      return
    }

    //调用action方法
    loginStore
      .loginAccountAction({
        username: accountData.userName,
        password: accountData.password,
      })
      .then(() => {
        //登录成功
        if (props.keepPassword) {
          //记住密码逻辑
          localStorage.setItem('username', accountData.userName)
          localStorage.setItem('password', accountData.password)
          localStorage.setItem('keepPassword', 'true')
        } else {
          //未记住密码逻辑
          localStorage.removeItem('username')
          localStorage.removeItem('password')
          localStorage.removeItem('keepPassword')
        }
      })
      .catch((err) => {
        ElMessage.error(err.message)
      })
  } else {
    //手机号登录逻辑
    ElMessage.warning('手机号登录暂未开放')
  }
}
```

```ts
// store/login.ts
async function loginAccountAction(account: IAccount) {
    //发送请求得到结果
    const res = await loginRequest(account)
    //登录成功
    if (res.code === 0) {
      //存储用户信息及状态
      id.value = res.data.id
      token.value = res.data.token
      //本地存储token
      localStorage.setItem('token', token.value)
      //获取用户信息
      const info = await userinfoRequest(id.value)
      if (info.code === 0) {
        //成功获取用户信息
        userInfo.value = info.data
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      } else {
        return Promise.reject(Error(info.message))
      }
      //跳转到首页
      router.push('/home')
    } else {
      //登录失败
      return Promise.reject(Error(res.message))
    }
  }
```

### 导航守卫与退出登录

```ts
//  @/router/index.ts
//确定用户是否登录及token有效性
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
```

```vue
<template>
  <div class="home">
    home
    <button @click="checkOut">退出登录</button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
function checkOut() {
  localStorage.removeItem('token')   //清除本地token
  localStorage.removeItem('userInfo')
  router.push('/login')     //跳转页面
}
</script>
```

### 信息本地缓存

## 主页搭建

### 页面布局

```vue
<template>
  <div class="home">
    <el-container style="height: 100%">
      <el-aside width="200px" class="homeAside">
        <HomeAside />
      </el-aside>
      <el-container>
        <el-header class="header">
          <HomeHeader />
        </el-header>
        <el-main class="main">
          <HomeMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import HomeAside from './components/HomeAside.vue'
import HomeHeader from './components/HomeHeader.vue'
import HomeMain from './components/HomeMain.vue'
</script>
```

### 菜单栏搭建

```vue
<template>
  <div class="homeAside">
    <div class="logo">
      <img src="@/assets/img/logo.svg" />
      <h3>Vue-Ts-CMS</h3>
    </div>
    <div class="menu">
      <!-- 菜单 -->
      <el-menu
        active-text-color="#ffd04b"
        background-color="#001529"
        :default-active="`${menu[0].children[0].id}`"
        text-color="#fff"
      >
        <template v-for="item in menu" :key="item.id">
          <!-- 动态渲染菜单项 -->
          <el-sub-menu :index="item.id + ''">
            <template #title>
              <el-icon><component :is="item.icon"></component></el-icon>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="subItem.id + ''"
              class="menuItem"
            >
              <RouterLink :to="{ name: subItem.urlName }" active-class="active">{{
                subItem.name
              }}</RouterLink>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoginStore } from '@/store/login'
import { RouterLink } from 'vue-router'

const loginStore = useLoginStore()
//获取用户权限菜单
const menu = loginStore.userInfo.menus
</script>
```

### 顶部搭建

```vue
<template>
  <div class="homeHeader">
    <!-- 展开/收起菜单  面包屑 -->
    <div class="left">
      <el-icon size="30px" class="iconFold">
        <component is="Expand"></component>
      </el-icon>
      <div>
        面包屑
      </div>
    </div>
    <!-- 右侧控制按钮 -->
    <div class="right">
      <el-icon size="25px" class="iconControl"><Message /></el-icon>
      <el-icon size="25px" class="iconControl"><Notebook /></el-icon>
      <el-icon size="25px" class="iconControl"><TurnOff /></el-icon>
      <div class="iconControl">
        <!-- 头像 -->
        <el-avatar :size="35" src="" />
        <!-- 下拉菜单 -->
        <el-dropdown>
          <span class="userName"> {{ userInfo.username }} </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-icon><User /></el-icon>
                个人信息
              </el-dropdown-item>
              <el-dropdown-item>
                <el-icon><Lock /></el-icon>
                忘记密码
              </el-dropdown-item>
              <el-dropdown-item @click="checkOut" divided>
                <el-icon><CloseBold /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useLoginStore } from '@/store/login'
import { storeToRefs } from 'pinia'

const router = useRouter()
const { userInfo } = storeToRefs(useLoginStore())
//退出登录
function checkOut() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
}
</script>
```

### 内容区搭建

```vue
<template>
  <div class="homeMain">
    <RouterView />
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
</script>
```

### 路由配置

```ts
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
    		path: '/home/coretech',
    		component: () => import('@/views/homeMain/systemView/CoreTechnology.vue'),
  		},{
    		name: 'GoodStatic',
    		path: '/home/goodsta',
    		component: () => import('@/views/homeMain/systemView/GoodStatic.vue'),
  		},
        .......   //其他路由
      ],
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
```

### 菜单的折叠/展开



## 动态路由

静态路由的问题：注册了所有的路由，用户可通过直接输入路由以访问到无访问权限的页面

### 动态路由

通过用户的菜单信息动态地进行路由注册

设置动态路由的时机：

* 用户登录成功后
* 用户登录状态下刷新页面（因为刷新页面动态路由会丢失）

### 路由的抽取

将各权限菜单对应的各路由提取到各文件中

例如：

```ts
//   router/home/systemView/index.ts
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
```

### 用户菜单映射为路由对象数组

后端返回的用户菜单

```json
[
  {
    "id": 1,
    "name": "系统总览",
    "icon": "House",
    "children": [
      { "id": 11, "name": "核心技术", "urlName": "CoreTechnology", "children": null },
      { "id": 12, "urlName": "GoodStatic", "name": "商品统计", "children": null }
    ]
  },
  {
    "id": 2,
    "name": "系统管理",
    "icon": "Edit",
    "children": [
      { "id": 21, "name": "用户管理", "urlName": "UserManage", "children": null },
      { "id": 22, "name": "部门管理", "urlName": "DepartManage", "children": null },
      { "id": 23, "name": "菜单管理", "urlName": "MenuManage", "children": null },
      { "id": 24, "name": "角色管理", "urlName": "RoleManage", "children": null }
    ]
  },
  {
    "id": 3,
    "name": "商品中心",
    "icon": "ShoppingCart",
    "children": [
      { "id": 31, "name": "商品类别", "urlName": "GoodsCategory", "children": null },
      { "id": 32, "name": "商品信息", "urlName": "GoodsInfo", "children": null }
    ]
  },
  {
    "id": 4,
    "name": "随便聊聊",
    "icon": "ChatDotSquare",
    "children": [
      { "id": 41, "name": "你的故事", "urlName": "YourStory", "children": null },
      { "id": 42, "name": "故事列表", "urlName": "StoryList", "children": null }
    ]
  }
]
```

编写工具类实现用户菜单到路由的转换

```ts
//   utils/mapManus.ts
import systemView from '@/router/home/systemView'
import systemManage from '@/router/home/systemManage'
import goodCenter from '@/router/home/goodCenter'
import sayTalks from '@/router/home/sayTalks'
import { type RouteRecordRaw } from 'vue-router'

export function mapMenusToRoutes(menus: any) {
  const userRoutes: RouteRecordRaw[] = []

  for (const menu of menus) {
    const id = menu.id
    if (id === 1) {
      userRoutes.push(...systemView)
    } else if (id === 2) {
      userRoutes.push(...systemManage)
    } else if (id === 3) {
      userRoutes.push(...goodCenter)
    } else if (id === 4) {
      userRoutes.push(...sayTalks)
    }
  }
  return userRoutes
}
```

### 用户登录成功后设置动态路由

在loginAccountAction中设置动态路由

```ts
const userRoutes = mapMenusToRoutes(userInfo.value.menus)
//动态添加路由
for (const route of userRoutes) {
    router.addRoute('Home', route)
}
```

### 用户登录状态下刷新页面设置动态路由

在 store/login.ts 中编写 action ，将原加载本地缓存逻辑提取到该函数

```ts
//加载本地缓存并设置动态路由
  function loadLocalstoreAction() {
    //从本地存储中获取用户信息及状态
    const localToken = localStorage.getItem('token')
    const localUserInfo = localStorage.getItem('userInfo')
    if (localToken && localUserInfo) {
      token.value = localToken
      userInfo.value = JSON.parse(localUserInfo)
    } else {
      return
    }

    const userRoutes = mapMenusToRoutes(userInfo.value.menus)
    //动态添加路由
    for (const route of userRoutes) {
      router.addRoute('Home', route)
    }
  }
```

更新 store/index.ts 及 main.ts 逻辑，在重新加载应用时调用 loadLocalstoreAction 实现动态路由的持久化

```ts
// store/index.ts
import { createPinia } from 'pinia'
import { useLoginStore } from './login'
import type { App } from 'vue'

const pinia = createPinia()
function registerStore(app: App) {
  app.use(pinia)
  const { loadLocalstoreAction } = useLoginStore()
  loadLocalstoreAction()
}
export default registerStore
```

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import registerStore from './store'
import router from '@/router'
import 'normalize.css'
import '@/assets/css/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

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
```

### 面包屑实现

面包屑组件

```vue
<el-breadcrumb separator-icon="ArrowRightBold">
     <el-breadcrumb-item
       v-for="item in breadcrumb"
       :key="item.id"
       :to="{ name: item.pathName }"
     >
       {{ item.label }}
     </el-breadcrumb-item>
</el-breadcrumb>
```

封装函数实现通过当前路径获取面包屑

```ts
//根据当前路径获取面包屑数据
export function mapPathToBreadcrumb(pathName: any, userMenus: any) {
  let breadcrumb
  for (const menu of userMenus) {
    for (const item of menu.children) {
      if (item.urlName === pathName) {
        breadcrumb = [
          {
            id: menu.id,
            label: menu.name,
            pathName: menu.children[0].urlName,
          },
          {
            id: item.id,
            label: item.name,
            pathName: item.urlName,
          },
        ]
      }
    }
  }
  return breadcrumb
}
```

调用函数获取数据，通过计算属性动态改变

```ts
import { useRoute } from 'vue-router'
import { useLoginStore } from '@/store/login'

const { userInfo } = storeToRefs(useLoginStore())
const route = useRoute()
//面包屑获取, 监听路由变化
const breadcrumb = computed(() => {
  return mapPathToBreadcrumb(route.name, userInfo.value.menus)
})
```









