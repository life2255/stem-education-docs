// composables/useNavigation.ts
export interface NavigationItem {
  title: string
  _path: string
  icon?: string
  difficulty?: string
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
}

export const useNavigation = () => {
  // 根据学科ID获取默认图标
  const getDefaultIcon = (subjectId: string): string => {
    // 根据文件夹名称智能推测图标
    const iconMap: Record<string, string> = {
      physics: 'i-heroicons-bolt',
      chemistry: 'i-heroicons-beaker',
      biology: 'i-heroicons-heart',
      mathematics: 'i-heroicons-calculator',
      math: 'i-heroicons-calculator',
      computer: 'i-heroicons-computer-desktop',
      engineering: 'i-heroicons-cog-6-tooth',
      science: 'i-heroicons-academic-cap',
      // 可以根据需要扩展更多映射
    }

    // 查找匹配的图标
    for (const [key, icon] of Object.entries(iconMap)) {
      if (subjectId.toLowerCase().includes(key)) {
        return icon
      }
    }

    // 默认图标
    return 'i-heroicons-folder'
  }

  // 智能格式化文件夹名称为显示标题
  const formatTitle = (folderName: string): string => {
    // 处理常见的英文学科名称
    const subjectMap: Record<string, string> = {
      physics: '物理学',
      chemistry: '化学',
      biology: '生物学',
      mathematics: '数学',
      math: '数学',
      computer: '计算机科学',
      engineering: '工程学',
      science: '科学',
      // 可以根据需要扩展
    }

    const lowerName = folderName.toLowerCase()
    if (subjectMap[lowerName]) {
      return subjectMap[lowerName]
    }

    // 如果没有预定义映射，格式化文件夹名称
    return folderName
      .replace(/[-_]/g, ' ')  // 替换连字符和下划线为空格
      .replace(/\b\w/g, l => l.toUpperCase())  // 首字母大写
  }

  // 获取学科列表（一级菜单）- 真正动态读取
  const getSubjects = async (): Promise<Subject[]> => {
    try {
      // 获取完整的导航树
      const navigation = await fetchContentNavigation()
      const subjects: Subject[] = []

      console.log('=== Navigation Debug ===')
      console.log('Full navigation tree:', navigation)

      // 遍历 content/ 下的所有顶级文件夹
      for (const item of navigation) {
        if (item._path && item._path !== '/' && item._path.startsWith('/')) {
          const pathSegments = item._path.split('/').filter(Boolean)

          // 只处理顶级文件夹（学科）
          if (pathSegments.length === 1) {
            const subjectId = pathSegments[0]

            console.log(`Processing subject: ${subjectId}`)

            // 尝试从该学科的 _dir.yml 或 index.md 获取标题
            let subjectTitle = item.title

            // 如果导航树中没有标题，尝试查询 index 页面
            if (!subjectTitle) {
              try {
                const subjectIndex = await queryContent(`/${subjectId}`).findOne()
                subjectTitle = subjectIndex?.title
              } catch (e) {
                console.log(`No index found for ${subjectId}`)
              }
            }

            // 如果还是没有标题，使用智能格式化
            if (!subjectTitle) {
              subjectTitle = formatTitle(subjectId)
            }

            console.log(`Subject title: ${subjectTitle}`)

            // 获取该学科的分类
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
      // 只有包含子内容的文件夹才算分类
      if (child._path && child.children && child.children.length > 0) {
        const pathSegments = child._path.split('/').filter(Boolean)
        if (pathSegments.length === 2 && pathSegments[0] === subjectId) {
          const categoryId = pathSegments[1]

          // 获取分类标题
          let categoryTitle = child.title

          // 如果没有标题，尝试查询分类的 index 或 _dir.yml
          if (!categoryTitle) {
            try {
              const categoryIndex = await queryContent(child._path).findOne()
              categoryTitle = categoryIndex?.title
            } catch (e) {
              console.log(`No index found for category ${child._path}`)
            }
          }

          // 最后使用格式化的文件夹名
          if (!categoryTitle) {
            categoryTitle = formatTitle(categoryId)
          }

          categories.push({
            id: categoryId,
            title: categoryTitle,
            path: child._path
          })
        }
      }
    }

    console.log(`Categories for ${subjectId}:`, categories)
    return categories
  }

  // 获取当前页面的分类导航（用于侧边栏）
  const getCategoryNavigation = async (categoryPath: string): Promise<NavigationItem[]> => {
    try {
      console.log('=== Sidebar Navigation Debug ===')
      console.log('Getting category navigation for:', categoryPath)

      // 获取完整导航树
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
        const articles = categoryNode.children
          .filter((item: any) => {
            // 只要文章文件，不要子文件夹
            const isFile = item._path && !item.children
            console.log(`Item ${item._path}: isFile=${isFile}`)
            return isFile
          })
          .map((item: any) => {
            const title = item.title || item._path?.split('/').pop()?.replace(/\.md$/, '') || ''
            console.log(`Article: ${item._path} -> ${title}`)
            return {
              title,
              _path: item._path || '',
              icon: 'i-heroicons-document-text',
              difficulty: item.difficulty
            }
          })

        console.log('Final articles:', articles)
        return articles
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

      // 尝试获取学科的真实标题
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

      // 尝试获取分类的真实标题
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