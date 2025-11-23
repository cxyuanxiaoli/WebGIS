<template>
  <div class='mitt-son1'>
    <h3>子组件1</h3>
    <h4>玩具：{{ toy }}</h4>
    <button @click="emitter.emit('send-toy', toy)">点击</button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import emitter from '@/utils/emitter';

const toy = ref('atm')

</script>

<style scoped>
.mitt-son1 {
  background-color: #6e9cff;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #333;
}
</style>