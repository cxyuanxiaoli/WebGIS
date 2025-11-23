import { request } from '@/request'

export async function getDepartListRequest() {
  const res = await request.get('/departlist')
  return res
}
