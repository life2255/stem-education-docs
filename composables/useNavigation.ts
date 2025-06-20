// File: composables/useNavigation.ts
// 简化版本：基于配置文件，不再使用动态查询

import { navigationConfig, findNavItemByPath, getBreadcrumbsFromConfig } from '~/config/navigation.config'
import type { Subject, Category, NavItem } from '~/config/navigation.config'

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

  // 转换导航项格式
  const convertNavItems = (items: NavItem[]): NavigationItem[] => {
    return items.map(item => ({
      title: item.title,
      _path: item.path,
      difficulty: item.difficulty,
      description: item.description,
      icon: item.icon,
      order: item.order,
      isDirectory: !!(item.children && item.children.length > 0),
      children: item.children ? convertNavItems(item.children) : undefined
    }))
  }

  // 获取分类的导航结构
  const getCategoryNavigation = async (categoryPath: string): Promise<NavigationItem[]> => {
    // 从路径中提取学科和分类
    const segments = categoryPath.split('/').filter(Boolean)
    if (segments.length < 2) return Promise.resolve([])

    const subjectId = segments[0]
    const subject = navigationConfig.find(s => s.id === subjectId)
    if (!subject) return Promise.resolve([])

    // 查找匹配的分类
    const category = subject.categories.find(c => c.path === categoryPath)
    if (!category || !category.navigation) return Promise.resolve([])

    // 转换并返回导航项
    return Promise.resolve(convertNavItems(category.navigation))
  }

  // 获取面包屑导航
  const getBreadcrumbs = async (currentPath: string) => {
    return Promise.resolve(getBreadcrumbsFromConfig(currentPath))
  }

  // 格式化标题（保留以兼容）
  const formatTitle = (name: string): string => {
    return name
      .replace(/\.md$/, '')
      .replace(/^[\d]+\./, '')
      .replace(/[-_]/g, ' ')
      .trim()
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