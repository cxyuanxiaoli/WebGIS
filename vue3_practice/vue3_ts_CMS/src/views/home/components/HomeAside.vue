<template>
  <div class="homeAside">
    <div class="logo">
      <img src="@/assets/img/logo.svg" />
      <h3>Vue-Ts-CMS</h3>
    </div>
    <div class="menu">
      <!-- 菜单 -->
      <el-menu
        active-text-color="#ffd04b"
        background-color="#001529"
        :default-active="`${menu[0].children[0].id}`"
        text-color="#fff"
      >
        <template v-for="item in menu" :key="item.id">
          <!-- 动态渲染菜单项 -->
          <el-sub-menu :index="item.id + ''">
            <template #title>
              <el-icon><component :is="item.icon"></component></el-icon>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="subItem.id + ''"
            >
              {{ subItem.name }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoginStore } from '@/store/login'

const loginStore = useLoginStore()
//获取用户权限菜单
const menu = loginStore.userInfo.menus
</script>

<style scoped>
.homeAside {
  height: 100%;
  background-color: #001529;
  padding-top: 5%;
  box-sizing: border-box;
  overflow: hidden;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 5%;
  img {
    width: 15%;
    margin-right: 5%;
  }
}
</style>
