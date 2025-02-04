<template>
  <div class='child1'>
    <h3>子组件1</h3>
    <h4>书：{{ book }}本</h4>
    <h4>玩具：{{ toy }}</h4>
    <button @click="minusHouse($parent)">点击父组件房产减少</button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'

const book = ref(3)
const toy = ref('atm')

defineExpose({ book })

function minusHouse(parent: any) {
  parent.house -= 1
}
</script>

<style scoped>
.child1 {
  margin-top: 10px;

  padding: 20px;
  background-color: rgb(101, 194, 255);
  border-radius: 10px;
}
</style>