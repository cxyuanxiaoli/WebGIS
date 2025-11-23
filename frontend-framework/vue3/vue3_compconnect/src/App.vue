<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <h1>Vue 3 CompConnect</h1>
  <div class="app">
    <div class="menu">
      <div>
        <RouterLink active-class="active" to="/props">1.props</RouterLink>
      </div>
      <div>
        <RouterLink active-class="active" to="/custom-event">2.自定义事件</RouterLink>
      </div>
      <div>
        <RouterLink active-class="active" to="/mitt">3.mitt</RouterLink>
      </div>
      <div>
        <RouterLink active-class="active" to="/v-model">4.v-model</RouterLink>
      </div>
      <div>
        <RouterLink active-class="active" to="/attrs">5.$attrs</RouterLink>
      </div>
      <div>
        <RouterLink active-class="active" to="/refs-parent">6.$refs、$parent</RouterLink>
      </div>
      <div>
        <RouterLink active-class="active" to="/provide-inject">7.provide/inject</RouterLink>
      </div>
      <div>
        <RouterLink active-class="active" to="/">8.pinia</RouterLink>
      </div>
      <div>
        <RouterLink active-class="active" to="/slot">9.slot</RouterLink>
      </div>

    </div>
    <div class="content">
      <RouterView />
    </div>

  </div>
</template>

<style scoped>
.app {
  height: 700px;
  display: flex;
}

.menu {

  width: 20%;
  height: 100%;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;

  &>div {
    height: 11%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;

    a {
      text-decoration: none;
      color: black;
    }

    .active {
      color: #5875f7;
    }
  }
}

.content {
  width: 80%;
}
</style>
