<template>
  <div class="homeAside">
    <div class="logo">
      <img src="@/assets/img/logo.svg" />
      <h3 v-show="!isCollapse">Vue-Ts-CMS</h3>
    </div>
    <div class="menu">
      <!-- 菜单 -->
      <el-menu
        active-text-color="#ffd04b"
        background-color="#001529"
        :default-active="`${menu[0].children[0].id}`"
        text-color="#fff"
        :collapse="isCollapse"
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
              class="menuItem"
            >
              <RouterLink :to="{ name: subItem.urlName }" active-class="active">{{
                subItem.name
              }}</RouterLink>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoginStore } from '@/store/login/login'
import { RouterLink } from 'vue-router'

const loginStore = useLoginStore()
//获取用户权限菜单
const menu = loginStore.userInfo.menus

defineProps(['isCollapse'])
</script>

<style scoped>
.homeAside {
  height: 100%;
  width: 100%;
  background-color: #001529;
  overflow: hidden;
}

.logo {
  height: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 5% 0;
  img {
    height: 60%;
    margin-right: 5%;
  }
}

.menuItem {
  a {
    text-decoration: none;
    color: white;
  }
  .active {
    color: #ff9940;
  }
}
</style>
