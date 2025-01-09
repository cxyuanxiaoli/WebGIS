# Vue3

## Vue3简介

### 创建vue3工程

1. 基于 vue-cli 创建

2. 基于 vite 创建

   [Vite | 下一代的前端工具链](https://cn.vite.dev/)

   轻量快速的热重载（HMR），能实现极速的服务启动

   对TypeScript、JSX、CSS等支持开箱即用

   真正的按需编译，不再等待整个应用编译完成

   创建项目：[快速上手 | Vue.js](https://cn.vuejs.org/guide/quick-start.html)

### 项目目录

<img src="C:\Users\86132\AppData\Roaming\Typora\typora-user-images\image-20250109212333619.png" alt="image-20250109212333619" style="zoom:50%;" />

### 简单效果-vue2写法

Person.vue

```vue
<template>
  <div class="person">
    <h2>name:{{ name }}</h2>
    <h2>age:{{ age }}</h2>
    <button @click="changeName">changeName</button>
    <button @click="changeAge">changeName</button>
    <button @click="showTel">show Tel</button>
  </div>
</template>

<script lang="ts">
export default{
  name:'Person',
  data(){
    return{
      name:'zhangsan',
      age:20,
      tel:'13800138000'
    }
  },
  methods:{
    changeName(){
      this.name='lisi'
    },
    changeAge(){
      this.age+=1
    },
    showTel(){
      alert(this.tel)
    }
  }

}
</script>

<style scoped>
.person{
  background-color: skyblue;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  border-radius: 10px;
  padding: 10px;
}
button{
  margin: 0 5px;
}
</style>
```

App.vue

```vue
<template>
<!-- html -->
 <div class="app">
  <h1>Hello</h1>
  <Person></Person>
 </div>
</template>

<script lang="ts">
//js ts
import Person from './components/Person.vue'
export default {
  name : 'App',
  components:{   //register components
    Person
  }
}
</script>

<style>
/* css */
.app{

  background-color: #ddd;
  box-shadow: 5px 5px 10px #000;
  padding: 20px;
  border-radius: 10px;
}
</style>
```

## Vue3核心语法

### OptionsAPI and CompositionAPI

OptionsAPI 弊端：数据、方法、计算属性等，是分散在 data、methods、computed中的，若想新增或修改一个需求，就需要分别修改三个选项代码，不便于维护和复用。

```js
export default{
    data(){
        return {
            
        };
    },
    methods:{
        
    },
    computed:{
        
    },
    watch:{
        
    }
}
```

Composition API 优势

让相关的功能的代码更加有序的组织在一起。

### setup

1. setup 是一个函数，与 vue2 各选项并列
2. setup 中直接写数据和方法，用 return 返回
3. setup 中没有 this 
4. setup 的返回值也可以是一个渲染函数
5. setup 可以和 data、methods 等选项共存，且选项可以读取setup 中的属性，但 setup 无法读取选项中的属性

#### setup 语法糖

直接将 setup 写在 script 标签上，在标签里直接写数据和方法等，且不用写 return 进行返回

```js
<script lang="ts" setup>
//data
let name = 'zhangsan'
//methods
function changeName() {
  name = 'lisi'
}
</script>
```

当组件 name值 与组件名不一致时需要单独配置：

1. 安装插件 npm i vite-plugin-vue-setup-extend -D

2. 在 vite.config.ts 中添加代码

   ```js
   import viteSetupExtend from 'vite-plugin-vue-setup-extend'
   
   // https://vite.dev/config/
   export default defineConfig({
     plugins: [
       viteSetupExtend(),
     ],
   })
   ```

3. 在 script 标签配置组件名称

   ```js
   <script lang="ts" setup name="PersonVue23">
   
   </script>
   ```

   