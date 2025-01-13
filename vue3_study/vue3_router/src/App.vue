<script setup lang="ts" name="App">
import { RouterView, RouterLink } from 'vue-router'

</script>

<template>
  <div class="title">
    <h2>Vue Router</h2>

  </div>
  <div class="navigate">
    <RouterLink to="/home" active-class="active"> Home </RouterLink>
    <RouterLink :to="{ path: '/news' }" active-class="active"> News </RouterLink>
    <RouterLink replace :to="{ name: 'guanyu' }" active-class="active"> About </RouterLink>
  </div>
  <div class="content">
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
}

.navigate {
  display: flex;
  justify-content: space-around;

  a {
    display: inline-block;
    width: 100px;
    height: 30px;
    background-color: #c48080;
    border-radius: 10px;
    text-align: center;
    line-height: 30px;
    text-decoration: none;
    color: aliceblue;
  }

  .active {
    background-color: #ee3c3c;
    color: rgb(176, 255, 255);
  }
}

.content {
  margin: 10px 20px 0;
  height: 500px;
  border: 1px solid #646464;
  border-radius: 10px;
}
</style>
