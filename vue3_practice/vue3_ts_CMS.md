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

```js
//登录按钮逻辑
function submit() {
  //表单验证
  accountForm.value?.validate((valid) => {
    if (valid) {
      //账号密码登录逻辑
      if (selectTab.value === 'account') {
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
      } else {
        //手机号登录逻辑
        ElMessage.warning('手机号登录暂未开放')
      }
    } else {
      ElMessage.error('请输入正确信息')
    }
  })
}
```

```ts
async function loginAccountAction(account: IAccount) {
    //发送请求得到结果
    const res = await accountRequest(account)
    //登录成功
    if (res.code === 0) {
      //存储用户信息及状态
      id.value = res.data.id
      name.value = res.data.name
      token.value = res.data.token
      //本地存储token
      localStorage.setItem('token', token.value)
      //跳转到首页
      router.push('/home')
    } else {
      //登录失败
      ElMessage.error(res.message)
      return Promise.reject()
    }
  }
```

### 导航守卫与退出登录

```ts
//  @/router/index.ts
//确定用户是否登录
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.path === '/home' && !token) {
    return '/login'
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
  router.push('/login')     //跳转页面
}
</script>
```

### 信息本地缓存









