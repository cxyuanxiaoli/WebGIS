<template>
  <div class="homeMain">
    <RouterView />
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
</script>

<style scoped>
.homeMain {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 8px;
}
</style>
