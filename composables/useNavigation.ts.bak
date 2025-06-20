// File: composables/useNavigation.ts
// 使用 Nuxt Content 默认路由系统，去掉静态配置

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
  description: string
  icon: string
  path: string
  categories: Category[]
}

export interface Category {
  id: string
  title: string
  description?: string
  icon: string
  path: string
}

export const useNavigation = () => {
  // 学科基本信息（保留样式需要的图标等）
  const subjectMeta = {
    physics: {
      title: '物理学',
      description: '探索物质运动规律和自然现象的本质',
      icon: 'i-heroicons-bolt'
    },
    chemistry: {
      title: '化学', 
      description: '研究物质的组成、性质和变化规律',
      icon: 'i-heroicons-beaker'
    },
    biology: {
      title: '生物学',
      description: '探索生命的奥秘和生物世界的多样性', 
      icon: 'i-heroicons-heart'
    },
    mathematics: {
      title: '数学',
      description: '逻辑推理和抽象思维的基础学科',
      icon: 'i-heroicons-calculator'
    }
  }

  // 分类默认图标
  const getDefaultCategoryIcon = (categoryId: string): string => {
    const iconMap: Record<string, string> = {
      'mechanics': 'i-heroicons-cog-6-tooth',
      'electricity': 'i-heroicons-lightning-bolt', 
      '相对论': 'i-heroicons-globe-alt',
      'inorganic chemistry': 'i-heroicons-cube',
      'organic chemistry': 'i-heroicons-puzzle-piece',
      'reference': 'i-heroicons-book-open',
      'cell-biology': 'i-heroicons-squares-2x2',
      'genetics': 'i-heroicons-code-bracket',
      'algebra': 'i-heroicons-variable',
      'calculus': 'i-heroicons-chart-bar'
    }
    return iconMap[categoryId] || 'i-heroicons-folder'
  }

  // 格式化标题：去掉.md，替换连字符
  const formatTitle = (name: string): string => {
    return name
      .replace(/\.md$/, '')
      .replace(/[-_]/g, ' ')
  }

  // 从 Nuxt Content 获取所有学科
  const getSubjects = async (): Promise<Subject[]> => {
    try {
      const navigation = await fetchContentNavigation()
      
      const subjects: Subject[] = []
      
      for (const item of navigation) {
        if (!item._path) continue
        
        const subjectId = item._path.replace('/', '')
        const meta = subjectMeta[subjectId as keyof typeof subjectMeta]
        
        if (meta && item.children) {
          // 获取分类
          const categories: Category[] = item.children
            .filter(child => child._path && child.children)
            .map(child => {
              const categoryId = child._path!.split('/').pop() || ''
              return {
                id: categoryId,
                title: child.title || formatTitle(categoryId),
                description: child.description,
                icon: getDefaultCategoryIcon(categoryId),
                path: child._path!
              }
            })

          subjects.push({
            id: subjectId,
            title: meta.title,
            description: meta.description,
            icon: meta.icon,
            path: item._path,
            categories
          })
        }
      }
      
      return subjects
    } catch (error) {
      console.error('获取学科数据失败:', error)
      return []
    }
  }

  // 根据学科ID获取学科信息
  const getSubjectById = async (subjectId: string): Promise<Subject | null> => {
    const subjects = await getSubjects()
    return subjects.find(subject => subject.id === subjectId) || null
  }

  // 根据学科ID和分类ID获取分类信息
  const getCategoryById = async (subjectId: string, categoryId: string): Promise<Category | null> => {
    const subject = await getSubjectById(subjectId)
    if (!subject) return null
    
    return subject.categories.find(category => category.id === categoryId) || null
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
  const getBreadcrumbs = async (currentPath: string) => {
    const segments = currentPath.split('/').filter(Boolean)
    const breadcrumbs = [{ title: '首页', _path: '/' }]

    if (segments.length >= 1) {
      const subjectId = segments[0]
      const subject = await getSubjectById(subjectId)
      
      breadcrumbs.push({
        title: subject?.title || subjectId,
        _path: `/${subjectId}`
      })
    }

    if (segments.length >= 2) {
      const subjectId = segments[0]
      const categoryId = segments[1]
      const category = await getCategoryById(subjectId, categoryId)
      
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