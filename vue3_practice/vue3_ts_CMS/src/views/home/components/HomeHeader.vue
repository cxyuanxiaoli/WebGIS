<template>
  <div class="homeHeader">
    <!-- 展开/收起菜单  面包屑 -->
    <div class="left">
      <el-icon size="30px" @click="changeMenu" class="iconFold">
        <component :is="isFold ? 'Fold' : 'Expand'"></component>
      </el-icon>
      <div>面包屑</div>
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
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useLoginStore } from '@/store/login'
import { storeToRefs } from 'pinia'

const router = useRouter()
const isFold = ref(false)
const { userInfo } = storeToRefs(useLoginStore())

const emits = defineEmits(['foldMenu'])

function changeMenu() {
  isFold.value = !isFold.value
  emits('foldMenu', isFold.value)
}

function checkOut() {
  localStorage.removeItem('token')
  router.push('/login')
}
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
