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

### **watch**

* 作用：监视数据的变化

* | 特点：Vue3中的watch只能监视以下四种数据： |
  | :---------------------------------------- |
  | 1. ref 定义的数据                         |
  | 2. reactive 定义的数据                    |
  | 3. 函数返回一个值 ( getter 函数 )         |
  | 4. 一个包含上述内容的数组                 |

#### 情况一

监视 ref 定义的基本类型数据，直接写数据名即可，监视的是其value值的改变。

```js
import { ref,watch } from 'vue'
let sum = ref(0)
//情况一：watch监视ref定义的基本类型数据
const stopWatch = watch(sum,(newVal,oldVal)=>{
  console.log('watch情况一：',newVal,oldVal)
  if(newVal > 10){
    stopWatch()
  }
})
```

#### 情况二

监视ref定义的对象类型数据，直接写数据名即可，监视的是对象的地址值，若想监视对象内部的数据，要手动开启深度监视。

| 注意：                                                       |
| ------------------------------------------------------------ |
| 1. 若修改的是ref定义的对象中的属性，newValue 和 oldValue 都是新值，因为它们是同一个对象 |
| 2. 若修改的是整个ref定义的对象，则 newValue是新值，oldValue 是旧值，因为不是同一个对象了 |

```js
import { ref,watch } from 'vue'
let person = ref({name:'zhangsan',age:18})
//情况二：watch监视ref定义的对象类型数据
watch(person,(newVal,oldVal)=>{
  console.log('watch情况二：',newVal,oldVal)
},{deep:true})
```

#### 情况三

监视reactive定义的对象类型数据，默认是开启深度监视的，且深度监视无法关闭

```js
import { reactive,watch } from 'vue'
let person2 = reactive({name:'zhangsan',age:18})
function changeName2(){
  person2.name +='~'
}
function changeAge2(){
  person2.age+=1
}
function changePerson2(){
  Object.assign(person2,{name:'lisi',age:40})
}
//情况三：watch监视reactive定义的对象类型数据
watch(person2,(newVal,oldVal)=>{
  console.log('watch情况三：',newVal,oldVal)
})
```



#### 情况四

监视ref或reactive定义的对象类型的某个属性，写一个getter函数，返回该属性值

若监视的属性为一个对象，则监视的是该对象的地址值，需要手动开启深度监视以监视该对象内部改变

```js
import { reactive,watch } from 'vue'
let person3 = reactive({name:'wangwu',car:{c1:'BMW',c2:'Audi'}})

function changeName3(){
  person3.name +='~'
}
function changeC1(){
  person3.car.c1 = 'Benz'
}
function changeC2(){
  person3.car.c2 = 'Tesla'
}
function changeCar(){
  person3.car = {c1:'BYD',c2:'Chery'}
}
//情况四：watch监视ref 或 reactive 定义的对象类型数据的某个属性
watch(()=> person3.name,(newVal,oldVal)=>{
  console.log('watch情况四：',newVal,oldVal)
})
watch(()=> person3.car,(newVal,oldVal)=>{
  console.log('watch情况四：',newVal,oldVal)
},{deep:true})
```

#### 情况五

监视以上多个数据的组合

```js
//情况五：监视以上四种情况的组合
watch([() => person3.name, () => person3.car], (newVal, oldVal) => {
  console.log('watch情况五：', newVal, oldVal)
}, { deep: true })
```

### watchEffect

立即运行一个函数，同时响应式地追踪其依赖，并在依赖改变时重新执行该函数

watch vs watchEffect

1. 都能监听响应式数据的变化，不同的是监听数据变化的方式
2. watch要明确指出监听的数据
3. watchEffect不同明确指出监视的数据(函数中用到哪些属性，那就监视哪些数据)

```js
import { ref,watch,watchEffect }  from 'vue'
let waterTemp = ref(10)
let waterLevel = ref(0)
//监视水温和水位，当水温达到60或水位达到80时打印信息
/*
watch([waterTemp, waterLevel],(newVal)=>{
  let [temp, level] = newVal
  if(temp >= 60 || level >=80){
    console.log('some infomation')  
  }
})
*/
//watchEffect的另一种写法
watchEffect(()=>{
  if(waterTemp.value >= 60 || waterLevel.value >=80){
    console.log('some infomation')  
  }
})
```

### 标签的 ref 属性

作用：用于注册模板引用

* 用在普通的Dom标签上，获取的是Dom节点
* 用在组件标签上，获取的是组件实例对象

语法：

1. 在dom标签或元素标签上写属性 ref="label"
2. 定义变量 let label = ref ( )  变量 label 即为dom实例 或 组件实例

获取dom元素：

```js
<template>
  <div class="main">
    <h2 ref="label">Hello</h2>
    <button @click="showLabel">Click me</button>
  </div>
</template>

<script lang="ts" setup name="RefLabel">
import { ref } from 'vue'
//获取dom元素
let label = ref()
function showLabel() {
  console.log(label.value)
}

let a=ref(0)
let b=ref({name:'jack'})
defineExpose({a,b})
</script>
```

获取组件元素：

```js
<template>
<!-- html -->
 <div class="app">
  <RefLabel ref="refLabel"></RefLabel>
  <button @click="showComponent">show component RefLabel</button>
 </div>
</template>

<script lang="ts" setup name="App">
import RefLabel from './components/RefLabel.vue'
import { ref } from 'vue'

let refLabel=ref()
function showComponent(){
  console.log('显示组件RefLabel',refLabel.value);
}
</script>
```

### TypeScript 初尝试

```ts	
//定义一个接口
export interface Person{
  name:string
  age:number
}
//定义一个自定义类型
export type PersonList = Array<Person>
```

```js
import { type Person, type PersonList } from '@/types'
//ts 类型约束
let p1:Person = {name:'jack',age:20}
let persons:PersonList = [{name:'jack',age:20},{name:'rose',age:25}]
```

### Props

父组件向子组件传递数据：

```js
<template>
  <div class="app">
    <PersonProps :list="personList" />
    <button @click="addPerson">add person</button>
  </div>
</template>

<script lang="ts" setup name="App">
import { reactive } from 'vue'
import PersonProps from './components/PersonProps.vue'
import { type PersonList } from '@/types'

//props - 限制类型
let personList=reactive<PersonList>([
  {id:'01',name:'jack',age:20},
  {id:'02',name:'rose',age:25},
  {id:'03',name:'tom',age:30}
])

function addPerson(){
  personList.push({id:'04',name:'jerry',age:20})
}
</script>

```

子组件接收数据：

* 只接收props并在模板中展示  
* 接收props并赋值给变量
* 接收props并限制接收类型
* 接收props并限制接收类型、必要性、配置默认值

```js
<template>
  <div class="main">
    props:
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in list" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.age }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script lang="ts" setup name="PersonProps">
import { withDefaults } from 'vue'
import { type PersonList } from '@/types';
//只接收props
// defineProps(['list'])
//接收props并赋值给变量
// let props = defineProps(['list'])
// console.log(props)
//接收props并限制接收的类型
// defineProps<{list: PersonList}>()
//接收props并限制类型、必要性、配置默认值
withDefaults(defineProps<{list?:PersonList}>(),{
  list:()=> [{id:'1',name:'张三',age:20},{id:'2',name:'李四',age:25}]
})
</script>
```

### 生命周期

 Vue组件实例在创建时要经历一系列的初始化步骤，在此过程中Vue会在合适的时机，调用特定的函数，从而让开发者有机会在特定的阶段运行自己的代码，这些特定的函数统称为：生命周期钩子

Vue3的生命周期：

* 创建阶段：setup
* 挂载阶段：onBeforeMount、onMounted
* 更新阶段：onBeforeUpdate、onUpdated
* 卸载阶段：onBeforeUnmount、onUnmounted

常用的钩子：onMounted (挂载完毕)、onUpdated (更新完毕)、onBeforeUnmount (卸载之前)

```js
<script lang="ts" setup name="LifeCycle">
//生命周期
import { onBeforeMount,onMounted,onBeforeUpdate,onUpdated,onBeforeUnmount,onUnmounted } from 'vue';
console.log('life cycle:创建')
onBeforeMount(()=>{
  console.log('life cycle:挂载前')
})
onMounted(()=>{
  console.log('life cycle:挂载完毕')
})
onBeforeUpdate(()=>{
  console.log('life cycle:更新前')
})
onUpdated(()=>{
  console.log('life cycle:更新完毕')
})
onBeforeUnmount(()=>{
  console.log('life cycle:卸载前')
})
onUnmounted(()=>{
  console.log('life cycle:卸载完毕')
})
</script>
```

### Hooks

将组件各部分代码拆分到各hooks文件中

组件代码：

```js
<template>
  <div class="main">
    <h2>当前求和为：{{ sum }},乘10={{ bigSum }}</h2>
    <button @click="add">sum+1</button><br>
    <img v-for="(dog, index) in dogList" :key="index" :src="dog">
    <br>
    <button @click="addDog">add dog</button>
  </div>
</template>

<script lang="ts" setup name="LifeCycle">
import { onMounted } from 'vue';
import useDog from '@/hooks/useDog'
import useSum from '@/hooks/useSum'

let { dogList, addDog } = useDog()
let { sum, bigSum, add } = useSum()
onMounted(() => {
  console.log('Hooks.vue mounted')
})
</script>
```

hook:useDog.ts

```ts
import { reactive, onMounted } from 'vue'
import axios from 'axios'

export default function () {
  let dogList = reactive([''])
  async function addDog() {
    try {
      let dog = await axios.get('https://dog.ceo/api/breeds/image/random')
      dogList.push(dog.data.message)
    } catch (error) {
      alert(error)
    }
  }
  onMounted(() => {
    console.log('hooks mounted')
  })
  return { dogList, addDog }
}
```

hook:useSum.ts

```ts
import { ref, computed, onMounted } from 'vue'

export default function useSum() {
  let sum = ref(0)
  let bigSum = computed(() => {
    return sum.value * 10
  })

  function add() {
    sum.value += 1
  }
  onMounted(() => {
    console.log('hooks2 mounted')
  })
  return { bigSum, sum, add }
}

```

## Vue3 Router

### 路由基本配置

1. 安装 vue-router 依赖  npm i vue-router

2. 创建router并配置routes

   ```ts
   //   src/router/index.ts
   import { createRouter, createWebHistory } from "vue-router"
   import Home from '@/components/Home.vue'
   
   const router = createRouter({
     history: createWebHistory(),  //工作模式
     routes:[{
       path:'/home',
       component:Home
     }]
   })
   
   export default router
   ```

3. 使用 router

   ```ts
   //main.ts
   import { createApp } from 'vue'
   import App from './App.vue'
   import router from '@/router'
   
   const app=createApp(App)
   app.use(router)
   app.mount('#app')
   ```

4. 在模板中设置组件展示区域及切换路径链接

   ```js
   <script setup lang="ts" name="App">
   import { RouterView,RouterLink } from 'vue-router'
   </script>
   
   <template>
     <div class="title">
       <h2>Vue Router</h2>
     </div>
     <div class="navigate">
       <RouterLink to="/home" active-class="active"> Home </RouterLink>
       <RouterLink to="/news" active-class="active"> News </RouterLink>
       <RouterLink to="/about" active-class="active"> About </RouterLink>
     </div>
     <div class="content">
       <RouterView></RouterView>
     </div>
   </template>
   ```

### 两个注意点

1. 路由组件通常放在 pages 或 views 文件夹，一般组件通常放在 components 文件夹
2. 通过点击 routerlink 视觉效果上消失了的组件，默认是被**卸载**掉的，需要的时候再**挂载**

### 路由器的两种工作模式

* history

  history : createWebHistory ( )

  优点：URL美观，不带有#，更接近传统的网站URL

  缺点：后期项目上线，需要配合处理路径问题，否则刷新会有404错误

* hash

  history : createWebHashHistory ( )

  优点：兼容性更好，因为不需要服务端处理路径

  缺点：URL带有#不美观，且在SEO优化方面相对较差

### to的两种写法

1. 字符串写法

   <RouterLink to="/home" active-class="active"> Home </RouterLink>

2. 对象写法

   <RouterLink :to="{path:'/home'}" active-class="active"> Home </RouterLink>

### 命名路由

作用：可以简化路由跳转及传参

给路由规则命名：

```js
const router = createRouter({
  history: createWebHistory(),  //工作模式
  routes:[{
    name:'xinwen',
    path:'/news',
    component:News
  },{
    name:'guanyu',
    path:'/about',
    component:About
  }]
})
```

跳转路由：

```js
<RouterLink :to="{path:'/news'}" active-class="active"> News </RouterLink>
<RouterLink :to="{name:'guanyu'}" active-class="active"> About </RouterLink>
```

### 嵌套路由

配置二级路由：

```js
const router = createRouter({
  history: createWebHistory(), 
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
      path: 'detail',
      component: Detail
    }]
  }]
})
```

设置组件显示区域及路径跳转：

```js
<template>
  <div class="main">
    <div class="newslist">
      <h2>News</h2>
      <ul>
        <li v-for="item in news" :key="item.id">
          <RouterLink :to="{ name: 'xijie' }">{{ item.title }}</RouterLink>
        </li>
      </ul>
    </div>
    <div class="detail">
      <RouterView></RouterView>
    </div>
  </div>
</template>
```

### 路由传参

#### query参数

1. 通过拼接路径字符串传参

   ```js
   <RouterLink :to="`/news/detail?id=${item.id}&title=${item.title}&content=${item.content}`" active-class="active">{{ item.title }}</RouterLink>
   
   ```

2. 通过配置跳转路由对象传参

   ```js
   <RouterLink :to="{
     name: 'xijie',
     query: {
     id: item.id,
     title: item.title,
     content: item.content
     }
   }" active-class="active">{{ item.title }}</RouterLink>
   ```

   接收参数：

   ```js
   <script lang="ts" setup name="Detail">
   import { useRoute } from 'vue-router'
   import { toRefs } from 'vue'
   
   let route=useRoute()
   let { query } = toRefs(route)
   console.log(query.value.id,query.value.title,query.value.content)
   </script>
   ```

#### params参数

注意：

* 传递params参数时，若使用to的对象写法，必须使用name配置项，不能用path
* 传递params参数时，需要提前在路由规则中占位

路由配置：

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [{
    name: 'xinwen',
    path: '/news',
    component: News,
    children: [{
      name: 'xijie',
      path: 'detail/:id/:title/:content',     //使用占位符占位
      component: Detail
    }]
  }]
})
```

1. 字符串拼接

   ```js
   <RouterLink :to="`/news/detail/${item.id}/${item.title}/${item.content}`">{{ item.title }}</RouterLink>
   ```

2. 配置跳转路由对象

   ```js
   <RouterLink :to="{
     name: 'xijie',      //必须指定跳转路由name属性而不是path属性
     params: {
       id: item.id,
       title: item.title,
       content: item.content
     }
   }">{{ item.title }}</RouterLink>
   ```

接收参数：

```js
import { useRoute } from 'vue-router'

let route = useRoute()
console.log(route.params.id,route.params.title,route.params.content)
```

### 路由的 props 配置

作用：实现路由组件的props属性配置，用于传参

1. 第一种写法，将路由组件收到的所有params参数作为props传递

   需要配置路由：

   ```js
   const router = createRouter({
     history: createWebHistory(),  
     routes: [{
       name: 'xinwen',
       path: '/news',
       component: News,
       children: [{
         name: 'xijie',
         path: 'detail/:id/:title/:content',
         component: Detail,
         props: true     //开启props配置，将params参数作为props传递
       }]
     }]
   })
   ```

2. 第二种写法，函数式，可以自己决定传递什么参数，自带一个参数为route

   ```js
   const router = createRouter({
     history: createWebHistory(),  
     routes: [{
       name: 'xinwen',
       path: '/news',
       component: News,
       children: [{
         name: 'xijie',
         path: 'detail/:id/:title/:content',
         component: Detail,
         props(to) {        //写成一个函数，将返回值作为props传递，to为当前route对象
           return to.params
         }
       }]
     }]
   })
   ```

3. 第三种写法，对象式，可以自己决定传递什么参数

   ```js
   const router = createRouter({
     history: createWebHistory(),  
     routes: [{
       name: 'xinwen',
       path: '/news',
       component: News,
       children: [{
         name: 'xijie',
         path: 'detail/:id/:title/:content',
         component: Detail,
         props:{       //写成一个对象，将对象作为props传递，适合传递一些不变的内容
           id:'1',
           title:'2',
           content:'3'
         }
       }]
     }]
   })
   ```

接收props参数

```js
<script lang="ts" setup name="Detail">
//使用组件的props接收参数
defineProps(['id', 'title', 'content'])
</script>
```

### replace 属性

作用：控制路由跳转时操作浏览器历史记录的模式

浏览器的历史记录有两种写入模式：分别为push 和 replace

* push是追加历史记录(默认)
* replace是替换当前记录

开启replace模式：

```js
<RouterLink replace :to="{ name: 'guanyu' }" active-class="active"> About </RouterLink>
```

### 编程式路由导航

通过编程的方式而不是RouterLink实现路由跳转

实现自动页面跳转：

```js
<script lang="ts" setup name="Home">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()    //获取路由器对象
onMounted(()=>{
  setTimeout(() => {
    router.push('/news')      //通过push方法跳转
  }, 3000);
})
</script>
```

实现点击按钮跳转页面：

```js
<template>
  <div class="main">
    <div class="newslist">
      <h2>News</h2>
      <ul>
        <li v-for="item in news" :key="item.id">
          <button @click="showDetail(item)">查看详情</button>
        </li>
      </ul>
    </div>
    <div class="detail">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup name="News">
import { RouterView, useRouter } from 'vue-router';
let news = [{ id: 'sadqwdqwd01', title: 'news1', content: 'content1' },
    { id: 'sadqwdqwd02', title: 'news2', content: 'content2' },
    { id: 'sadqwdqwd03', title: 'news3', content: 'content3' }]
interface NewsItem {
  id: string
  title: string
  content: string
}
const router = useRouter()      //获取路由器对象
function showDetail(item: NewsItem) {
  router.push({          //页面跳转
    name: 'xijie',
    params: {
      id: item.id,
      title: item.title,
      content: item.content
    }
  })
}
</script>
```

### 路由重定向

```js
const router = createRouter({
  history: createWebHistory(), 
  routes: [{
    name: 'shouye',
    path: '/home',
    component: Home
  }, {
    path:'/',
    redirect:'/home'    //将该路由重定向到主页
  }]
})
```

## Vue3 Pinia

### 搭建pinia环境

1. 安装pinia依赖：npm i pinia
2. 在main.ts文件引入pinia：import { createPinia }  from 'pinia'
3. 创建pinia：const pinia = createPinia ( )
4. 使用pinia：app.use ( pinia )

### 使用Pinia 存储、读取、修改数据

#### 存储数据

1. 在src目录下新建store文件夹

2. 在store文件夹新建 ts文件

   ```ts
   //sum.ts
   import { defineStore } from 'pinia'   //引入函数
   //创建仓库对象，第一个参数为仓库id，第二个参数为配置对象
   export const useSumStore =defineStore('sum',{    //将仓库导出
     state(){        //存储数据
       return{
         count:6
       }
     }
   })
   ```

#### 读取数据

在需要用到数据的组件中编写

1. 引入ts文件
2. 调用函数获取数据仓库对象
3. 读取数据

```js
<template>
  <div class="count">
    <h2>当前求和为：{{ sumStore.count }}</h2>   <!-- 拿到具体数据渲染 -->
    <select v-model.number="n">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </select>
  </div>
</template>

<script lang="ts" setup name="Sum">
import { ref } from 'vue'
import { useSumStore} from '@/store/sum'   //引入仓库创建函数

const sumStore = useSumStore()     //得到数据仓库
let n = ref(1)
</script>
```

#### 修改数据

1. 第一种方式，直接对数据进行修改

   ```js
   sumStore.count +=1
   ```

2. 第二种方式，使用仓库对象的 $patch() 进行批量修改

   ```js
   sumStore.$patch({
       count:10,
       a:'123',
       b:12
   })
   ```

3. 第三种方式，在定义数据仓库时提供 actions 配置项定义函数

   ```ts
   //sum.ts
   import { defineStore } from 'pinia'
   export const useSumStore = defineStore('sum', {
     actions: {
       increment(value: number) {
         this.count += value        //使用this获取数据
       }
     },
     state() {
       return {
         count: 6,
         a: 'hello'
       }
     }
   })
   ```

   ```js
   sumStore.increment(n.value)   //在组件中调用对象函数修改数据
   ```

### storeToRefs

解决的问题：通过调用函数得到的仓库对象为reactive类型，解构后数据会丢失响应式，而使用toRefs()函数会将reactive对象所有成员均转为ref类型，storeToRefs()函数的作用则是只将仓库对象中的数据转为ref对象，从而能使数据解构出来

```js
<template>
  <div class="talk">
    <button @click="getTalk">获取一句情话</button>
    <ul>
      <li v-for="talk in talks" :key="talk.id">{{ talk.content }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup name="LoveTalk">
import { useLoveTalkStore } from '@/store/loveTalk'
import { storeToRefs } from 'pinia'

const loveTalkStore = useLoveTalkStore()
const { talks } = storeToRefs(loveTalkStore)   //解构数据
function getTalk() {
  loveTalkStore.getTalk()
}
</script>
```

### getters

作用：getters 主要用于定义计算属性，这些计算属性可以从存储的状态中派生出新的值或进行计算

```ts
import { defineStore } from 'pinia'

export const useSumStore = defineStore('sum', {
  state() {
    return {
      count: 6,
      a: 'hello'
    }
  },
  getters: {
    doubleCount(): number {    //普通函数
      return this.count * 2
    },
    upperA:state=>state.a.toUpperCase()   //箭头函数
  }
})
```

### $subscribe

作用：subscribe 是一个用于监听状态变化的方法。通过 subscribe，可以在状态state发生变化时执行特定的逻辑

参数：

* **mutation**：一个对象，包含以下信息：
  - `type`：表示变化的类型，通常是 `'direct'` 或 `'patch object'`
  - `events`：一个对象，包含 `type` 和 `key`，表示具体的变化事件
  - `storeId`：表示发生变化的 store 的 ID
* **state**：表示当前的状态对象

示例：

```js
loveTalkStore.$subscribe((mutation, state) => {
  console.log('数据变化了')
  localStorage.setItem('loveTalk', JSON.stringify(state.talks))
})
```

### store组合式写法

选项式：

```ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { nanoid } from 'nanoid'

export const useLoveTalkStore = defineStore('loveTalk', {
  actions: {
    async getTalk() {
      let res = await axios.get('https://api.uomg.com/api/rand.qinghua?format=json')
      this.talks.unshift({ id: nanoid(), content: res.data.content })
    }
  },
  state() {
    return {
      talks: JSON.parse(localStorage.getItem('loveTalk') as string) || []
    }
  }
})
```

组合式：

```ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { reactive } from 'vue'

//组合式写法
export const useLoveTalkStore = defineStore('loveTalk', () => {
  const talks = reactive(JSON.parse(localStorage.getItem('loveTalk') as string) || [])

  async function getTalk() {
    let res = await axios.get('https://api.uomg.com/api/rand.qinghua?format=json')
    talks.unshift({ id: nanoid(), content: res.data.content })
  }
  return{talks, getTalk}
})
```



## Vue3 组件通信

### props

概述：`props`是使用频率最高的一种通信方式，常用于：父传子，子传父

* 父传子：属性值是非函数
* 子传父：属性值是函数

父传子：

```vue
//父组件
<template>
  <div class='main'>
    <div class="father">
      <h3>父组件</h3>
      <h4>汽车：{{ car }}</h4>
      <PropsSon :car="car" />
    </div>
  </div>
</template>

<script lang='ts' setup>
import PropsSon from '@/components/PropsSon.vue';
import { ref } from 'vue';

const car = ref('宝马');
</script>

//子组件
<template>
  <div class='main'>
    <h3>子组件</h3>
    <h4>玩具：{{ toy }}</h4>
    <h4>父亲的车：{{ car }}</h4>
  </div>
</template>

<script lang='ts' setup>
defineProps(['car'])
</script>
```

子传父：

```vue
//父组件
<template>
  <div class='main'>
    <div class="father">
      <h3>父组件</h3>
      <h4 v-show="sonToy">玩具：{{ sonToy }}</h4>
      <PropsSon :sendToy="getToy" />
    </div>
  </div>
</template>

<script lang='ts' setup>
import PropsSon from '@/components/PropsSon.vue';
import { ref } from 'vue';

const sonToy = ref('');
function getToy(value: string) {
  sonToy.value = value;
}
</script>

//子组件
<template>
  <div class='main'>
    <h3>子组件</h3>
    <h4>玩具：{{ toy }}</h4>
    <button @click="sendToy(toy)"> 给父亲玩具 </button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'

const toy = ref('atm')
defineProps(['sendToy'])
</script>
```

### 自定义事件

自定义事件用于组件通信-子传父

```vue
//父组件
<template>
  <div class='custom-event'>
    <div class="father">
      <h3>父组件</h3>
      <h4 v-show="sonToy">子组件的玩具：{{ sonToy }}</h4>
      <CustomEventSon @send-toy="getToy" />
    </div>
  </div>
</template>

<script lang='ts' setup>
import CustomEventSon from '@/components/CustomEventSon.vue';
import { ref } from 'vue'

const sonToy = ref('')
function getToy(toy: string) {
  sonToy.value = toy
}
</script>

//子组件
<template>
  <div class='custom-event-son'>
    <h3>子组件</h3>
    <h4>玩具：{{ toy }}</h4>
    <button @click="emit('send-toy', toy)">点击发送玩具</button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'

let toy = ref('atm')
const emit = defineEmits(['send-toy'])
</script>
```

$event  事件对象

​		当事件回调函数不进行传参时，默认会存在一个参数，即事件对象；当传参时，事件对象会丢失，需要使用$event为事件对象占位。

```js
<template>
<button @click="handleClick(1, $event)"> click</button>
</template>

<script lang='ts' setup>
function handleClick(a: any, b: any) {
  console.log(a, b);
}
</script>
```

### mitt

任意组件通信

```ts
//@/utils/emitter.ts
import mitt from "mitt";
const emitter = mitt();
export default emitter;
```

* emitter.on( )     绑定事件
* emitter.off( )     解绑事件
* emitter.emit( )  触发事件
* emitter.all( )      拿到所有事件

```vue
<template>
  <div class='mitt'>
    <h3>父组件</h3>
    <MittSon1 />
    <MittSon2 />
  </div>
</template>
<script lang='ts' setup>
import MittSon1 from '@/components/MittSon1.vue';
import MittSon2 from '@/components/MittSon2.vue';
</script>

<template>
  <div class='mitt-son1'>
    <h3>子组件1</h3>
    <h4>玩具：{{ toy }}</h4>
    <button @click="emitter.emit('send-toy', toy)">点击</button>
  </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue'
import emitter from '@/utils/emitter';
const toy = ref('atm')
</script>

<template>
  <div class='mittSon2'>
    <h3>子组件2</h3>
    <h4 v-show="son1Toy">兄弟组件的玩具：{{ son1Toy }}</h4>
  </div>
</template>
<script lang='ts' setup>
import { ref, onUnmounted } from 'vue'
import emitter from '@/utils/emitter';
const son1Toy = ref('')
emitter.on('send-toy', (toy: any) => {
  son1Toy.value = toy
  console.log(toy);
})
onUnmounted(() => {
  emitter.off('send-toy')
})
</script>
```

### v-model

#### v-model作用于原始html元素

1. 用法：

   ```html
   <input type="text" v-model="name">
   ```

2. 实现原理：

   ```html
     <input type="text" :value="name" @input="name = (<HTMLInputElement>$event.target).value">
   ```

#### v-model作用于自定义组件

1. 用法：

   ```vue
   <MyInput v-model="name" />
   ```

2. 实现原理：

   * 底层自动转换为 props和自定义事件emit

     ```vue
     <MyInput :modelValue="name" @update:modelValue="name = $event" />
     ```

   * 自定义组件内部逻辑手动实现

     ```vue
     //MyInput.vue
     <template>
       <div class='my-input'>
         <input type="text" :value="modelValue" @input="$emit('update:modelValue', (<HTMLInputElement>$event.target).value)">
       </div>
     </template>
     
     <script lang='ts' setup>
     defineProps(['modelValue'])
     const emit = defineEmits(['update:modelValue'])
     </script>
     ```

3. $event

   * 在元素html标签中$event表示触发事件的事件对象
   * 在自定义组件标签中$event表示自定义事件的传参

4. 通过v-model双向绑定多个值

   * 写法

     ```vue
     <MyInput v-model:name="name" v-model:password="password" />
     ```

   * 自定义组件内部实现

     ```vue
     <template>
       <div class='my-input'>
         <input type="text" :value="name" @input="$emit('update:name', (<HTMLInputElement>$event.target).value)">
         <br>
         <input type="text" :value="password" @input="$emit('update:password', (<HTMLInputElement>$event.target).value)">
       </div>
     </template>
     
     <script lang='ts' setup>
     defineProps(['name', 'password'])
     const emit = defineEmits(['update:name', 'update:password'])
     </script>
     ```

### $attrs

$attrs用于实现当前组件的父组件，向当前组件的子组件通信（祖->孙）

$attrs是一个对象，包含所有父组件传入的标签属性，$attrs会自动排除props中声明的属性（可以认为声明过的props被子组件自己‘消费’了）

实现：

1. 父组件

   ```vue
   <template>
     <div class='attrs'>
       <h4>父组件</h4>
       <h5>a: {{ a }}</h5>
       <h5>b: {{ b }}</h5>
       <AttrsSon :a="a" :b="b" v-bind="{ x: 100, y: 200 }" />
     </div>
   </template>
   
   <script lang='ts' setup>
   import AttrsSon from '@/components/AttrsSon.vue';
   import { ref } from 'vue';
   const a = ref(10);
   const b = ref(20);
   </script>
   ```

2. 子组件

   ```vue
   <template>
     <div class='attrs-son'>
       <h4>子组件</h4>
       <AttrsGrandchild v-bind="$attrs" />
     </div>
   </template>
   
   <script lang='ts' setup>
   import AttrsGrandchild from './AttrsGrandchild.vue';
   </script>
   ```

3. 孙组件

   ```vue
   <template>
     <div class='attrs-grandchild'>
       <h4>孙组件</h4>
       <h5>a:{{ a }}</h5>
       <h5>b:{{ b }}</h5>
       <h5>x:{{ x }}</h5>
       <h5>y:{{ y }}</h5>
     </div>
   </template>
   
   <script lang='ts' setup>
   defineProps(['a', 'b', 'x', 'y'])
   </script>
   ```


### $refs and $parent

$refs用于父传子

$parent用于子传父

$refs: 值为对象，包含所有被ref属性标识的Dom元素或组件实例

$parent: 值为对象，当前组件的父组件实例对象

1. $refs

   定义子组件数据并暴露

   ```vue
   <script lang='ts' setup>
   import { ref } from 'vue'
   
   const book = ref(3)
   defineExpose({ book })
   </script>
   ```

   在父组件中为子组件打上ref标签，使用$refs获取所有组件实例

   ```vue
   <template>
     <div class='refs-parent'>
       <h3>父组件</h3>
       <button @click="addBook($refs)">增加所有子组件book数量</button>
       <RefsParentChild1 ref="c1" />
       <RefsParentChild2 ref="c2" />
       <div ref="div"></div>
     </div>
   </template>
   ```

   编写对应方法修改子组件数据

   ```vue
   <script lang='ts' setup>
   function addBook(value: any) {
     for (let key in value) {
       value[key].book += 1;
     }
   }
   </script>
   ```

2. $parent

   父组件中定义数据并暴露

   ```vue
   <template>
     <div class='refs-parent'>
       <h3>父组件</h3>
       <h4>房产：{{ house }}</h4>
       <RefsParentChild1 ref="c1" />
       <RefsParentChild2 ref="c2" />
     </div>
   </template>
   
   <script lang='ts' setup>
   import RefsParentChild1 from '@/components/RefsParentChild1.vue';
   import RefsParentChild2 from '@/components/RefsParentChild2.vue';
   import { ref } from 'vue';
   
   const c1 = ref();
   const c2 = ref();
   const house = ref(4)
   defineExpose({ house })
   </script>
   ```

   子组件中获取父组件实例并修改父组件数据

   ```vue
   <template>
     <div class='child1'>
       <h3>子组件1</h3>
       <h4>书：{{ book }}本</h4>
       <button @click="minusHouse($parent)">点击父组件房产减少</button>
     </div>
   </template>
   
   <script lang='ts' setup>
   import { ref } from 'vue'
   
   const book = ref(3)
   defineExpose({ book })
   
   function minusHouse(parent: any) {
     parent.house -= 1
   }
   </script>
   ```

### provide and inject

实现组件与其后代组件通信，不会影响到中间组件

* import { provide, inject } from 'vue'
* provide(key,value)     // key 数据名，字符串         value 值
* inject(key,defaultValue)    // key  对应provide的key       defaultValue   默认值

1. 定义父组件数据并向后代提供数据

   ```vue
   <template>
     <div class='provide-inject'>
       <h3>父组件</h3>
       <h4>银子: {{ money }}</h4>
       <h4>汽车: 一辆{{ car.brand }}, 价值 {{ car.price }}</h4>
       <ProvideSon />
     </div>
   </template>
   
   <script lang='ts' setup>
   import ProvideSon from '@/components/ProvideSon.vue';
   import { ref, reactive, provide } from 'vue';
   
   const money = ref(1000);
   const car = reactive({
     brand: 'BMW',
     price: 100000
   })
   provide('money', money)
   provide('car', car)
   </script>
   ```

2. 在后代组件接收数据

   ```vue
   <template>
     <div class='provide-grandchild'>
       <h3>孙组件</h3>
       <p>父组件提供的钱：{{ money }}</p>
       <p>父组件提供的车：一辆{{ car.brand }}, 价值{{ car.price }}</p>
     </div>
   </template>
   
   <script lang='ts' setup>
   import { inject } from 'vue';
   
   const money = inject('money', 0);
   const car = inject('car', { brand: '', price: 0 });
   </script>
   ```

### pinia

### slot

#### 默认插槽

在子组件中使用 slot 占位，在父组件中定义样式填充。

```vue
<template>
  <div class='slot-default'>
    <h3>{{ title }}</h3>
    <slot>默认内容</slot>
  </div>
</template>

<script lang='ts' setup>
defineProps(['title'])
</script>
```

```vue
<template>
  <div class='slot'>
    <h3>父组件</h3>
    <div class="content">
      <SlotDefault title="热门游戏列表">
        <ul v-for="game in games" :key="game.id">
          <li>{{ game.name }}</li>
        </ul>
      </SlotDefault>
      <SlotDefault title="今日美食城市">
        <img :src="imgUrl" alt="">
      </SlotDefault>
      <SlotDefault title="今日影视推荐">
        <video :src="videoUrl" controls></video>
      </SlotDefault>
    </div>
  </div>
</template>

<script lang='ts' setup>
import SlotDefault from '@/components/SlotDefault.vue';

const games = [{ id: 1, name: '王者荣耀' }, { id: 2, name: '绝地求生' }, { id: 3, name: '英雄联盟' }, { id: 4, name: 'DOTA2' }]
const imgUrl = 'https://z1.ax1x.com/2023/11/19/piNxLo4.jpg'
const videoUrl = 'http://flv4mp4.people.com.cn/videofile7/pvmsvideo/2021/12/16/QiangGuoLunTan-ZhouJing_bb603bf08843f480355ee52737b6a27c_ms_hd.mp4'
</script>
```

#### 具名插槽

通过使用具名插槽可以在子组件中定义多个插槽进行占位并通过 name 属性区分，在父组件中使用 template 并使用 `v-slot: name` 指定插槽名填充特定结构。

默认插槽 name 属性为 default ；使用具名插槽时 `v-slot:name` 可以简写为 `#name`

```vue
<template>
  <div class='slot-name'>
    <slot name="header">默认标题</slot>
    <slot name="content">默认内容</slot>
  </div>
</template>
```

```vue
<template>
  <div class='slot'>
    <h3>父组件</h3>
    <div class="content">
      <SlotName>
        <template v-slot:header>
          <h4>具名插槽</h4>
        </template>
        <template #content>   <!-- 简写 -->
          <p>具名插槽内容</p>
        </template>
      </SlotName>
    </div>
  </div>
</template>
```

#### 作用域插槽

数据在子组件中维护，但根据数据生成什么样的结构由父组件决定。

子组件通过为 slot 定义属性传递数据，父组件使用 template 并通过 `v-slot="data"` 接收数据；搭配具名插槽使用时通过 `v-slot:name="data"` 接收数据，简写为 `#name="data"`

子组件：

```vue
<template>
  <div class='slot-scope'>
    <h3>日期列表</h3>
    <slot :days="dayList"></slot>      <!-- 使用作用域插槽传递数据 --> 
  </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue';

const dayList = reactive(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
</script>
```

父组件：

```vue
<template>
  <div class='slot'>
    <h3>父组件</h3>
    <!-- 作用域插槽 -->
    <div class="content3">
      <Slotscope>
        <template v-slot="params">      <!-- 接收数据 -->
          <ul>
            <li v-for="(day, index) in params.days" :key="index">{{ day }}</li>
          </ul>
        </template>
      </Slotscope>
      <Slotscope>
        <template v-slot="{ days }">   <!-- 接收数据并解构 -->
          <ol>
            <li v-for="(day, index) in days" :key="index">{{ day }}</li>
          </ol>
        </template>
      </Slotscope>
      <Slotscope>
        <template #default="{ days }">    <!-- 简写形式，默认插槽name属性为default -->
          <h6 v-for="(day, index) in days" :key="index">{{ day }}></h6>
        </template>
      </Slotscope>
    </div>
  </div>
</template>
```









































