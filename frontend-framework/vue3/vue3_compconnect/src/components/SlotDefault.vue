<template>
  <div class='slot-default'>
    <h3>{{ title }}</h3>
    <slot>默认内容</slot>
  </div>
</template>

<script lang='ts' setup>
defineProps(['title'])
</script>

<style scoped>
.slot-default {
  margin: 10px;
  width: 250px;
  height: 250px;
  background-color: skyblue;
  border-radius: 10px;
  box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.3);
  padding: 1px;
}

h3 {
  background-color: #ff8d47;
  text-align: center;
}
</style>