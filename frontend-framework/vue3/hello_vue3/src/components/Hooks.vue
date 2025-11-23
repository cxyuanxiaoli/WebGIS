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

<style scoped>
.main {
  background-color: skyblue;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
}

img {
  height: 100px;
}
</style>