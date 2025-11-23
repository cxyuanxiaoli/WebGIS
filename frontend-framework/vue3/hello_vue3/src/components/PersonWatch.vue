<template>
  <div class="person">
    <h2>watch情况一</h2>
    <h2>sum:{{ sum }}</h2>
    <button @click="changeSum">sum+1</button>
    <h2>watch情况二</h2>
    <h2>name:{{ person.name }}</h2>
    <h2>age:{{ person.age }}</h2>
    <button @click="changeName">changeName</button>
    <button @click="changeAge">changeAge</button>
    <button @click="changePerson">changePerson</button>
    <h2>watch情况三</h2>
    <h2>name:{{ person2.name }}</h2>
    <h2>age:{{ person2.age }}</h2>
    <button @click="changeName2">changeName</button>
    <button @click="changeAge2">changeAge</button>
    <button @click="changePerson2">changePerson</button>
    <h2>watch情况四</h2>
    <h2>name:{{ person3.name }}</h2>
    <h2>car:{{ person3.car.c1 }}、{{ person3.car.c2 }}</h2>
    <button @click="changeName3">changeName</button>
    <button @click="changeC1">changeCar1</button>
    <button @click="changeC2">changeCar2</button>
    <button @click="changeCar">changeCar</button>
    <h2>watchEffect</h2>
    <h2>waterTemp:{{ waterTemp }}</h2>
    <h2>waterLevel:{{ waterLevel }}</h2>
    <button @click="changeWaterTemp">changeWaterTemp</button>
    <button @click="changeWaterLevel">changeWaterLevel</button>
  </div>
</template>

<script lang="ts" setup name="PersonWatch">
import { ref, reactive, watch, watchEffect } from 'vue'

let sum = ref(0)
function changeSum() {
  sum.value += 1
}
//情况一：watch监视ref定义的基本类型数据
const stopWatch = watch(sum, (newVal, oldVal) => {
  console.log('watch情况一：', newVal, oldVal)
  if (newVal > 10) {
    stopWatch()
  }
})

let person = ref({ name: 'zhangsan', age: 18 })
function changeName() {
  person.value.name += '~'
}
function changeAge() {
  person.value.age += 1
}
function changePerson() {
  person.value = { name: 'lisi', age: 20 }
}
//情况二：watch监视ref定义的对象类型数据
watch(person, (newVal, oldVal) => {
  console.log('watch情况二：', newVal, oldVal)
}, { deep: true })

let person2 = reactive({ name: 'zhangsan', age: 18 })
function changeName2() {
  person2.name += '~'
}
function changeAge2() {
  person2.age += 1
}
function changePerson2() {
  Object.assign(person2, { name: 'lisi', age: 40 })
}
//情况三：watch监视reactive定义的对象类型数据
watch(person2, (newVal, oldVal) => {
  console.log('watch情况三：', newVal, oldVal)
})

let person3 = reactive({ name: 'wangwu', car: { c1: 'BMW', c2: 'Audi' } })

function changeName3() {
  person3.name += '~'
}
function changeC1() {
  person3.car.c1 = 'Benz'
}
function changeC2() {
  person3.car.c2 = 'Tesla'
}
function changeCar() {
  person3.car = { c1: 'BYD', c2: 'Chery' }
}
//情况四：watch监视ref 或 reactive 定义的对象类型数据的某个属性
watch(() => person3.name, (newVal, oldVal) => {
  console.log('watch情况四：', newVal, oldVal)
})
watch(() => person3.car, (newVal, oldVal) => {
  console.log('watch情况四：', newVal, oldVal)
}, { deep: true })

//情况五：监视以上四种情况的组合
watch([() => person3.name, () => person3.car], (newVal, oldVal) => {
  console.log('watch情况五：', newVal, oldVal)
}, { deep: true })

//watchEffect
let waterTemp = ref(10)
let waterLevel = ref(0)
function changeWaterTemp(){
  waterTemp.value += 10
}
function changeWaterLevel(){
  waterLevel.value += 10
}
// 监视水温和水位，当水温达到60或水位达到80时打印信息
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
  console.log('watchEffect')
  if(waterTemp.value >= 60 || waterLevel.value >=80){
    console.log('some infomation')  
  }
})
</script>

<style scoped>
.person {
  background-color: skyblue;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
}

button {
  margin: 0 5px;
}
</style>