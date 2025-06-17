// composables/useNavigation.ts
export interface NavigationItem {
  title: string
  _path: string
  icon?: string
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
      math: 'i-heroicons-calculator',
      computer: 'i-heroicons-computer-desktop',
      engineering: 'i-heroicons-cog-6-tooth',
      science: 'i-heroicons-academic-cap',
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
      // 物理学分类
      mechanics: 'i-heroicons-cog-6-tooth',
      thermodynamics: 'i-heroicons-fire',
      electricity: 'i-heroicons-bolt',
      magnetism: 'i-heroicons-magnet',
      optics: 'i-heroicons-eye',
      quantum: 'i-heroicons-atom',
      nuclear: 'i-heroicons-radioactive',

      // 化学分类
      organic: 'i-heroicons-beaker',
      inorganic: 'i-heroicons-cube',
      analytical: 'i-heroicons-magnifying-glass',
      physical: 'i-heroicons-scale',

      // 生物学分类
      cellular: 'i-heroicons-squares-2x2',
      molecular: 'i-heroicons-dna',
      evolution: 'i-heroicons-arrow-trending-up',
      ecology: 'i-heroicons-globe-alt',

      // 数学分类
      algebra: 'i-heroicons-variable',
      calculus: 'i-heroicons-chart-line',
      geometry: 'i-heroicons-square-3-stack-3d',
      statistics: 'i-heroicons-chart-bar',

      // 通用分类
      fundamentals: 'i-heroicons-academic-cap',
      basics: 'i-heroicons-bookmark',
      advanced: 'i-heroicons-star',
      applications: 'i-heroicons-wrench-screwdriver',
      experiments: 'i-heroicons-beaker',
      theory: 'i-heroicons-book-open'
    }

    for (const [key, icon] of Object.entries(iconMap)) {
      if (categoryId.toLowerCase().includes(key)) {
        return icon
      }
    }

    return 'i-heroicons-folder'
  }

  // 智能格式化文件夹名称为显示标题
  const formatTitle = (folderName: string): string => {
    const subjectMap: Record<string, string> = {
      physics: '物理学',
      chemistry: '化学',
      biology: '生物学',
      mathematics: '数学',
      math: '数学',
      computer: '计算机科学',
      engineering: '工程学',
      science: '科学',

      // 物理学分类
      mechanics: '力学',
      thermodynamics: '热力学',
      electricity: '电学',
      magnetism: '磁学',
      optics: '光学',
      quantum: '量子物理',
      nuclear: '核物理',

      // 化学分类
      organic: '有机化学',
      inorganic: '无机化学',
      analytical: '分析化学',
      physical: '物理化学',

      // 生物学分类
      cellular: '细胞生物学',
      molecular: '分子生物学',
      evolution: '进化生物学',
      ecology: '生态学',

      // 数学分类
      algebra: '代数',
      calculus: '微积分',
      geometry: '几何',
      statistics: '统计学',

      // 具体主题
      kinematics: '运动学',
      dynamics: '动力学',
      energy: '能量',
      waves: '波动',
      'ohms-law': '欧姆定律',
      circuits: '电路',
      'electric-field': '电场'
    }

    const lowerName = folderName.toLowerCase()
    if (subjectMap[lowerName]) {
      return subjectMap[lowerName]
    }

    // 如果没有预定义映射，格式化文件夹名称
    return folderName
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  // 获取学科列表（一级菜单）
  const getSubjects = async (): Promise<Subject[]> => {
    try {
      const navigation = await fetchContentNavigation()
      const subjects: Subject[] = []

      console.log('=== Navigation Debug ===')
      console.log('Full navigation tree:', navigation)

      for (const item of navigation) {
        if (item._path && item._path !== '/' && item._path.startsWith('/')) {
          const pathSegments = item._path.split('/').filter(Boolean)

          if (pathSegments.length === 1) {
            const subjectId = pathSegments[0]

            console.log(`Processing subject: ${subjectId}`)

            let subjectTitle = item.title

            if (!subjectTitle) {
              try {
                const subjectIndex = await queryContent(`/${subjectId}`).findOne()
                subjectTitle = subjectIndex?.title
              } catch (e) {
                console.log(`No index found for ${subjectId}`)
              }
            }

            if (!subjectTitle) {
              subjectTitle = formatTitle(subjectId)
            }

            console.log(`Subject title: ${subjectTitle}`)

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

      console.log('Final subjects:', subjects)
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
      if (child._path && child.children && child.children.length > 0) {
        const pathSegments = child._path.split('/').filter(Boolean)
        if (pathSegments.length === 2 && pathSegments[0] === subjectId) {
          const categoryId = pathSegments[1]

          let categoryTitle = child.title

          if (!categoryTitle) {
            try {
              const categoryIndex = await queryContent(child._path).findOne()
              categoryTitle = categoryIndex?.title
            } catch (e) {
              console.log(`No index found for category ${child._path}`)
            }
          }

          if (!categoryTitle) {
            categoryTitle = formatTitle(categoryId)
          }

          categories.push({
            id: categoryId,
            title: categoryTitle,
            path: child._path,
            icon: getCategoryIcon(categoryId)
          })
        }
      }
    }

    console.log(`Categories for ${subjectId}:`, categories)
    return categories
  }

  // 递归构建导航项
  const buildNavigationItem = (node: any): NavigationItem => {
    const pathSegments = node._path?.split('/').filter(Boolean) || []
    const isDirectory = !!(node.children && node.children.length > 0)

    // 获取标题
    let title = node.title
    if (!title && pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1]
      // 如果是 .md 文件，去掉扩展名
      const cleanName = lastSegment.replace(/\.md$/, '')
      title = formatTitle(cleanName)
    }

    const item: NavigationItem = {
      title: title || 'Untitled',
      _path: node._path || '',
      isDirectory,
      difficulty: node.difficulty
    }

    // 如果有子节点，递归处理
    if (node.children && node.children.length > 0) {
      item.children = node.children
        .map((child: any) => buildNavigationItem(child))
        .sort((a: NavigationItem, b: NavigationItem) => {
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
      console.log('=== Enhanced Sidebar Navigation Debug ===')
      console.log('Getting category navigation for:', categoryPath)

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
      console.log('Found category node:', categoryNode)

      if (categoryNode && categoryNode.children) {
        const items = categoryNode.children
          .map((child: any) => buildNavigationItem(child))
          .sort((a: NavigationItem, b: NavigationItem) => {
            // 目录排在前面，文件排在后面
            if (a.isDirectory && !b.isDirectory) return -1
            if (!a.isDirectory && b.isDirectory) return 1
            return a.title.localeCompare(b.title)
          })

        console.log('Final navigation items:', items)
        return items
      }

      console.log('No category node or children found')
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
      let subjectTitle = formatTitle(subjectId)

      try {
        const subjectData = await queryContent(`/${subjectId}`).findOne()
        if (subjectData?.title) {
          subjectTitle = subjectData.title
        }
      } catch (e) {
        // 使用格式化的标题
      }

      breadcrumbs.push({
        title: subjectTitle,
        _path: `/${subjectId}`
      })
    }

    if (segments.length >= 2) {
      const categoryId = segments[1]
      const categoryPath = `/${segments[0]}/${categoryId}`
      let categoryTitle = formatTitle(categoryId)

      try {
        const categoryData = await queryContent(categoryPath).findOne()
        if (categoryData?.title) {
          categoryTitle = categoryData.title
        }
      } catch (e) {
        // 使用格式化的标题
      }

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