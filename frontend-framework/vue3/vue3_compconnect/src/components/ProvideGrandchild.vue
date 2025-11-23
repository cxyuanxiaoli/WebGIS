<template>
  <div class='provide-grandchild'>
    <h3>孙组件</h3>
    <p>父组件提供的钱：{{ money }}</p>
    <p>父组件提供的车：一辆{{ car.brand }}, 价值{{ car.price }}</p>
  </div>
</template>

<script lang='ts' setup>
import { inject } from 'vue';

const money = inject('money', 0);
const car = inject('car', { brand: '', price: 0 });
</script>

<style scoped>
.provide-grandchild {
  padding: 20px;
  background-color: rgb(255, 92, 92);
  border-radius: 10px;
  box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.3);
}
</style>