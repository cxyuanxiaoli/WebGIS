# Vite

## rollup

打包特点：

* 不会生成过多的运行代码
* 可以多模块化规范打包 esm,cjs...

### rollup核心配置

```js
module.exports={
    input,
    output:{
        dir,
        file,
        format,
    },
    external,
    plugins,
}
```

```js
const nodeResolve=require('@rollup/plugin-node-resolve');
module.exports={
  input:'./app.js',
  output:{
    file:'dist/bundle.js',
    format:'es'    //es,cjs,umd,amd,iife
  },
  plugins:[nodeResolve()],
  external:['lodash-es']
}
```

## Vite

1. Vite最大的特点是利用esm，让代码不像传统的构建工具一样去分析引入，打包构建，而是直接保持模块化，这样省去了大量的编译时间，让代码更改后的响应速度大量提升
2. 构建方面，vite使用rollup打包

### 基本处理流程

* 安装Vite
* 指定一个html为入口
* Vite build(构建)   Vite(开发)

### 处理各种资源

* 天生支持css以及预处理语言
* 支持typescript
* 能处理各种资源

### Vite配置

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

module.exports=defineConfig({
  //生产配置
  build:{
    assetsInlineLimit:2000,   //图片转base64
  },
  //开发配置
  server:{
    port:8000,
    proxy:{
      '/api':{
        target:'http://localhost:8080',
        rewrite:(path)=>{
          return path.replace(/^\/api/, '')
        }
      }
    },
    header:{

    }
  },
  resolve:{
    //别名配置
    alias:{
      '@':__dirname+'/src'
    },
    //省略后缀配置
    extensions:['.js','.ts','.css']
  },
  plugins: [vue()],   //vue插件以支持vue
  esbuild:{
    //配置以支持jsx
    jsxFactory:"h",
    jsxFragment:"Fragment",
    jsxInject:"import {h} from 'vue'"
  }
})
```

```js
//main.js
import a from "./tsmode.ts"
import img from './123.jpg'
import "./index.css"
import './test.less' 
import { createApp } from "vue"
import App from "./App.vue"

console.log(a); // output: 1
import('./mode1').then(module => {
  console.log(module.default()); 
})
const image=new Image();
image.src=img;
document.body.appendChild(image);

createApp(App).mount('#app')
```

### 代码分割

Vite会自动拆分异步模块，第三方库及特殊拆分需要进行额外配置

```js
build:{
    assetsInlineLimit:2000,
    rollupOptions:{
      input:'index.html',   //入口文件，默认值
      output:{
        entryFileNames:'bundle.[hash].js',
        chunkFileNames:'[name].chunk.js',
        // manualChunks:{
        //   vendor:['vue']
        // },
        manualChunks:(id)=>{     //定义拆分规则
          if(id.includes('node_modules')){
            return 'vendor'
          }
        }
      }
    }
  },
```

### 自带模板仓库

```powershell
npm create vite@latest my-vue-app --template vue
```

### Vite好用插件

* vitejs-plugin-legacy    编译为旧浏览器可运行的代码
* unplugin-vue-components    自动引入组件
* unplugin-auto-import     自动引入vue-api  (ref...)
* vite-plugin-compression    压缩
* vite-plugin-imagemin   压缩图片











