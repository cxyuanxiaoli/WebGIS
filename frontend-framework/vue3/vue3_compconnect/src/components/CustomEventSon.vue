<template>
  <div class='custom-event-son'>
    <h3>子组件</h3>
    <h4>玩具：{{ toy }}</h4>
    <button @click="emit('send-toy', toy)">点击发送玩具</button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import emitter from '@/utils/emitter';

let toy = ref('atm')

const emit = defineEmits(['send-toy'])
</script>

<style scoped>
.custom-event-son {
  background-color: #80d4ff;
  border-radius: 10px;
  margin-top: 10px;
  box-shadow: 5px 5px 1px #888888;
  padding: 5px;
}
</style>