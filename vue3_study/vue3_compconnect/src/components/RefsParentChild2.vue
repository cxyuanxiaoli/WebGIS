<template>
  <div class='child2'>
    <h3>子组件2</h3>
    <h4>书：{{ book }}本</h4>
    <h4>电脑：{{ computer }}</h4>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'

const book = ref(6)
const computer = ref('lenovo')
defineExpose({ book })
</script>

<style scoped>
.child2 {
  margin-top: 10px;
  padding: 20px;
  background-color: rgb(250, 107, 107);
  border-radius: 10px;
}
</style>