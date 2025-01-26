<template>
  <div class="home">
    <el-container style="height: 100%">
      <el-aside width="200px">
        <HomeAside />
      </el-aside>
      <el-container>
        <el-header>
          <HomeHeader />
        </el-header>
        <el-main>
          <HomeMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { request } from '@/request'
import HomeAside from './components/HomeAside.vue'
import HomeHeader from './components/HomeHeader.vue'
import HomeMain from './components/HomeMain.vue'

async function test() {
  const res = await request.get('/test2')
  console.log(res?.data)
}
const router = useRouter()
//token可用性测试
test().catch((err) => {
  console.log(err)
  router.push('/login')
})
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>
