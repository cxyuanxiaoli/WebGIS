<template>
  <div class="main">
    <h2>life cycle</h2>
  </div>
</template>

<script lang="ts" setup name="LifeCycle">
//生命周期
import { onBeforeMount,onMounted,onBeforeUpdate,onUpdated,onBeforeUnmount,onUnmounted } from 'vue';

console.log('life cycle:创建')
onBeforeMount(()=>{
  console.log('life cycle:挂载前')
})
onMounted(()=>{
  console.log('life cycle:挂载完毕')
})
onBeforeUpdate(()=>{
  console.log('life cycle:更新前')
})
onUpdated(()=>{
  console.log('life cycle:更新完毕')
})
onBeforeUnmount(()=>{
  console.log('life cycle:卸载前')
})
onUnmounted(()=>{
  console.log('life cycle:卸载完毕')
})

</script>

<style scoped>
.main {
  background-color: skyblue;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
}
</style>