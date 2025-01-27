<script setup lang="ts" name="App">
import { RouterView } from 'vue-router'
import { request } from './request'

async function test() {
  const res = await request.get('/test')
  console.log(res.data)
}

test()
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  background-color: rgb(230, 230, 230);
}
</style>
