<template>
  <div class="talk">
    <button @click="getTalk">获取一句土味情话</button>
    <ul>
      <li v-for="talk in talks" :key="talk.id">{{ talk.content }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup name="LoveTalk">
import { useLoveTalkStore } from '@/store/loveTalk'
import { storeToRefs } from 'pinia'

const loveTalkStore = useLoveTalkStore()
const { talks } = storeToRefs(loveTalkStore)

loveTalkStore.$subscribe((mutation, state) => {
  console.log('数据变化了')
  localStorage.setItem('loveTalk', JSON.stringify(state.talks))
})

function getTalk() {
  loveTalkStore.getTalk()
}
</script>

<style scoped>
.talk {
  background-color: #168eff;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  color: white;
  padding: 10px;
  margin-top: 10px;
}
</style>