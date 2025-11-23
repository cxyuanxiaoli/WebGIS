<template>
  <h1>Home</h1>
</template>

<script lang="ts" setup name="Home">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(()=>{
  setTimeout(() => {
    router.push('/news')
  }, 3000);
})
</script>

<style scoped>
h1 {
  text-align: center;
}
</style>