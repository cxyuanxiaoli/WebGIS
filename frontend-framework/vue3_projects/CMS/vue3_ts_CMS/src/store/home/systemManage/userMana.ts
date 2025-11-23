import { postUserListRequest } from '@/request/home/systemManage/userMana'
import type { ISearchData, ISearchUser, IUser } from '@/types'
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useUserManaStore = defineStore('userMana', () => {
  //搜索条件
  const searchUser = reactive<ISearchUser>({
    username: '',
    realname: '',
    tel: '',
    status: '',
    createTimeRange: [],
  })
  //用户列表
  const userlist = ref<IUser[]>([])
  //分页查询参数
  const pageSize = ref(10)
  const offset = ref(0)
  const totalCount = ref(0)

  //获取用户列表
  function getUserList() {
    const searchData: ISearchData = {
      searchUser: searchUser,
      pageSize: pageSize.value,
      offset: offset.value,
    }

    //根据搜索条件获取用户列表，存入userlist
    postUserListRequest(searchData).then((res) => {
      if (res.code === 0) {
        userlist.value = res.data.list
        totalCount.value = res.data.totalCount
      } else {
        return Promise.reject(new Error(res.msg))
      }
    })
  }

  //重置搜索条件
  function resetSearch() {
    Object.assign(searchUser, {
      username: '',
      realname: '',
      tel: '',
      status: '',
      createTimeRange: [],
    })
  }

  return { searchUser, userlist, pageSize, totalCount, offset, getUserList, resetSearch }
})
