import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type IAccount } from '@/types'
import { accountRequest } from '@/request/login'
import { ElMessage } from 'element-plus'
import router from '@/router'

export const useLoginStore = defineStore('login', () => {
  // state 存储用户信息及状态
  const name = ref('')
  const id = ref(localStorage.getItem('token') || '')
  const token = ref('')
  // actions
  async function loginAccountAction(account: IAccount) {
    //发送请求得到结果
    const res = await accountRequest(account)
    //登录成功
    if (res.code === 0) {
      //存储用户信息及状态
      id.value = res.data.id
      name.value = res.data.name
      token.value = res.data.token
      //本地存储token
      localStorage.setItem('token', token.value)
      //跳转到首页
      router.push('/home')
    } else {
      //登录失败
      ElMessage.error(res.message)
      return Promise.reject()
    }
  }

  return { name, id, token, loginAccountAction }
})
