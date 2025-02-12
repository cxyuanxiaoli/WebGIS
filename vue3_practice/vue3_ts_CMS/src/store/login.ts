import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type IAccount } from '@/types'
import { loginRequest, userinfoRequest } from '@/request/login'
import router from '@/router'
import { mapMenusToRoutes } from '@/utils/mapMenus'

export const useLoginStore = defineStore('login', () => {
  // state 存储用户信息及状态
  const id = ref(-1)
  const token = ref('')
  const userInfo: any = ref({})
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
        //成功获取用户信息
        userInfo.value = info.data
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      } else {
        return Promise.reject(Error(info.message))
      }

      const userRoutes = mapMenusToRoutes(userInfo.value.menus)
      //动态添加路由
      for (const route of userRoutes) {
        router.addRoute('Home', route)
      }
      //跳转到首页
      router.push('/home')
    } else {
      //登录失败
      return Promise.reject(Error(res.message))
    }
  }
  //加载本地缓存并设置动态路由
  function loadLocalstoreAction() {
    //从本地存储中获取用户信息及状态
    const localToken = localStorage.getItem('token')
    const localUserInfo = localStorage.getItem('userInfo')
    if (localToken && localUserInfo) {
      token.value = localToken
      userInfo.value = JSON.parse(localUserInfo)
    } else {
      return
    }

    const userRoutes = mapMenusToRoutes(userInfo.value.menus)
    //动态添加路由
    for (const route of userRoutes) {
      router.addRoute('Home', route)
    }
  }

  return { id, token, userInfo, loginAccountAction, loadLocalstoreAction }
})
