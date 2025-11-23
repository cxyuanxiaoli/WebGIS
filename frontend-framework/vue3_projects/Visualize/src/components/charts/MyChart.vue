<template>
  <v-chart :option="option" ref="chart" class="chart"></v-chart>
  <button @click="FullScreen()" class="full-screen-btn" title="全屏">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="#fff"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 8L9 5L12 5M12 8L15 5L12 5M12 16L9 19L12 19M12 16L15 19L12 19M8 12L5 9L5 12M8 12L5 15L5 12M16 12L19 9L19 12M16 12L19 15L19 12"
        stroke="#ffffffa0"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<script setup>
import VChart from 'vue-echarts';
import { ref } from 'vue';

const props = defineProps(['method']);

const chart = ref();

let { option, updateData } = props.method();

await new Promise((resolve) => {
  setTimeout(() => {
    // updateData();
    resolve();
  }, 1000);
});

setInterval(() => {
  updateData();
}, 5000);

function FullScreen() {
  let domName = chart.value.getDom();
  console.log(domName);
  // 全屏查看
  if (domName.requestFullScreen) {
    // HTML W3C 提议
    domName.requestFullScreen();
  } else if (domName.msRequestFullScreen) {
    // IE11
    domName.msRequestFullScreen();
  } else if (domName.webkitRequestFullScreen) {
    // Webkit
    domName.webkitRequestFullScreen();
  } else if (domName.mozRequestFullScreen) {
    // Firefox
    domName.mozRequestFullScreen();
  }
  chart.value.resize();
}

window.addEventListener('resize', () => {
  chart.value.resize();
});
</script>

<style scoped>
.chart:-webkit-full-screen {
  background-color: #fff;
}
.chart:-moz-full-screen {
  background-color: #fff;
}
.chart:fullscreen {
  background-color: #fff;
}
.full-screen-btn {
  position: absolute;
  top: 5px;
  right: 9px;
  width: 18px;
  height: 18px;
  background-color: transparent;
  border: none;
  z-index: 100;
}
.full-screen-btn:hover {
  cursor: pointer;
}
</style>
