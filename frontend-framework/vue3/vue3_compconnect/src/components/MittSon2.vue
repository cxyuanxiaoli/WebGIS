<template>
  <div class='mittSon2'>
    <h3>子组件2</h3>
    <h4>电脑：{{ computer }}</h4>
    <h4 v-show="son1Toy">兄弟组件的玩具：{{ son1Toy }}</h4>
  </div>
</template>

<script lang='ts' setup>
import { ref, onUnmounted } from 'vue'
import emitter from '@/utils/emitter';

const computer = ref('PC')
const son1Toy = ref('')
emitter.on('send-toy', (toy: any) => {
  son1Toy.value = toy
  console.log(toy);

})

onUnmounted(() => {
  emitter.off('send-toy')
})
</script>

<style scoped>
.mittSon2 {
  background-color: #6e9cff;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #333;

}
</style>