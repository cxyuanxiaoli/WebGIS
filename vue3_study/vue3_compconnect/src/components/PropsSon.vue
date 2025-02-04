<template>
  <div class='main'>
    <h3>子组件</h3>
    <h4>玩具：{{ toy }}</h4>
    <h4>父亲的车：{{ car }}</h4>
    <button @click="sendToy(toy)"> 给父亲玩具 </button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'

const toy = ref('atm')

defineProps(['car', 'sendToy'])
</script>

<style scoped>
.main {
  background-color: #80d4ff;
  border-radius: 10px;
  margin-top: 10px;
  box-shadow: 5px 5px 1px #888888;
}
</style>