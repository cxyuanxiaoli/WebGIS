<template>
  <div>
    <h4>Detail</h4>
    <ul>
      <li>
        id:{{ id }}
      </li>
      <li>
        title:{{ title }}
      </li>
      <li>
        content:{{ content }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup name="Detail">
import { useRoute } from 'vue-router'
import { toRefs } from 'vue'

//接收query参数
// let route=useRoute()
// let { query } = toRefs(route)
// console.log(query.value.id,query.value.title,query.value.content)

//接收params参数
// let route = useRoute()
// console.log(route.params.id,route.params.title,route.params.content)

//使用组件的props接收参数
defineProps(['id', 'title', 'content'])

</script>

<style scoped></style>