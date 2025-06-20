// File: server/api/navigation/[path].get.ts
// 带缓存的导航 API

import { serverQueryContent } from '#content/server'
import { navigationConfig, findNavItemByPath } from '~/config/navigation.config'

interface NavigationItem {
  title: string
  _path: string
  difficulty?: string
  children?: NavigationItem[]
  isDirectory: boolean
  description?: string
  icon?: string
  order?: number
}

// 内存缓存
const navigationCache = new Map<string, NavigationItem[]>()
const CACHE_TTL = 1000 * 60 * 5 // 5分钟缓存

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path parameter is required'
    })
  }

  // 构建完整路径
  const fullPath = path.startsWith('/') ? path : `/${path}`
  
  // 检查缓存
  if (navigationCache.has(fullPath)) {
    console.log('从缓存返回导航数据:', fullPath)
    return navigationCache.get(fullPath)
  }

  try {
    console.log('生成导航数据:', fullPath)

    // 检查是否在配置中存在
    const configItem = findNavItemByPath(fullPath)
    if (!configItem) {
      console.log('路径不在配置中:', fullPath)
      return []
    }

    // 使用 serverQueryContent 获取导航结构
    const navigation = await serverQueryContent(event).find()
    
    // 查找目标路径的内容
    const pathContent = navigation.find(item => item._path === fullPath)
    
    if (!pathContent) {
      console.log('未找到路径内容:', fullPath)
      return []
    }

    // 查询该路径下的所有子内容
    const childrenQuery = navigation.filter(item => 
      item._path && 
      item._path.startsWith(fullPath + '/') &&
      item._path.split('/').length === fullPath.split('/').length + 1
    )

    console.log('找到子内容数量:', childrenQuery.length)

    // 格式化标题
    const formatTitle = (name: string): string => {
      return name
        .replace(/\.md$/, '')
        .replace(/^[\d]+\./, '')
        .replace(/[-_]/g, ' ')
        .trim()
    }

    // 构建导航项
    const buildItems = async (items: any[]): Promise<NavigationItem[]> => {
      const result: NavigationItem[] = []

      for (const item of items) {
        if (!item._path) continue

        const pathSegments = item._path.split('/').filter(Boolean)
        const itemName = pathSegments[pathSegments.length - 1]
        
        // 检查是否有子内容（是否为目录）
        const hasChildren = navigation.some(child => 
          child._path && child._path.startsWith(item._path + '/')
        )

        const navItem: NavigationItem = {
          title: item.title || formatTitle(itemName),
          _path: item._path,
          isDirectory: hasChildren,
          difficulty: item.difficulty,
          description: item.description,
          order: item.order || 0
        }

        // 如果有子内容，递归获取
        if (hasChildren) {
          const children = navigation.filter(child => 
            child._path && 
            child._path.startsWith(item._path + '/') &&
            child._path.split('/').length === item._path.split('/').length + 1
          )
          navItem.children = await buildItems(children)
        }

        result.push(navItem)
      }

      // 排序
      return result.sort((a, b) => {
        if (a.order !== b.order) {
          return (a.order || 0) - (b.order || 0)
        }
        if (a.isDirectory && !b.isDirectory) return -1
        if (!a.isDirectory && b.isDirectory) return 1
        return a.title.localeCompare(b.title)
      })
    }

    const result = await buildItems(childrenQuery)
    
    // 缓存结果
    navigationCache.set(fullPath, result)
    
    // 设置TTL（简单实现）
    setTimeout(() => {
      navigationCache.delete(fullPath)
    }, CACHE_TTL)

    console.log('返回导航项数量:', result.length)
    return result

  } catch (error) {
    console.error(`获取导航失败 ${fullPath}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch navigation'
    })
  }
})