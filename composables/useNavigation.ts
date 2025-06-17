// composables/useNavigation.ts
export interface NavigationItem {
  title: string
  _path: string
  difficulty?: string
  children?: NavigationItem[]
  isDirectory: boolean
}

export interface Subject {
  id: string
  title: string
  icon: string
  path: string
  categories: Category[]
}

export interface Category {
  id: string
  title: string
  path: string
  icon: string
}

export const useNavigation = () => {
  // 根据学科ID获取默认图标
  const getDefaultIcon = (subjectId: string): string => {
    const iconMap: Record<string, string> = {
      physics: 'i-heroicons-bolt',
      chemistry: 'i-heroicons-beaker',
      biology: 'i-heroicons-heart',
      mathematics: 'i-heroicons-calculator',
      computer: 'i-heroicons-computer-desktop',
      engineering: 'i-heroicons-cog-6-tooth',
    }

    for (const [key, icon] of Object.entries(iconMap)) {
      if (subjectId.toLowerCase().includes(key)) {
        return icon
      }
    }

    return 'i-heroicons-folder'
  }

  // 根据分类ID获取默认图标
  const getCategoryIcon = (categoryId: string): string => {
    const iconMap: Record<string, string> = {
      mechanics: 'i-heroicons-cog-6-tooth',
      electricity: 'i-heroicons-bolt',
      thermodynamics: 'i-heroicons-fire',
      optics: 'i-heroicons-eye',
      quantum: 'i-heroicons-atom',
    }

    for (const [key, icon] of Object.entries(iconMap)) {
      if (categoryId.toLowerCase().includes(key)) {
        return icon
      }
    }

    return 'i-heroicons-folder'
  }

  // 简单的标题格式化：去掉.md，替换连字符
  const formatTitle = (name: string): string => {
    return name
      .replace(/\.md$/, '')  // 移除.md扩展名
      .replace(/[-_]/g, ' ') // 替换连字符和下划线为空格
  }

  // 专门读取 _dir.yml 文件的函数
  const readDirYml = async (dirPath: string): Promise<string | null> => {
    try {
      const dirYmlPath = `${dirPath}/_dir`
      const dirData = await queryContent(dirYmlPath).findOne()
      return dirData?.title || null
    } catch (e) {
      return null
    }
  }

  // 获取标题：优先 _dir.yml，其次格式化文件名
  const getItemTitle = async (itemPath: string, itemName: string): Promise<string> => {
    // 1. 尝试读取 _dir.yml
    const dirTitle = await readDirYml(itemPath)
    if (dirTitle) {
      return dirTitle
    }

    // 2. 使用文件名格式化
    return formatTitle(itemName)
  }

  // 获取学科列表（一级菜单）
  const getSubjects = async (): Promise<Subject[]> => {
    try {
      const navigation = await fetchContentNavigation()
      const subjects: Subject[] = []

      for (const item of navigation) {
        if (item._path && item._path !== '/' && item._path.startsWith('/')) {
          const pathSegments = item._path.split('/').filter(Boolean)

          if (pathSegments.length === 1) {
            const subjectId = pathSegments[0]
            const subjectTitle = await getItemTitle(item._path, subjectId)
            const categories = await getSubjectCategoriesFromNav(item, subjectId)

            subjects.push({
              id: subjectId,
              title: subjectTitle,
              icon: getDefaultIcon(subjectId),
              path: `/${subjectId}`,
              categories
            })
          }
        }
      }

      return subjects.sort((a, b) => a.title.localeCompare(b.title))
    } catch (error) {
      console.error('Failed to get subjects:', error)
      return []
    }
  }

  // 从导航树中提取学科的分类
  const getSubjectCategoriesFromNav = async (subjectItem: any, subjectId: string): Promise<Category[]> => {
    const categories: Category[] = []

    if (!subjectItem.children) {
      return categories
    }

    console.log(`Processing categories for ${subjectId}:`, subjectItem.children)

    for (const child of subjectItem.children) {
      // 修复：只要是文件夹路径就识别为分类，不要求必须有子内容
      if (child._path) {
        const pathSegments = child._path.split('/').filter(Boolean)
        if (pathSegments.length === 2 && pathSegments[0] === subjectId) {
          // 判断是否为文件夹（不是.md文件）
          const categoryId = pathSegments[1]
          if (!categoryId.endsWith('.md')) {
            console.log(`Found category: ${categoryId} at ${child._path}`)
            console.log(`Category has children:`, child.children?.length || 0)

            const categoryTitle = await getItemTitle(child._path, categoryId)

            categories.push({
              id: categoryId,
              title: categoryTitle,
              path: child._path,
              icon: getCategoryIcon(categoryId)
            })
          }
        }
      }
    }

    console.log(`Final categories for ${subjectId}:`, categories)
    return categories
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

    // 获取标题
    let title: string
    if (isDirectory) {
      // 目录：尝试读取 _dir.yml
      title = await getItemTitle(node._path, itemName)
    } else {
      // 文件：直接格式化文件名
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

  // 获取分类的完整导航结构（支持嵌套）
  const getCategoryNavigation = async (categoryPath: string): Promise<NavigationItem[]> => {
    try {
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
      console.error(`Failed to get navigation for ${categoryPath}:`, error)
      return []
    }
  }

  // 根据路径获取面包屑导航
  const getBreadcrumbs = async (currentPath: string) => {
    const segments = currentPath.split('/').filter(Boolean)
    const breadcrumbs = [{ title: '首页', _path: '/' }]

    if (segments.length >= 1) {
      const subjectId = segments[0]
      const subjectTitle = await getItemTitle(`/${subjectId}`, subjectId)

      breadcrumbs.push({
        title: subjectTitle,
        _path: `/${subjectId}`
      })
    }

    if (segments.length >= 2) {
      const categoryId = segments[1]
      const categoryPath = `/${segments[0]}/${categoryId}`
      const categoryTitle = await getItemTitle(categoryPath, categoryId)

      breadcrumbs.push({
        title: categoryTitle,
        _path: categoryPath
      })
    }

    return breadcrumbs
  }

  return {
    getSubjects,
    getCategoryNavigation,
    getBreadcrumbs,
    formatTitle
  }
}