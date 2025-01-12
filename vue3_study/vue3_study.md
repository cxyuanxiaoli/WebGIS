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





