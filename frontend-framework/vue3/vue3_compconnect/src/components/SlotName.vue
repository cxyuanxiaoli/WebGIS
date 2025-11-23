<template>
  <div class='slot-name'>
    <slot name="header">默认标题</slot>
    <slot name="content">默认内容</slot>
  </div>
</template>

<script lang='ts' setup>

</script>

<style scoped>
.slot-name {
  margin: 10px;
  width: 200px;
  height: 200px;
  background-color: skyblue;
  border-radius: 10px;
  box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.3);
  padding: 1px;
}
</style>