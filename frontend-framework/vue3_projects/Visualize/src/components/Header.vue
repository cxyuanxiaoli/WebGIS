<template>
  <div class="header">
    <h1>Vue-ECharts可视化展示</h1>
    <div class="time">当前时间：{{ now }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const now = ref('00:00:00');
setInterval(() => {
  now.value = new Date().toLocaleTimeString();
}, 1000);
</script>

<style scoped>
.header {
  height: 9.75vh;
  line-height: 8vh;
  text-align: center;
  font-size: 2.3vh;
  color: #fff;
  background-image: url('@/assets/images/head_bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

.time {
  position: absolute;
  top: 0;
  right: 20px;
}
</style>
