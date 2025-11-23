import { request } from '@/request'

export async function getRoleListRequest() {
  const res = await request.get('/rolelist')
  return res
}
