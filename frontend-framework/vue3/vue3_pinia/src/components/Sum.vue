<template>
  <div class="count">
    <h2>当前求和为：{{ count }}-{{ a }}</h2>
    <select v-model.number="n">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </select>
    <button @click="addCount">加</button>
    <button @click="subCount">减</button>
  </div>
</template>

<script lang="ts" setup name="Sum">
import { ref } from 'vue'
import { useSumStore } from '@/store/sum'
import { storeToRefs } from 'pinia'

const sumStore = useSumStore()
console.log(sumStore)
const { count, a } = storeToRefs(sumStore)

let n = ref(1)

function addCount() {
  count.value += n.value
  // sumStore.increment(n.value)
}
function subCount() {
  //批量修改
  sumStore.$patch({
    count: count.value - n.value,
    a: '123'
  })
}
</script>

<style scoped>
.count {
  background-color: #168eff;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  color: white;
  padding: 10px;
}

select,
button {
  width: 50px;
  height: 30px;
  margin-left: 10px;
}
</style>