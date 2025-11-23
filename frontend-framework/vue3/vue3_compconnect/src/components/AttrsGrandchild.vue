<template>
  <div class='attrs-grandchild'>
    <h4>孙组件</h4>
    <h5>a:{{ a }}</h5>
    <h5>b:{{ b }}</h5>
    <h5>x:{{ x }}</h5>
    <h5>y:{{ y }}</h5>
  </div>
</template>

<script lang='ts' setup>
defineProps(['a', 'b', 'x', 'y'])
</script>

<style scoped>
.attrs-grandchild {
  padding: 10px;
  background-color: #ff7a7a;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}
</style>