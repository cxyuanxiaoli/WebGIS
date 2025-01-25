<template>
  <div class="tabs">
    <el-tabs type="border-card" :stretch="true" v-model="selectTab">
      <!-- tab1 -->
      <el-tab-pane label="帐号登录" name="account">
        <!-- 插槽 -->
        <template #label>
          <div class="text">
            <div class="icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <span>帐号登录</span>
          </div>
        </template>
        <!-- 表单 -->
        <el-form
          label-width="60px"
          :model="accountData"
          label-position="right"
          :rules="accountRules"
          status-icon
          ref="accountForm"
        >
          <el-form-item label="帐号" prop="userName">
            <el-input v-model="accountData.userName" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="accountData.password" show-password />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- tab2 -->
      <el-tab-pane label="手机号登录" name="phone">
        <!-- 插槽 -->
        <template #label>
          <div class="text">
            <div class="icon">
              <el-icon><Cellphone /></el-icon>
            </div>
            <span>手机号登录</span>
          </div>
        </template>
        <!-- 表单 -->
        <el-form label-width="60px">
          <el-form-item label="手机号">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <div class="verifyCode">
              <el-input></el-input>
              <el-button type="primary" class="verifyBtn">获取验证码</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { type FormRules, type ElForm, ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useLoginStore } from '@/store/login'

const loginStore = useLoginStore()

//获取选择的tab页
const selectTab = ref('account')
//获取表单组件实例对象
const accountForm = ref<InstanceType<typeof ElForm>>()
//获取父组件传递的keepPassword属性
const props = defineProps(['keepPassword'])
//表单数据
const accountData = reactive({
  userName: localStorage.getItem('username') || '',
  password: localStorage.getItem('password') || '',
})

//表单验证规则
const accountRules: FormRules = {
  userName: [
    {
      required: true,
      message: '请输入帐号!',
      trigger: 'blur',
    },
    {
      min: 6,
      max: 20,
      message: '用户名长度在6到20个字符',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码!',
      trigger: 'blur',
    },
    {
      min: 6,
      message: '密码长度不能小于6位',
      trigger: 'blur',
    },
  ],
}

//登录按钮逻辑
function submit() {
  //表单验证
  accountForm.value?.validate((valid) => {
    if (valid) {
      //账号密码登录逻辑
      if (selectTab.value === 'account') {
        //调用action方法
        loginStore
          .loginAccountAction({
            username: accountData.userName,
            password: accountData.password,
          })
          .then(() => {
            //登录成功
            if (props.keepPassword) {
              //记住密码逻辑
              localStorage.setItem('username', accountData.userName)
              localStorage.setItem('password', accountData.password)
              localStorage.setItem('keepPassword', 'true')
            } else {
              //未记住密码逻辑
              localStorage.removeItem('username')
              localStorage.removeItem('password')
              localStorage.removeItem('keepPassword')
            }
          })
      } else {
        //手机号登录逻辑
        ElMessage.warning('手机号登录暂未开放')
      }
    } else {
      ElMessage.error('请输入正确信息')
    }
  })
}

//暴露给父组件的方法
defineExpose({
  submit,
})
</script>

<style scoped>
.tabs {
  width: 300px;
}
.text {
  display: flex;
  align-items: center;
}
.icon {
  margin-right: 5px;
  position: relative;
  transform: translateY(2px);
}

.verifyCode {
  display: flex;
  .verifyBtn {
    margin-left: 5px;
  }
}
</style>
