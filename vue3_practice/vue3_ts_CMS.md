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

      

