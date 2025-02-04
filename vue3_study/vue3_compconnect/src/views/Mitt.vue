<template>
  <div class='mitt'>
    <h3>父组件</h3>
    <MittSon1 />
    <MittSon2 />

  </div>
</template>

<script lang='ts' setup>
import MittSon1 from '@/components/MittSon1.vue';
import MittSon2 from '@/components/MittSon2.vue';


</script>

<style scoped>
.mitt {
  margin: 30px;
  padding: 20px;
  background-color: #bababa;
  border-radius: 10px;
}
</style>