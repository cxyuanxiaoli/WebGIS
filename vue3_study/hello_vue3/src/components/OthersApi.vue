<template>
  <div class='others-api'>
    <h3>shallowRef and shallowReactive</h3>
    <h4>ref-person1:{{ person1.name }} {{ person1.age }}</h4>
    <button @click="changeP1">change person1</button>
    <button @click="changeP1Name">change person1.name</button>
    <h4>shallowRef-person2:{{ person2.name }} {{ person2.age }}</h4>
    <button @click="changeP2">change person2</button>
    <button @click="changeP2Name">change person2.name</button>
    <h4>reactive-car1:{{ car1.brand }} {{ car1.engine }}</h4>
    <button @click="changeC1">change car1</button>
    <button @click="changeC1Engine">change car1.engine.power</button>
    <h4>shallowReactive-car2:{{ car2.brand }} {{ car2.engine }}</h4>
    <button @click="changeC2">change car2</button>
    <button @click="changeC2Engine">change car2.engine.power</button>

    <h3>readonly and shallowReadonly</h3>
    <h4>sum1:{{ sum1 }}</h4>
    <button @click="addSum1">add1</button>
    <h4>readonly-sum2:{{ sum2 }}</h4>
    <button @click="addSum2">add2</button>
    <h4>obj1:{{ obj1 }}</h4>

    <h4>shallowReadonly-obj2:{{ obj2 }}</h4>
    <button @click="changeObj2A">changeObj2A</button>
    <button @click="changeObj2D">changeObj2D</button>

    <h3>toRaw and markRaw</h3>
    <button @click="printRawObj">toRaw-consloe.log()</button>
    <button @click="printMarkObj">markRaw-consloe.log()</button>

    <h3>customRef</h3>
    <h4>{{ msg }}</h4>
    <input type="text" v-model="msg" />
    <h4>{{ msg2 }}</h4>
    <input type="text" v-model="msg2" />
  </div>
</template>

<script lang='ts' setup>
import {
  ref, reactive, shallowRef, shallowReactive, readonly,
  shallowReadonly, toRaw, markRaw, customRef
} from 'vue'
import useMsgRef from '@/hooks/useMsgRef'

//shallowRef
const person1 = ref({
  name: 'John',
  age: 25,
})
const person2 = shallowRef({
  name: 'Sarah',
  age: 19,
})
function changeP1() {
  person1.value = {
    name: 'Mike',
    age: 30,
  }
}
function changeP1Name() {
  person1.value.name = 'Tom'
}
function changeP2() {
  person2.value = {
    name: 'Lily',
    age: 22,
  }
}
function changeP2Name() {
  person2.value.name = 'Lucy'    //没有响应式
}

//shallowReactive
const car1 = reactive({
  brand: 'Toyota',
  engine: {
    power: 200,
    volume: 1.5,
  }
})
const car2 = shallowReactive({
  brand: 'Honda',
  engine: {
    power: 150,
    volume: 1.2,
  }
})
function changeC1() {
  Object.assign(car1, { brand: 'BMW', engine: { power: 220, volume: 1.8 } })
}
function changeC1Engine() {
  car1.engine.power = 250
}
function changeC2() {
  Object.assign(car2, { brand: 'Chevrolet', engine: { power: 170, volume: 1.3 } })
}
function changeC2Engine() {
  car2.engine.power = 180  //没有响应式

}

//readonly
let sum1 = ref(0)
let sum2 = readonly(sum1)

function addSum1() {
  sum1.value += 1
}
function addSum2() {
  // sum2.value += 1    //报错，不能修改
}
//shallowReadonly
const obj1 = reactive({
  a: 1,
  b: 2,
  c: {
    d: 3,
  }
})
const obj2 = shallowReadonly(obj1)

function changeObj2A() {
  // obj2.a = 2     //报错，不能修改
}
function changeObj2D() {
  obj2.c.d = 4
}

//toRaw
const obj3 = reactive({
  a: 1,
  b: 2,
})
const rawobj = toRaw(obj3)

function printRawObj() {
  rawobj.a += 2
  console.log(obj3)    //Proxy(Object) {a: 3, b: 2}
  console.log(rawobj)     //{a: 3, b: 2}
}

//markRaw
const obj4 = markRaw({
  a: 1,
  b: 2,
})
const markObj = reactive(obj4)

function printMarkObj() {
  console.log(markObj)    //{a: 1, b: 2, __v_skip: true}
}

//customRef
let msg = ref('hello')

let timer: number
let msg2Value = 'hello'
let msg2 = customRef((track, trigger) => {
  return {
    //被读取时调用
    get() {
      track()      //进行数据跟踪
      return msg2Value
    },
    //被修改时调用
    set(value) {
      clearTimeout(timer)
      timer = setTimeout(() => {

        msg2Value = value
        trigger()    //触发更新
      }, 1000)
    }
  }
})

// const msg2 = useMsgRef('hello', 1000)
</script>

<style scoped>
.others-api {
  background-color: skyblue;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
}
</style>