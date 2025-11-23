<template>
  <div class="login">
    <h1>后台管理系统</h1>
    <LoginTabs ref="loginTabs" :keepPassword="keepPassword" />
    <div class="controls">
      <el-checkbox v-model="keepPassword" label="记住密码" size="large" />
      <el-link type="primary">忘记密码</el-link>
    </div>
    <el-button class="subBtn" @click="submitInfo" type="primary" size="large">立即登录</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import LoginTabs from './components/LoginTabs.vue'
//获取tab页组件实例对象
const loginTabs = ref<InstanceType<typeof LoginTabs>>()
//记录是否记住密码
const keepPassword = ref(localStorage.getItem('keepPassword') === 'true')

//点击登录按钮调用组件实例的submit方法
function submitInfo() {
  loginTabs.value?.submit()
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: url('@/assets/img/background.jpg');
  background-size: cover;
}
.controls {
  width: 300px;
  display: flex;
  justify-content: space-between;
}
.subBtn {
  width: 300px;
}
</style>
