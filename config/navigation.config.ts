// File: config/navigation.config.ts
// 手动配置的导航结构 - 稳定、可靠、易维护

export interface NavItem {
  title: string
  path: string
  icon?: string
  description?: string
  children?: NavItem[]
  order?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
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
  navigation?: NavItem[]
}

// 导航配置 - 完全手动定义，支持中文路径
export const navigationConfig: Subject[] = [
  {
    id: 'physics',
    title: '物理学',
    description: '探索物质运动规律和自然现象的本质',
    icon: 'i-heroicons-bolt',
    path: '/physics',
    categories: [
      {
        id: 'mechanics',
        title: '力学',
        description: '研究物体的运动和相互作用',
        icon: 'i-heroicons-cog-6-tooth',
        path: '/physics/mechanics',
        navigation: [
          {
            title: '力学概述',
            path: '/physics/mechanics',
            order: 0
          },
          {
            title: '运动学',
            path: '/physics/mechanics/运动学',
            icon: 'i-heroicons-arrow-trending-up',
            order: 1,
            children: [
              {
                title: '运动学基础',
                path: '/physics/mechanics/运动学/kinematics',
                difficulty: 'beginner',
                order: 1
              },
              {
                title: '二维运动',
                path: '/physics/mechanics/运动学/二维运动',
                difficulty: 'intermediate',
                order: 2
              }
            ]
          },
          {
            title: '动力学',
            path: '/physics/mechanics/dynamics',
            order: 2
          },
          {
            title: '能量守恒',
            path: '/physics/mechanics/energy',
            order: 3
          }
        ]
      },
      {
        id: 'electricity',
        title: '电磁学',
        description: '探索电场、磁场及其相互作用',
        icon: 'i-heroicons-lightning-bolt',
        path: '/physics/electricity',
        navigation: [
          {
            title: '电磁学概述',
            path: '/physics/electricity',
            order: 0
          },
          {
            title: '欧姆定律',
            path: '/physics/electricity/ohms-law',
            difficulty: 'intermediate',
            order: 1
          }
        ]
      },
      {
        id: '相对论',
        title: '相对论',
        description: '时空的本质和引力理论',
        icon: 'i-heroicons-globe-alt',
        path: '/physics/相对论',
        navigation: [
          {
            title: '相对论概述',
            path: '/physics/相对论',
            order: 0
          },
          {
            title: '洛伦兹变换',
            path: '/physics/相对论/洛伦兹变换',
            difficulty: 'advanced',
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    title: '化学',
    description: '研究物质的组成、性质和变化规律',
    icon: 'i-heroicons-beaker',
    path: '/chemistry',
    categories: [
      {
        id: 'inorganic',
        title: '无机化学',
        description: '研究无机化合物的性质和反应',
        icon: 'i-heroicons-cube',
        path: '/chemistry/inorganic chemistry',
        navigation: [
          {
            title: '无机化学概述',
            path: '/chemistry/inorganic chemistry',
            order: 0
          },
          {
            title: '碱金属',
            path: '/chemistry/inorganic chemistry/alkalai metal',
            order: 1,
            children: [
              {
                title: '钠',
                path: '/chemistry/inorganic chemistry/alkalai metal/Na',
                order: 1
              }
            ]
          }
        ]
      },
      {
        id: 'organic',
        title: '有机化学',
        description: '研究有机化合物的结构和合成',
        icon: 'i-heroicons-puzzle-piece',
        path: '/chemistry/organic chemistry',
        navigation: [
          {
            title: '有机化学概述',
            path: '/chemistry/organic chemistry/organic',
            order: 0
          }
        ]
      },
      {
        id: 'reference',
        title: '参考资料',
        description: '化学参考资料和工具',
        icon: 'i-heroicons-book-open',
        path: '/chemistry/reference',
        navigation: [
          {
            title: '元素周期表',
            path: '/chemistry/reference/periodic-table',
            order: 1
          },
          {
            title: '元素周期表(中文)',
            path: '/chemistry/reference/元素周期表',
            order: 2
          }
        ]
      }
    ]
  },
  {
    id: 'biology',
    title: '生物学',
    description: '探索生命的奥秘和生物世界的多样性',
    icon: 'i-heroicons-heart',
    path: '/biology',
    categories: [
      {
        id: 'cell-biology',
        title: '细胞生物学',
        description: '研究细胞的结构和功能',
        icon: 'i-heroicons-squares-2x2',
        path: '/biology/细胞生物学',
        navigation: [
          {
            title: '细胞生物学概述',
            path: '/biology/细胞生物学',
            order: 0
          },
          {
            title: '细胞膜',
            path: '/biology/细胞生物学/细胞膜',
            order: 1
          }
        ]
      },
      {
        id: 'botany',
        title: '植物学',
        description: '研究植物的形态、生理和分类',
        icon: 'i-heroicons-sparkles',
        path: '/biology/植物学',
        navigation: [
          {
            title: '植物学概述',
            path: '/biology/植物学',
            order: 0
          },
          {
            title: '草本植物',
            path: '/biology/植物学/草',
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: 'mathematics',
    title: '数学',
    description: '逻辑推理和抽象思维的基础学科',
    icon: 'i-heroicons-calculator',
    path: '/mathematics',
    categories: [
      {
        id: 'algebra',
        title: '代数',
        description: '研究数的运算和方程求解',
        icon: 'i-heroicons-variable',
        path: '/mathematics/algebra',
        navigation: []
      },
      {
        id: 'calculus',
        title: '微积分',
        description: '研究连续变化的数学',
        icon: 'i-heroicons-chart-bar',
        path: '/mathematics/calculus',
        navigation: []
      }
    ]
  }
]

// 工具函数：根据路径查找导航项
export function findNavItemByPath(path: string): NavItem | null {
  const searchInItems = (items: NavItem[]): NavItem | null => {
    for (const item of items) {
      if (item.path === path) return item
      if (item.children) {
        const found = searchInItems(item.children)
        if (found) return found
      }
    }
    return null
  }

  for (const subject of navigationConfig) {
    for (const category of subject.categories) {
      if (category.navigation) {
        const found = searchInItems(category.navigation)
        if (found) return found
      }
    }
  }
  
  return null
}

// 工具函数：获取面包屑
export function getBreadcrumbsFromConfig(path: string): Array<{ title: string; path: string }> {
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs: Array<{ title: string; path: string }> = [
    { title: '首页', path: '/' }
  ]

  if (segments.length >= 1) {
    const subject = navigationConfig.find(s => s.id === segments[0])
    if (subject) {
      breadcrumbs.push({
        title: subject.title,
        path: subject.path
      })
    }
  }

  if (segments.length >= 2) {
    const subject = navigationConfig.find(s => s.id === segments[0])
    if (subject) {
      // 尝试通过路径匹配分类
      const category = subject.categories.find(c => 
        c.path === `/${segments[0]}/${segments[1]}` ||
        c.id === segments[1]
      )
      if (category) {
        breadcrumbs.push({
          title: category.title,
          path: category.path
        })
      }
    }
  }

  // 如果还有更深的路径，尝试从导航项中查找
  if (segments.length > 2) {
    const navItem = findNavItemByPath(path)
    if (navItem && navItem.title !== breadcrumbs[breadcrumbs.length - 1].title) {
      breadcrumbs.push({
        title: navItem.title,
        path: navItem.path
      })
    }
  }

  return breadcrumbs
}