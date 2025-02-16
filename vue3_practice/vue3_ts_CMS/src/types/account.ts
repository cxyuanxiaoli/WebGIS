export interface IAccount {
  username: string
  password: string
}

export interface IUser {
  id?: number
  username: string
  realname: string
  tel: string
  depart: number
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

export interface IDepart {
  id: number
  name: string
}
