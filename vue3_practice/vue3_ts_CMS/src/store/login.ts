import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type IAccount } from '@/types'
import { loginRequest, userinfoRequest } from '@/request/login'
import router from '@/router'

export const useLoginStore = defineStore('login', () => {
  // state 存储用户信息及状态
  const id = ref(-1)
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') ?? 'null') || {})
  // actions
  async function loginAccountAction(account: IAccount) {
    //发送请求得到结果
    const res = await loginRequest(account)
    //登录成功
    if (res.code === 0) {
      //存储用户信息及状态
      id.value = res.data.id
      token.value = res.data.token
      //本地存储token
      localStorage.setItem('token', token.value)

      //获取用户信息
      const info = await userinfoRequest(id.value)
      if (info.code === 0) {
        // console.log(info.data)
        userInfo.value = info.data
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      } else {
        return Promise.reject(Error(info.message))
      }
      //跳转到首页
      router.push('/home')
    } else {
      //登录失败
      return Promise.reject(Error(res.message))
    }
  }

  return { id, token, userInfo, loginAccountAction }
})
