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


### 响应式数据

#### ref

1. 创建基本类型的响应式数据

   导入 ref :  import { ref }  from 'vue'

   使用 ref (value)  创建基本类型响应式数据: let name = ref ( 'zhangsan' )

   修改响应式数据的值 : name.value = 'lisi'

   在 template 中 变量名 name 即代表 name.value

<img src="C:\Users\86132\AppData\Roaming\Typora\typora-user-images\image-20250110205836212.png" alt="image-20250110205836212" style="zoom:50%;" />

1. 创建对象类型的响应式数据 

   与上面一致，需注意 obj.value 表示原对象

   ref 创建对象类型响应式数据是使用 reactive 实现

   <img src="C:\Users\86132\AppData\Roaming\Typora\typora-user-images\image-20250110210211668.png" alt="image-20250110210211668" style="zoom:50%;" />

#### reactive

* 只能创建对象类型的响应式数据

  导入 reactive : import { reactive }  from 'vue'

  使用 reactive(obj) 创建对象类型的响应式数据 :  let obj = reactive ( {a:'123', b:123} )

  修改响应式数据的值无需写 value ，直接修改

  reactive 创建的响应式对象是深层次的

  <img src="C:\Users\86132\AppData\Roaming\Typora\typora-user-images\image-20250110210253314.png" alt="image-20250110210253314" style="zoom:50%;" />

#### ref vs reactive

1. ref 用于定义 基本数据类型、对象数据类型
2. reactive 用于定义 对象数据类型

区别：

1. ref 创建的变量必须使用 .value (可打开vue扩展设置自动添加 .value)
2. reactive重新分配一个新对象，会失去响应式 (可以使用 Object.assign 整体替换对象)

使用原则：

1. 若需要一个基本类型的响应式数据，必须使用 ref
2. 若需要一个响应式对象，层级不深， ref 、reactive 都可以
3. 若需要一个响应式对象且层级较深，推荐使用 reactive

#### toRefs and toRef

作用：将一个由 reactive 定义的响应式对象的各属性解构到各变量且保持解构后各变量的响应式

import  { toRefs, toRef }  from 'vue'

let person = reactive ( { name:'lisi', age:22 } )

let { name, age } = toRefs ( person )   //将响应式对象的多个属性解构赋值到变量 

let nm = toRef ( person, 'name' )   //将响应式对象的单个属性解构赋值到变量

**注**：解构后的变量值的改变 会改变原响应式对象的属性值

### **computed**

计算属性，实质是一个函数，返回一个 ComputedRefImpl 对象

```js
import {computed} from 'vue'
//简单写法(只读)
let fullName = computed(() => {
   return firstName.value+' '+lastName.value
})
//完整写法(可读可写)
let fullName = computed({
  get(){
    return firstName.value+' '+lastName.value
  },
  set(value){
    firstName.value = value.split(' ')[0]
    lastName.value = value.split(' ')[1]
  }
})
```

















