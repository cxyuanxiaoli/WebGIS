<template>
  <div class='custom-event'>
    <div class="father">
      <h3>父组件</h3>
      <button @click="handleClick(1, $event)"> click</button>
      <h4 v-show="sonToy">子组件的玩具：{{ sonToy }}</h4>
      <CustomEventSon @send-toy="getToy" />
    </div>
  </div>
</template>

<script lang='ts' setup>
import CustomEventSon from '@/components/CustomEventSon.vue';
import { ref } from 'vue'

const sonToy = ref('')

function handleClick(a: any, b: any) {
  console.log(a, b);

}

function getToy(toy: string) {
  sonToy.value = toy
}
</script>

<style scoped>
.custom-event {
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