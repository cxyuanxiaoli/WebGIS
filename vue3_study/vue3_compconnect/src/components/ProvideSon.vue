<template>
  <div class='provide-son'>
    <h3>子组件</h3>
    <ProvideGrandchild />
  </div>
</template>

<script lang='ts' setup>
import ProvideGrandchild from '@/components/ProvideGrandchild.vue';
</script>

<style scoped>
.provide-son {
  padding: 20px;
  background-color: skyblue;
  border-radius: 10px;
  box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.3);
}
</style>