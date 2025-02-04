<template>
  <div class='provide-inject'>
    <h3>父组件</h3>
    <h4>银子: {{ money }}</h4>
    <h4>汽车: 一辆{{ car.brand }}, 价值 {{ car.price }}</h4>
    <ProvideSon />
  </div>
</template>

<script lang='ts' setup>
import ProvideSon from '@/components/ProvideSon.vue';
import { ref, reactive, provide } from 'vue';

const money = ref(1000);
const car = reactive({
  brand: 'BMW',
  price: 100000
})
provide('money', money)
provide('car', car)

</script>

<style scoped>
.provide-inject {
  margin: 30px;
  padding: 20px;
  border-radius: 10px;
  background-color: #a7a7a7;
}
</style>