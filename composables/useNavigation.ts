// File: composables/useNavigation.ts
// 修复版本：确保所有返回的数据都是可序列化的

import { navigationConfig, findNavItemByPath, getBreadcrumbsFromConfig } from '~/config/navigation.config'
import type { Subject, Category } from '~/config/navigation.config'

export interface NavigationItem {
  title: string
  _path: string
  difficulty?: string
  children?: NavigationItem[]
  isDirectory: boolean
  description?: string
  icon?: string
  order?: number
}

export const useNavigation = () => {
  // 获取所有学科 - 返回序列化友好的数据
  const getSubjects = async (): Promise<Subject[]> => {
    return Promise.resolve(JSON.parse(JSON.stringify(navigationConfig)))
  }

  // 根据学科ID获取学科信息
  const getSubjectById = async (subjectId: string): Promise<Subject | null> => {
    const subject = navigationConfig.find(s => s.id === subjectId)
    return Promise.resolve(subject ? JSON.parse(JSON.stringify(subject)) : null)
  }

  // 根据学科ID和分类ID获取分类信息
  const getCategoryById = async (subjectId: string, categoryId: string): Promise<Category | null> => {
    const subject = navigationConfig.find(s => s.id === subjectId)
    if (!subject) return Promise.resolve(null)
    
    const category = subject.categories.find(c => 
      c.id === categoryId || 
      c.path === `/${subjectId}/${categoryId}`
    )
    return Promise.resolve(category ? JSON.parse(JSON.stringify(category)) : null)
  }

  // 格式化标题：去掉.md，去掉数字前缀，替换连字符
  const formatTitle = (name: string): string => {
    return name
      .replace(/\.md$/, '')
      .replace(/^[\d]+\./, '')
      .replace(/[-_]/g, ' ')
      .trim()
  }

  // 检查是否为 index 文件
  const isIndexFile = (path: string): boolean => {
    const pathSegments = path.split('/').filter(Boolean)
    const fileName = pathSegments[pathSegments.length - 1]
    return fileName === 'index' || fileName === 'index.md'
  }

  // 递归构建导航项（确保返回纯对象）
  const buildNavigationItem = async (node: any): Promise<NavigationItem | null> => {
    const pathSegments = node._path?.split('/').filter(Boolean) || []
    const isDirectory = !!(node.children && node.children.length > 0)

    // 获取文件/文件夹名称
    let itemName = 'Untitled'
    if (pathSegments.length > 0) {
      itemName = pathSegments[pathSegments.length - 1]
    }

    // 如果是 index.md 文件且不是目录，则跳过
    if (!isDirectory && isIndexFile(node._path)) {
      return null
    }

    // 获取标题
    let title: string
    if (node.title) {
      title = String(node.title) // 确保是字符串
    } else {
      title = formatTitle(itemName)
    }

    // 创建纯对象（避免任何非序列化属性）
    const item: NavigationItem = {
      title,
      _path: String(node._path || ''),
      isDirectory,
      difficulty: node.difficulty ? String(node.difficulty) : undefined,
      description: node.description ? String(node.description) : undefined,
      order: typeof node.order === 'number' ? node.order : 0
    }

    // 如果有子节点，递归处理
    if (node.children && Array.isArray(node.children) && node.children.length > 0) {
      const childPromises = node.children.map((child: any) => buildNavigationItem(child))
      const children = await Promise.all(childPromises)

      // 过滤掉 null 值并确保是纯对象数组
      const validChildren = children
        .filter((child): child is NavigationItem => child !== null)
        .map(child => JSON.parse(JSON.stringify(child))) // 深拷贝确保纯对象

      // 排序
      item.children = validChildren.sort((a: NavigationItem, b: NavigationItem) => {
        if (a.order !== b.order) {
          return (a.order || 0) - (b.order || 0)
        }
        
        if (a.isDirectory && !b.isDirectory) return -1
        if (!a.isDirectory && b.isDirectory) return 1
        
        return a.title.localeCompare(b.title)
      })

      if (item.children.length === 0) {
        item.children = undefined
      }
    }

    return item
  }

  // 混合模式：获取分类的导航结构
  const getCategoryNavigation = async (categoryPath: string): Promise<NavigationItem[]> => {
    try {
      // 检查是否在配置中存在
      const configItem = findNavItemByPath(categoryPath)
      if (!configItem) {
        return []
      }

      // 使用 Nuxt Content 自动发现该路径下的内容
      const navigation = await fetchContentNavigation()
      
      // 递归查找目标分类节点
      const findCategoryNode = (nodes: any[], targetPath: string): any => {
        for (const node of nodes) {
          if (node._path === targetPath) {
            return node
          }
          if (node.children && Array.isArray(node.children)) {
            const found = findCategoryNode(node.children, targetPath)
            if (found) return found
          }
        }
        return null
      }

      const categoryNode = findCategoryNode(navigation, categoryPath)

      if (categoryNode && categoryNode.children && Array.isArray(categoryNode.children)) {
        const itemPromises = categoryNode.children.map((child: any) => buildNavigationItem(child))
        const items = await Promise.all(itemPromises)

        // 过滤掉 null 值并确保返回纯对象数组
        const validItems = items
          .filter((item): item is NavigationItem => item !== null)
          .map(item => JSON.parse(JSON.stringify(item))) // 深拷贝确保纯对象

        // 最终排序
        const sortedItems = validItems.sort((a: NavigationItem, b: NavigationItem) => {
          if (a.order !== b.order) {
            return (a.order || 0) - (b.order || 0)
          }
          
          if (a.isDirectory && !b.isDirectory) return -1
          if (!a.isDirectory && b.isDirectory) return 1
          
          return a.title.localeCompare(b.title)
        })

        return sortedItems
      }

      return []
    } catch (error) {
      console.error(`获取分类导航失败 ${categoryPath}:`, error)
      return []
    }
  }

  // 获取面包屑导航
  const getBreadcrumbs = async (currentPath: string) => {
    const breadcrumbs = getBreadcrumbsFromConfig(currentPath)
    return Promise.resolve(JSON.parse(JSON.stringify(breadcrumbs)))
  }

  return {
    getSubjects,
    getSubjectById,
    getCategoryById,
    getCategoryNavigation,
    getBreadcrumbs,
    formatTitle
  }
}

// 导出类型
export type { NavigationItem, Subject, Category }