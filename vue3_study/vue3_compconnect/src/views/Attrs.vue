<template>
  <div class='attrs'>
    <h4>父组件</h4>
    <h5>a: {{ a }}</h5>
    <h5>b: {{ b }}</h5>
    <AttrsSon :a="a" :b="b" v-bind="{ x: 100, y: 200 }" />
  </div>
</template>

<script lang='ts' setup>
import AttrsSon from '@/components/AttrsSon.vue';
import { ref } from 'vue';

const a = ref(10);
const b = ref(20);

</script>

<style scoped>
.attrs {
  background-color: #a7a7a7;
  margin: 30px;
  padding: 20px;
  border-radius: 10px;
}
</style>