import { postUserListRequest } from '@/request/home/systemManage/userMana'
import type { ISearchData, ISearchUser, IUser } from '@/types'
import { ElMessage } from 'element-plus'
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

  const userlist = ref<IUser[]>([])
  const totalCount = ref(0)
  const pageSize = ref(10)
  const offset = ref(0)

  function getUserList() {
    const searchData: ISearchData = {
      searchUser: searchUser,
      pageSize: pageSize.value,
      offset: offset.value,
    }

    postUserListRequest(searchData)
      .then((res) => {
        if (res.code === 0) {
          userlist.value = res.data.list
          totalCount.value = res.data.totalCount
        } else {
          return Promise.reject(new Error(res.msg))
        }
      })
      .catch((err) => {
        ElMessage.error(err.message)
      })
  }
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
