// File: composables/useNavigation.ts
import { navigationConfig, type Subject, type Category } from '~/config/navigation'

export interface NavigationItem {
  title: string
  _path: string
  difficulty?: string
  children?: NavigationItem[]
  isDirectory: boolean
}

export { type Subject, type Category }

export const useNavigation = () => {
  // 获取所有学科（从静态配置）
  const getSubjects = (): Subject[] => {
    return navigationConfig.subjects
  }

  // 根据学科ID获取学科信息
  const getSubjectById = (subjectId: string): Subject | null => {
    return navigationConfig.subjects.find(subject => subject.id === subjectId) || null
  }

  // 根据学科ID和分类ID获取分类信息
  const getCategoryById = (subjectId: string, categoryId: string): Category | null => {
    const subject = getSubjectById(subjectId)
    if (!subject) return null
    
    return subject.categories.find(category => category.id === categoryId) || null
  }

  // 格式化标题：去掉.md，替换连字符
  const formatTitle = (name: string): string => {
    return name
      .replace(/\.md$/, '')  // 移除.md扩展名
      .replace(/[-_]/g, ' ') // 替换连字符和下划线为空格
  }

  // 递归构建导航项
  const buildNavigationItem = async (node: any): Promise<NavigationItem> => {
    const pathSegments = node._path?.split('/').filter(Boolean) || []
    const isDirectory = !!(node.children && node.children.length > 0)

    // 获取文件/文件夹名称
    let itemName = 'Untitled'
    if (pathSegments.length > 0) {
      itemName = pathSegments[pathSegments.length - 1]
    }

    // 获取标题 - 优先使用文档的title字段
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
      difficulty: node.difficulty
    }

    // 如果有子节点，递归处理
    if (node.children && node.children.length > 0) {
      const childPromises = node.children.map((child: any) => buildNavigationItem(child))
      const children = await Promise.all(childPromises)

      item.children = children.sort((a: NavigationItem, b: NavigationItem) => {
        // 目录排在前面，文件排在后面
        if (a.isDirectory && !b.isDirectory) return -1
        if (!a.isDirectory && b.isDirectory) return 1
        return a.title.localeCompare(b.title)
      })
    }

    return item
  }

  // 获取分类的导航结构（用于侧边栏）
  const getCategoryNavigation = async (categoryPath: string): Promise<NavigationItem[]> => {
    try {
      console.log('获取分类导航:', categoryPath)
      
      // 使用 fetchContentNavigation 获取导航结构
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
      console.log('找到分类节点:', categoryNode)

      if (categoryNode && categoryNode.children) {
        const itemPromises = categoryNode.children.map((child: any) => buildNavigationItem(child))
        const items = await Promise.all(itemPromises)

        return items.sort((a: NavigationItem, b: NavigationItem) => {
          // 目录排在前面，文件排在后面
          if (a.isDirectory && !b.isDirectory) return -1
          if (!a.isDirectory && b.isDirectory) return 1
          return a.title.localeCompare(b.title)
        })
      }

      return []
    } catch (error) {
      console.error(`获取分类导航失败 ${categoryPath}:`, error)
      return []
    }
  }

  // 根据路径获取面包屑导航
  const getBreadcrumbs = (currentPath: string) => {
    const segments = currentPath.split('/').filter(Boolean)
    const breadcrumbs = [{ title: '首页', _path: '/' }]

    if (segments.length >= 1) {
      const subjectId = segments[0]
      const subject = getSubjectById(subjectId)
      
      breadcrumbs.push({
        title: subject?.title || subjectId,
        _path: `/${subjectId}`
      })
    }

    if (segments.length >= 2) {
      const subjectId = segments[0]
      const categoryId = segments[1]
      const category = getCategoryById(subjectId, categoryId)
      
      breadcrumbs.push({
        title: category?.title || categoryId,
        _path: `/${subjectId}/${categoryId}`
      })
    }

    return breadcrumbs
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