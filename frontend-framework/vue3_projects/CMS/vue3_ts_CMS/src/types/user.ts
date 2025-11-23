export interface IUser {
  id?: number
  username: string
  realname: string
  tel: string
  depart: {
    id: number
    name: string
  }
  role?: string
  status?: boolean
  createTime?: string
}

export interface ISearchUser {
  username: string
  realname: string
  tel: string
  status: boolean | string
  createTimeRange: string[]
}

export type TSearchUser = ISearchUser | null

export interface ISearchData {
  searchUser: TSearchUser
  pageSize: number
  offset: number
}
