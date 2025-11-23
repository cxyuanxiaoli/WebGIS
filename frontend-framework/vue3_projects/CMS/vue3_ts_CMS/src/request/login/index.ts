import { request } from '..'
import { type IAccount } from '@/types'

export async function loginRequest(account: IAccount) {
  const res = (await request.post('/login', account)) as any
  return res
}

export async function userinfoRequest(id: number) {
  const res = (await request.get(`/user/${id}`)) as any
  return res
}

export async function tokenTestRequest() {
  await request.get('/test2')
}
