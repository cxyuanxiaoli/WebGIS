<template>
  <div class='refs-parent'>
    <h3>父组件</h3>
    <h4>房产：{{ house }}</h4>
    <button @click="getAllRefs($refs)">获取所有ref组件实例</button>
    <button @click="addBook($refs)">增加所有子组件book数量</button>
    <RefsParentChild1 ref="c1" />
    <RefsParentChild2 ref="c2" />
    <div ref="div"></div>
  </div>
</template>

<script lang='ts' setup>
import RefsParentChild1 from '@/components/RefsParentChild1.vue';
import RefsParentChild2 from '@/components/RefsParentChild2.vue';
import { ref } from 'vue';

const c1 = ref();
const c2 = ref();
const div = ref();
const house = ref(4)
defineExpose({ house })

function getAllRefs(value: any) {
  console.log(value);
  console.log(c1.value.book);
}
function addBook(value: any) {
  for (let key in value) {
    value[key].book += 1;
  }
}
</script>


<style scoped>
.refs-parent {
  margin: 30px;
  padding: 20px;
  background-color: #a7a7a7;
  border-radius: 10px;

}
</style>