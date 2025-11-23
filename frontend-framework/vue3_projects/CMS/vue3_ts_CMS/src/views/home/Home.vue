<template>
  <div class="home">
    <el-container style="height: 100%">
      <el-aside :width="isCollapse ? '60px' : '200px'" class="homeAside">
        <HomeAside :isCollapse="isCollapse" />
      </el-aside>
      <el-container>
        <el-header class="header">
          <HomeHeader @foldMenu="foldMenu" />
        </el-header>
        <el-main class="main">
          <HomeMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import HomeAside from './components/HomeAside.vue'
import HomeHeader from './components/HomeHeader.vue'
import HomeMain from './components/HomeMain.vue'

const isCollapse = ref(false)

function foldMenu(isFold: boolean) {
  isCollapse.value = isFold
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
}

.header {
  padding: 0;
  height: 45px;
  border-radius: 10px;
  background-color: white;
}
.homeAside {
  transition: width 0.5s ease-in-out;
}
.main {
  padding: 8px;
}
</style>
