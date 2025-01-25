import { request } from '..'
import { type IAccount } from '@/types'

export async function accountRequest(account: IAccount) {
  const res = (await request.post('/login', account)) as any
  return res
}
