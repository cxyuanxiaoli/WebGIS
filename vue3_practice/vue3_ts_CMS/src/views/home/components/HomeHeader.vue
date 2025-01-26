<template>
  <div class="homeHeader">
    <button @click="checkOut">退出登录</button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function checkOut() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.homeHeader {
}
</style>
