import systemView from '@/router/home/systemView'
import systemManage from '@/router/home/systemManage'
import goodCenter from '@/router/home/goodCenter'
import sayTalks from '@/router/home/sayTalks'
import { type RouteRecordRaw } from 'vue-router'

//将用户菜单映射为路由对象
export function mapMenusToRoutes(menus: any) {
  const userRoutes: RouteRecordRaw[] = []

  for (const menu of menus) {
    const id = menu.id

    if (id === 1) {
      userRoutes.push(...systemView)
    } else if (id === 2) {
      userRoutes.push(...systemManage)
    } else if (id === 3) {
      userRoutes.push(...goodCenter)
    } else if (id === 4) {
      userRoutes.push(...sayTalks)
    }
  }
  return userRoutes
}

//根据当前路径获取面包屑数据
export function mapPathToBreadcrumb(pathName: any, userMenus: any) {
  let breadcrumb
  for (const menu of userMenus) {
    for (const item of menu.children) {
      if (item.urlName === pathName) {
        breadcrumb = [
          {
            id: menu.id,
            label: menu.name,
            pathName: menu.children[0].urlName,
          },
          {
            id: item.id,
            label: item.name,
            pathName: item.urlName,
          },
        ]
      }
    }
  }
  return breadcrumb
}
