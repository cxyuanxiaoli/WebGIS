<template>
  <div class='main'>
    <div class="father">
      <h3>父组件</h3>
      <h4>汽车：{{ car }}</h4>
      <h4 v-show="sonToy">玩具：{{ sonToy }}</h4>
      <PropsSon :car="car" :sendToy="getToy" />
    </div>
  </div>
</template>

<script lang='ts' setup>
import PropsSon from '@/components/PropsSon.vue';
import { ref } from 'vue';

const car = ref('宝马');
const sonToy = ref('');

function getToy(value: string) {
  sonToy.value = value;
}
</script>

<style scoped>
.main {
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
}

.father {
  background-color: #a7a7a7;
  border-radius: 10px;
  padding: 10px;
}
</style>