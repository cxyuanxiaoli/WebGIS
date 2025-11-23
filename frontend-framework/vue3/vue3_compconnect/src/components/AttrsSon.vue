<template>
  <div class='attrs-son'>
    <h4>子组件</h4>
    <div>{{ $attrs }}</div>
    <AttrsGrandchild v-bind="$attrs" />
  </div>
</template>

<script lang='ts' setup>
import AttrsGrandchild from './AttrsGrandchild.vue';
</script>

<style scoped>
.attrs-son {
  padding: 20px;
  background-color: skyblue;
  box-shadow: 10px 10px 5px #888888;
  border-radius: 10px;
}
</style>