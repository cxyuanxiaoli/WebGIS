<template>
  <div class="person">
    ref
    <h2>name:{{ name }}</h2>
    <h2>age:{{ age }}</h2>
    <button @click="changeName">changeName</button>
    <button @click="changeAge">changeName</button>
    <button @click="showTel">show Tel</button> <br>
    <hr>
    <h2>fruits:</h2>
    <ol>
      <li v-for="f in fruits" :key="f">{{ f }}</li>
    </ol>
    <button @click="addFruit">add fruit</button>
    <hr>
    reactive
    <h2>one {{ car.brand }} car, worth {{ car.price }} yuan.</h2>
    <button @click="changeCarPrice">change car's price</button>
    <button @click="changeCar">change car</button>
    <hr>
    <h2>games:</h2>
    <ul>
      <li v-for="g in games" :key="g.id">{{ g.name }}</li>
    </ul>
    <button @click="changeGame">changeFirstGame</button>
    <hr>
    <h2>obj.a.b.c:{{ obj.a.b.c }}</h2>
    <button @click="changeObj">change obj.a.b.c</button>
    <hr>
    toRefs
    <h2>name:{{ person.name }}</h2>
    <h2>age:{{ person.age }}</h2>
    <button @click="modifyName">modifyName</button>
    <button @click="modifyAge">modifyAge</button>
  </div>
</template>

<!-- setup语法糖 -->
<script lang="ts" setup name="PersonRef">
import { ref, reactive, toRefs, toRef } from 'vue'

//data
//ref
let name = ref('zhangsan')
let age = ref(40)
let tel = '123456'

console.log('ref-基本类型：', name, age)

let fruits = ref(['apple', 'banana', 'orange'])
console.log('ref-对象类型：', fruits)

//reactive
let car = reactive({ brand: 'BMW', price: 100 })
console.log('reactive-对象类型：', car)
let games = reactive([
  { id: 'hquegq', name: '王者荣耀' },
  { id: 'dakhdu', name: '绝地求生' },
  { id: 'bxaiuq', name: '英雄联盟' }
])
console.log(games)

let obj = reactive({
  a: {
    b: {
      c: 666
    }
  }
})
console.log(obj)

//toRefs,toRef
let person = reactive({
  name:'zhangsan222',
  age:22,
})

let {name:nm,age:ag} = toRefs(person)
let name2 = toRef(person,'name')
console.log(nm,ag)

//methods
function changeName() {
  name.value = 'lisi'
}
function changeAge() {
  age.value+=1
}
function showTel() {
  alert(tel)
}
function addFruit() {
  fruits.value.push('grape')
}
function changeCarPrice() {
  car.price += 10
}
function changeCar() {
  Object.assign(car,{ brand: 'Audi', price: 200 })
}
function changeGame() {
  games[0].name = '原神'
}
function changeObj() {
  obj.a.b.c = 999
}
function modifyName(){
  nm.value = 'lisi222'
}
function modifyAge(){
  ag.value+=1
}

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