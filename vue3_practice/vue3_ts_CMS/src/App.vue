<script setup lang="ts" name="App">
import { RouterLink, RouterView } from 'vue-router'
// import { request } from './request'

// async function test() {
//   const res = await request.get('/')
//   console.log(res.data)
// }

// test()
</script>

<template>
  <header>
    <h2>Hello World2</h2>
  </header>

  <main>
    <RouterLink to="/home">主页</RouterLink>
    <RouterLink to="/login">登录</RouterLink>
    <RouterView></RouterView>
  </main>
</template>

<style scoped></style>
