// composables/useNavigation.ts
export interface NavigationItem {
  title: string
  _path: string
  icon?: string
  children?: NavigationItem[]
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

// 学科图标映射
const SUBJECT_ICONS: Record<string, string> = {
  physics: 'i-heroicons-bolt',
  chemistry: 'i-heroicons-beaker',
  biology: 'i-heroicons-heart',
  mathematics: 'i-heroicons-calculator',
}

// 学科中文名映射
const SUBJECT_NAMES: Record<string, string> = {
  physics: '物理',
  chemistry: '化学',
  biology: '生物',
  mathematics: '数学',
}

export const useNavigation = () => {
  // 获取学科列表（一级菜单）
  const getSubjects = async (): Promise<Subject[]> => {
    try {
      // 获取完整的导航树
      const navigation = await fetchContentNavigation()
      const subjects: Subject[] = []

      for (const item of navigation) {
        if (item._path && item._path !== '/') {
          const pathSegments = item._path.split('/').filter(Boolean)
          const subjectId = pathSegments[0]

          if (subjectId && !subjects.find(s => s.id === subjectId)) {
            // 获取学科的分类（二级菜单）
            const categories = await getSubjectCategories(subjectId)

            subjects.push({
              id: subjectId,
              title: SUBJECT_NAMES[subjectId] || subjectId,
              icon: SUBJECT_ICONS[subjectId] || 'i-heroicons-folder',
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

  // 获取学科的分类列表（二级菜单）
  const getSubjectCategories = async (subjectId: string): Promise<Category[]> => {
    try {
      // 查询特定学科下的所有内容
      const contentList = await queryContent()
        .where({ _path: { $regex: `^/${subjectId}/[^/]+/?$` } })
        .only(['_path', 'title'])
        .find()

      const categories: Category[] = []
      const categoryPaths = new Set<string>()

      for (const item of contentList) {
        if (item._path) {
          const pathSegments = item._path.split('/').filter(Boolean)
          if (pathSegments.length === 2 && pathSegments[0] === subjectId) {
            const categoryId = pathSegments[1]
            const categoryPath = `/${subjectId}/${categoryId}`

            if (!categoryPaths.has(categoryPath)) {
              categoryPaths.add(categoryPath)

              // 使用文档的标题，如果没有则格式化目录名
              let categoryTitle = item.title || categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

              categories.push({
                id: categoryId,
                title: categoryTitle,
                path: categoryPath
              })
            }
          }
        }
      }

      // 如果没有找到分类内容，尝试查找目录结构
      if (categories.length === 0) {
        const navigation = await fetchContentNavigation()
        const subjectNav = navigation.find(item => item._path === `/${subjectId}`)

        if (subjectNav && subjectNav.children) {
          for (const child of subjectNav.children) {
            if (child._path) {
              const pathSegments = child._path.split('/').filter(Boolean)
              if (pathSegments.length === 2) {
                const categoryId = pathSegments[1]
                categories.push({
                  id: categoryId,
                  title: child.title || categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                  path: child._path
                })
              }
            }
          }
        }
      }

      return categories.sort((a, b) => a.title.localeCompare(b.title))
    } catch (error) {
      console.error(`Failed to get categories for ${subjectId}:`, error)
      return []
    }
  }

  // 获取当前页面的分类导航（用于侧边栏）
  const getCategoryNavigation = async (categoryPath: string): Promise<NavigationItem[]> => {
    try {
      // 查询当前分类下的所有文章
      const articles = await queryContent()
        .where({ _path: { $regex: `^${categoryPath}/.*` } })
        .only(['_path', 'title', 'difficulty'])
        .sort({ title: 1 })
        .find()

      return articles
        .filter(item => item._path !== categoryPath) // 排除分类首页
        .map(item => ({
          title: item.title || '',
          _path: item._path || '',
          icon: 'i-heroicons-document-text',
          difficulty: item.difficulty
        }))
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
      breadcrumbs.push({
        title: SUBJECT_NAMES[subjectId] || subjectId,
        _path: `/${subjectId}`
      })
    }

    if (segments.length >= 2) {
      const categoryId = segments[1]
      const categoryPath = `/${segments[0]}/${categoryId}`

      try {
        const categoryData = await queryContent(categoryPath).findOne()
        breadcrumbs.push({
          title: categoryData?.title || categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          _path: categoryPath
        })
      } catch {
        breadcrumbs.push({
          title: categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          _path: categoryPath
        })
      }
    }

    return breadcrumbs
  }

  return {
    getSubjects,
    getSubjectCategories,
    getCategoryNavigation,
    getBreadcrumbs
  }
}