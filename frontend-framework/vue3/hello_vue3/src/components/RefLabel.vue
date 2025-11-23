<template>
  <div class="main">
    标签的ref属性：
    <h2 ref="label">Hello</h2>
    <button @click="showLabel">Click me</button>
  </div>
</template>

<script lang="ts" setup name="RefLabel">
import { ref } from 'vue'
import { type Person,type PersonList } from '@/types'
//获取dom元素
let label = ref()
let a=ref(0)
let b=ref({name:'jack'})

function showLabel() {
  console.log(label.value)
}

defineExpose({a,b})

//ts 类型约束
let p1:Person = {id:'123',name:'jack',age:20}
let persons:PersonList = [
  {id:'123',name:'jack',age:20},
  {id:'456',name:'rose',age:25}]
</script>

<style scoped>
.main {
  background-color: skyblue;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
}
</style>