<template>
  <div class="homeHeader">
    <!-- 展开/收起菜单  面包屑 -->
    <div class="left">
      <el-icon size="30px" @click="changeMenu" class="iconFold">
        <component :is="isFold ? 'Fold' : 'Expand'"></component>
      </el-icon>
      <div>
        <el-breadcrumb separator-icon="ArrowRightBold">
          <el-breadcrumb-item
            v-for="item in breadcrumb"
            :key="item.id"
            :to="{ name: item.pathName }"
          >
            {{ item.label }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!-- 右侧控制按钮 -->
    <div class="right">
      <el-icon size="25px" class="iconControl"><Message /></el-icon>
      <el-icon size="25px" class="iconControl"><Notebook /></el-icon>
      <el-icon size="25px" class="iconControl"><TurnOff /></el-icon>
      <div class="iconControl">
        <!-- 头像 -->
        <el-avatar :size="35" src="" />
        <!-- 下拉菜单 -->
        <el-dropdown>
          <span class="userName"> {{ userInfo.username }} </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-icon><User /></el-icon>
                个人信息
              </el-dropdown-item>
              <el-dropdown-item>
                <el-icon><Lock /></el-icon>
                忘记密码
              </el-dropdown-item>
              <el-dropdown-item @click="checkOut" divided>
                <el-icon><CloseBold /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useLoginStore } from '@/store/login/login'
import { storeToRefs } from 'pinia'
import { mapPathToBreadcrumb } from '@/utils/mapMenus'

const router = useRouter()
const isFold = ref(false)
const { userInfo } = storeToRefs(useLoginStore())
const emits = defineEmits(['foldMenu'])

//展开/收起菜单
function changeMenu() {
  isFold.value = !isFold.value
  emits('foldMenu', isFold.value)
}
//退出登录
function checkOut() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
}

const route = useRoute()
//面包屑获取, 监听路由变化
const breadcrumb = computed(() => {
  return mapPathToBreadcrumb(route.name, userInfo.value.menus)
})
</script>

<style scoped>
.homeHeader {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.left {
  display: flex;
  align-items: center;
  .iconFold {
    padding: 0 5px;
    cursor: pointer;
  }
}
.right {
  display: flex;
  align-items: center;
  margin-right: 20px;

  .iconControl {
    color: #686868;
    margin: 0 8px;
    display: flex;
    align-items: center;
    .userName {
      margin: 0 5px;
      font-size: 15px;
      cursor: pointer;
    }
  }
}
</style>
