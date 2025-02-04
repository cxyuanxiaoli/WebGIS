<template>
  <div class='v-model'>
    父组件
    <div>
      <!-- v-model用在html标签上 -->
      name:
      <!-- <input type="text" v-model="name"> -->
      <input type="text" :value="name" @input="name = (<HTMLInputElement>$event.target).value">
      <br>
      <!-- v-model用在自定义组件上 -->
      myinput:
      <!-- <MyInput v-model="name" /> -->
      <!-- <MyInput :modelValue="name" @update:modelValue="name = $event" /> -->
      <MyInput v-model:name="name" v-model:password="password" />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import MyInput from '@/components/MyInput.vue';

const name = ref('zhangsan')
const password = ref('123456')
</script>

<style scoped>
.v-model {
  margin: 30px;
  padding: 20px;
  background-color: #a7a7a7;
  border-radius: 10px;
}
</style>