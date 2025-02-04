<template>
  <div class='slot-scope'>
    <h3>日期列表</h3>
    <slot :days="dayList"></slot>
  </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue';

const dayList = reactive(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
</script>

<style scoped>
.slot-scope {
  padding: 5px;
  box-sizing: border-box;
  width: 200px;
  background-color: skyblue;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}
</style>