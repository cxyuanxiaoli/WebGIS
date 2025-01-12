<template>
  <div class="main">
    props:
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in list" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.age }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script lang="ts" setup name="PersonProps">
import { withDefaults } from 'vue'
import { type PersonList } from '@/types';
//只接收props
// defineProps(['list'])
//接收props并赋值给变量
// let props = defineProps(['list','value'])
// console.log(props)
//接收props并限制接收的类型
// defineProps<{list: PersonList}>()
//接收props并限制类型，必要性，给出默认值
withDefaults(defineProps<{list?:PersonList}>(),{
  list:()=> [{id:'1',name:'张三',age:20},{id:'2',name:'李四',age:25}]
})

</script>

<style scoped>
.main {
  background-color: skyblue;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
}
table{
  border: 1px solid black;
}
</style>