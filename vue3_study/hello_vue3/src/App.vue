<template>
  <!-- html -->
  <div class="app">
    <h1>Hello</h1>
    <Person></Person>
    <PersonVue3></PersonVue3>
    <PersonRef></PersonRef>
    <PersonComputed></PersonComputed>
    <PersonWatch></PersonWatch>
    <RefLabel ref="refLabel"></RefLabel>
    <button @click="showComponent">show component RefLabel</button>
    <PersonProps :list="personList" />
    <button @click="addPerson">add person</button>
    <LifeCycle v-if="flag"></LifeCycle>
    <button @click="changeShow">unmounte lifecycle</button>
    <Hooks></Hooks>
  </div>

</template>

<!-- <script lang="ts">
//js ts
import Person from './components/Person.vue'
import PersonVue3 from './components/PersonVue3.vue'
import PersonRef from './components/PersonRef.vue'
import PersonComputed from './components/PersonComputed.vue'
import PersonWatch from './components/PersonWatch.vue'
export default {
  name : 'App',
  components:{   //register components
    Person,
    PersonVue3,
    PersonRef,
    PersonComputed,
    PersonWatch,
  }

}
</script> -->

<script lang="ts" setup name="App">
import Person from './components/Person.vue'
import PersonVue3 from './components/PersonVue3.vue'
import PersonRef from './components/PersonRef.vue'
import PersonComputed from './components/PersonComputed.vue'
import PersonWatch from './components/PersonWatch.vue'
import RefLabel from './components/RefLabel.vue'
import { ref, reactive } from 'vue'
import PersonProps from './components/PersonProps.vue'
import { type PersonList } from '@/types'
import LifeCycle from './components/LifeCycle.vue'
import { onBeforeMount, onMounted } from 'vue'
import Hooks from './components/Hooks.vue'

let refLabel = ref()
function showComponent() {
  console.log('显示组件RefLabel', refLabel.value);
}

//props - 限制类型
let personList = reactive<PersonList>([
  { id: '01', name: 'jack', age: 20 },
  { id: '02', name: 'rose', age: 25 },
  { id: '03', name: 'tom', age: 30 }
])

function addPerson() {
  personList.push({ id: '04', name: 'jerry', age: 20 })
}

//life cycle
let flag = ref(true)
function changeShow() {
  flag.value = !flag.value
}
onBeforeMount(() => {
  console.log('父组件挂载前')
})
onMounted(() => {
  console.log('父组件挂载完毕')
})
</script>

<style scoped>
/* css */
.app {

  background-color: #ddd;
  box-shadow: 5px 5px 10px #000;
  padding: 20px;
  border-radius: 10px;
}
</style>