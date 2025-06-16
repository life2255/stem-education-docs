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
  items?: NavigationItem[]
}

// 学科图标映射
const SUBJECT_ICONS: Record<string, string> = {
  physics: 'i-heroicons-bolt',
  chemistry: 'i-heroicons-beaker',
  biology: 'i-heroicons-heart',
  mathematics: 'i-heroicons-calculator',
  // 可以继续添加更多学科
}

// 学科中文名映射
const SUBJECT_NAMES: Record<string, string> = {
  physics: '物理',
  chemistry: '化学',
  biology: '生物',
  mathematics: '数学',
}

export const useNavigation = () => {
  // 获取所有导航数据
  const getNavigation = async () => {
    try {
      // 获取所有内容页面
      const navigation = await fetchContentNavigation()
      return navigation || []
    } catch (error) {
      console.error('Failed to fetch navigation:', error)
      return []
    }
  }

  // 获取学科列表（一级菜单）
  const getSubjects = async (): Promise<Subject[]> => {
    try {
      const navigation = await getNavigation()
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
      const navigation = await fetchContentNavigation(queryContent().where({ _path: { $contains: subjectId } }))
      const categories: Category[] = []
      const categoryPaths = new Set<string>()

      for (const item of navigation) {
        if (item._path) {
          const pathSegments = item._path.split('/').filter(Boolean)
          if (pathSegments.length >= 2 && pathSegments[0] === subjectId) {
            const categoryId = pathSegments[1]
            const categoryPath = `/${subjectId}/${categoryId}`

            if (!categoryPaths.has(categoryPath)) {
              categoryPaths.add(categoryPath)

              // 尝试获取分类的标题
              let categoryTitle = categoryId
              try {
                const categoryData = await queryContent(categoryPath).findOne()
                if (categoryData?.title) {
                  categoryTitle = categoryData.title
                }
              } catch {
                // 如果没有找到分类页面，使用目录名
                categoryTitle = categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
              }

              categories.push({
                id: categoryId,
                title: categoryTitle,
                path: categoryPath
              })
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
      const navigation = await fetchContentNavigation(queryContent().where({ _path: { $contains: categoryPath } }))

      // 过滤出属于当前分类的文章
      const items = navigation.filter(item =>
        item._path &&
        item._path.startsWith(categoryPath) &&
        item._path !== categoryPath && // 排除分类首页
        item.title
      )

      return items.map(item => ({
        title: item.title || '',
        _path: item._path || '',
        icon: 'i-heroicons-document-text'
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
          title: categoryData?.title || categoryId,
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
    getNavigation,
    getSubjects,
    getSubjectCategories,
    getCategoryNavigation,
    getBreadcrumbs
  }
}