import { request } from '@/request'
import type { ISearchData, IUser } from '@/types'

export async function postUserListRequest(searchData: ISearchData) {
  const res = (await request.post('/userlist', searchData)) as any
  return res
}

export async function postAddUserRequest(user: IUser) {
  const res = (await request.post('/user/add', user)) as any
  return res
}

export async function deleteUserRequest(id: number) {
  const res = (await request.delete('/user/' + id)) as any
  return res
}

export async function putEditUserRequest(id: number, userInfo: IUser) {
  const res = (await request.put('/user/' + id, userInfo)) as any
  return res
}
