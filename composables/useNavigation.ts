// File: composables/useNavigation.ts
// 混合导航系统：配置 + 自动发现（无缓存版本，过滤index.md）

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
  // 获取所有学科 - 直接返回配置
  const getSubjects = async (): Promise<Subject[]> => {
    return Promise.resolve(navigationConfig)
  }

  // 根据学科ID获取学科信息
  const getSubjectById = async (subjectId: string): Promise<Subject | null> => {
    const subject = navigationConfig.find(s => s.id === subjectId)
    return Promise.resolve(subject || null)
  }

  // 根据学科ID和分类ID获取分类信息
  const getCategoryById = async (subjectId: string, categoryId: string): Promise<Category | null> => {
    const subject = navigationConfig.find(s => s.id === subjectId)
    if (!subject) return Promise.resolve(null)
    
    const category = subject.categories.find(c => 
      c.id === categoryId || 
      c.path === `/${subjectId}/${categoryId}`
    )
    return Promise.resolve(category || null)
  }

  // 格式化标题：去掉.md，去掉数字前缀，替换连字符
  const formatTitle = (name: string): string => {
    return name
      .replace(/\.md$/, '')              // 去掉 .md
      .replace(/^[\d]+\./, '')           // 去掉数字前缀 "1."
      .replace(/[-_]/g, ' ')             // 替换连字符和下划线
      .trim()
  }

  // 检查是否为 index 文件
  const isIndexFile = (path: string): boolean => {
    const pathSegments = path.split('/').filter(Boolean)
    const fileName = pathSegments[pathSegments.length - 1]
    return fileName === 'index' || fileName === 'index.md'
  }

  // 递归构建导航项（从 Nuxt Content 数据）
  const buildNavigationItem = async (node: any): Promise<NavigationItem | null> => {
    const pathSegments = node._path?.split('/').filter(Boolean) || []
    const isDirectory = !!(node.children && node.children.length > 0)

    // 获取文件/文件夹名称
    let itemName = 'Untitled'
    if (pathSegments.length > 0) {
      itemName = pathSegments[pathSegments.length - 1]
    }

    // 如果是 index.md 文件且不是目录，则跳过（不在侧边栏显示）
    if (!isDirectory && isIndexFile(node._path)) {
      console.log('跳过 index 文件:', node._path)
      return null
    }

    // 获取标题 - 优先使用文档的title字段，其次使用格式化的文件名
    let title: string
    if (node.title) {
      title = node.title
    } else {
      title = formatTitle(itemName)
    }

    const item: NavigationItem = {
      title,
      _path: node._path || '',
      isDirectory,
      difficulty: node.difficulty,
      description: node.description,
      order: node.order || 0
    }

    // 如果有子节点，递归处理
    if (node.children && node.children.length > 0) {
      const childPromises = node.children.map((child: any) => buildNavigationItem(child))
      const children = await Promise.all(childPromises)

      // 过滤掉 null 值（被跳过的 index 文件）
      const validChildren = children.filter((child): child is NavigationItem => child !== null)

      // 排序：先按 order 字段，再按标题
      item.children = validChildren.sort((a: NavigationItem, b: NavigationItem) => {
        // 首先按 order 排序
        if (a.order !== b.order) {
          return (a.order || 0) - (b.order || 0)
        }
        
        // order 相同时，目录排在前面，文件排在后面
        if (a.isDirectory && !b.isDirectory) return -1
        if (!a.isDirectory && b.isDirectory) return 1
        
        // 最后按标题字母顺序
        return a.title.localeCompare(b.title)
      })

      // 如果过滤后没有子项了，说明只有 index.md，那么这个目录就不应该显示子项
      if (item.children.length === 0) {
        item.children = undefined
      }
    }

    return item
  }

  // 混合模式：获取分类的导航结构
  const getCategoryNavigation = async (categoryPath: string): Promise<NavigationItem[]> => {
    try {
      console.log('混合模式获取分类导航:', categoryPath)

      // 检查是否在配置中存在
      const configItem = findNavItemByPath(categoryPath)
      if (!configItem) {
        console.log('分类不在配置中，跳过自动发现:', categoryPath)
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
          if (node.children) {
            const found = findCategoryNode(node.children, targetPath)
            if (found) return found
          }
        }
        return null
      }

      const categoryNode = findCategoryNode(navigation, categoryPath)
      console.log('找到分类节点:', categoryNode?.title || '未找到')

      if (categoryNode && categoryNode.children) {
        console.log('原始子节点数量:', categoryNode.children.length)
        
        const itemPromises = categoryNode.children.map((child: any) => buildNavigationItem(child))
        const items = await Promise.all(itemPromises)

        // 过滤掉 null 值（被跳过的 index 文件）
        const validItems = items.filter((item): item is NavigationItem => item !== null)

        // 最终排序
        const sortedItems = validItems.sort((a: NavigationItem, b: NavigationItem) => {
          // 首先按 order 排序
          if (a.order !== b.order) {
            return (a.order || 0) - (b.order || 0)
          }
          
          // order 相同时，目录排在前面，文件排在后面
          if (a.isDirectory && !b.isDirectory) return -1
          if (!a.isDirectory && b.isDirectory) return 1
          
          // 最后按标题排序
          return a.title.localeCompare(b.title)
        })

        console.log('过滤后的导航项数量:', sortedItems.length)
        console.log('处理后的导航项:', sortedItems.map(item => ({
          title: item.title,
          path: item._path,
          isDirectory: item.isDirectory,
          order: item.order
        })))

        return sortedItems
      }

      console.log('分类节点没有子内容')
      return []
    } catch (error) {
      console.error(`获取分类导航失败 ${categoryPath}:`, error)
      return []
    }
  }

  // 获取面包屑导航
  const getBreadcrumbs = async (currentPath: string) => {
    return Promise.resolve(getBreadcrumbsFromConfig(currentPath))
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