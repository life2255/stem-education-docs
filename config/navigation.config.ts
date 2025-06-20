// File: config/navigation.config.ts
// 基于实际 content 目录结构生成的导航配置

export interface NavItem {
  title: string
  path: string
  description?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  icon?: string
  order?: number
  children?: NavItem[]
}

export interface Category {
  id: string
  title: string
  description?: string
  icon: string
  path: string
  navigation?: NavItem[]
}

export interface Subject {
  id: string
  title: string
  description: string
  icon: string
  path: string
  categories: Category[]
}

export const navigationConfig: Subject[] = [
  // 物理学
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
        description: '研究物体运动和相互作用的基础学科',
        icon: 'i-heroicons-cog-6-tooth',
        path: '/physics/mechanics',
        navigation: [
          {
            title: '力学概述',
            path: '/physics/mechanics',
            description: '力学基础理论与应用',
            difficulty: 'beginner',
            icon: 'i-heroicons-academic-cap',
            order: 1
          },
          {
            title: '运动学',
            path: '/physics/mechanics/kinematics',
            description: '描述物体运动的基本概念',
            difficulty: 'beginner',
            icon: 'i-heroicons-arrow-trending-up',
            order: 2,
            children: [
              {
                title: '运动学基础',
                path: '/physics/mechanics/kinematics/kinematics',
                description: '位移、速度、加速度等基本概念',
                difficulty: 'beginner',
                order: 1
              },
              {
                title: '二维运动',
                path: '/physics/mechanics/kinematics/two-dim',
                description: '平面内的运动分析',
                difficulty: 'intermediate',
                order: 2
              }
            ]
          }
        ]
      },
      {
        id: 'electricity',
        title: '电磁学',
        description: '研究电场、磁场及其相互作用',
        icon: 'i-heroicons-lightning-bolt',
        path: '/physics/electricity',
        navigation: [
          {
            title: '电磁学概述',
            path: '/physics/electricity',
            description: '电磁学基本原理与应用',
            difficulty: 'intermediate',
            icon: 'i-heroicons-bolt',
            order: 1
          },
          {
            title: '欧姆定律',
            path: '/physics/electricity/ohms-law',
            description: '电压、电流和电阻的关系',
            difficulty: 'intermediate',
            icon: 'i-heroicons-calculator',
            order: 2
          }
        ]
      },
      {
        id: 'relativity',
        title: '相对论',
        description: '时空理论与现代物理基础',
        icon: 'i-heroicons-globe-alt',
        path: '/physics/relativity',
        navigation: [
          {
            title: '相对论原理',
            path: '/physics/relativity',
            description: '爱因斯坦相对论理论基础',
            difficulty: 'advanced',
            icon: 'i-heroicons-academic-cap',
            order: 1
          },
          {
            title: '洛伦兹变换',
            path: '/physics/relativity/lorenz',
            description: '时空坐标变换的数学描述',
            difficulty: 'advanced',
            icon: 'i-heroicons-arrow-path',
            order: 2
          },
          {
            title: '相对论应用',
            path: '/physics/relativity/relativity',
            description: '相对论在现代科学中的应用',
            difficulty: 'advanced',
            icon: 'i-heroicons-rocket-launch',
            order: 3
          }
        ]
      }
    ]
  },

  // 化学
  {
    id: 'chemistry',
    title: '化学',
    description: '研究物质的组成、性质和变化规律',
    icon: 'i-heroicons-beaker',
    path: '/chemistry',
    categories: [
      {
        id: 'inorganic chemistry',
        title: '无机化学',
        description: '研究无机化合物的性质和反应',
        icon: 'i-heroicons-cube',
        path: '/chemistry/inorganic-chemistry',
        navigation: [
          {
            title: '无机化学概述',
            path: '/chemistry/inorganic-chemistry',
            description: '无机化学基础理论与应用',
            difficulty: 'intermediate',
            icon: 'i-heroicons-academic-cap',
            order: 1
          },
          {
            title: '无机化学基础',
            path: '/chemistry/inorganic-chemistry/inorg',
            description: '元素化学与化学键理论',
            difficulty: 'intermediate',
            icon: 'i-heroicons-cube-transparent',
            order: 2
          },
          {
            title: '碱金属',
            path: '/chemistry/inorganic-chemistry/alkalai-metal',
            description: '碱金属元素的性质与反应',
            difficulty: 'intermediate',
            icon: 'i-heroicons-fire',
            order: 3,
            children: [
              {
                title: '钠元素',
                path: '/chemistry/inorganic-chemistry/alkalai-metal/na',
                description: '钠的性质、制备与应用',
                difficulty: 'intermediate',
                order: 1
              }
            ]
          }
        ]
      },
      {
        id: 'organic chemistry',
        title: '有机化学',
        description: '研究有机化合物的结构与合成',
        icon: 'i-heroicons-puzzle-piece',
        path: '/chemistry/organic-chemistry',
        navigation: [
          {
            title: '有机化学基础',
            path: '/chemistry/organic-chemistry/organic',
            description: '有机化合物的基本概念',
            difficulty: 'intermediate',
            icon: 'i-heroicons-link',
            order: 1
          }
        ]
      },
      {
        id: 'reference',
        title: '参考资料',
        description: '化学参考手册与工具',
        icon: 'i-heroicons-book-open',
        path: '/chemistry/reference',
        navigation: [
          {
            title: '参考资料目录',
            path: '/chemistry/reference',
            description: '化学学习参考资源汇总',
            difficulty: 'beginner',
            icon: 'i-heroicons-folder',
            order: 1
          },
          {
            title: '元素周期表',
            path: '/chemistry/reference/periodic-table',
            description: '元素周期表的规律和应用',
            difficulty: 'beginner',
            icon: 'i-heroicons-table-cells',
            order: 2
          },
          {
            title: '元素周期表(中文)',
            path: '/chemistry/reference/元素周期表',
            description: '中文版元素周期表资料',
            difficulty: 'beginner',
            icon: 'i-heroicons-language',
            order: 3
          }
        ]
      }
    ]
  },

  // 生物学
  {
    id: 'biology',
    title: '生物学',
    description: '探索生命的奥秘和生物世界的多样性',
    icon: 'i-heroicons-heart',
    path: '/biology',
    categories: [
      {
        id: 'cell',
        title: '细胞生物学',
        description: '研究细胞结构与功能的科学',
        icon: 'i-heroicons-squares-2x2',
        path: '/biology/cell',
        navigation: [
          {
            title: '细胞生物学概述',
            path: '/biology/cell',
            description: '细胞——生命的基本组成',
            difficulty: 'beginner',
            icon: 'i-heroicons-academic-cap',
            order: 1
          },
          {
            title: '细胞膜',
            path: '/biology/cell/cell',
            description: '细胞膜的结构与功能',
            difficulty: 'intermediate',
            icon: 'i-heroicons-shield-check',
            order: 2
          }
        ]
      },
      {
        id: 'boltony',
        title: '植物学',
        description: '研究植物的形态、生理和分类',
        icon: 'i-heroicons-leaf',
        path: '/biology/boltony',
        navigation: [
          {
            title: '植物学概述',
            path: '/biology/boltony',
            description: '植物——最基础的生物',
            difficulty: 'beginner',
            icon: 'i-heroicons-academic-cap',
            order: 1
          }
        ]
      }
    ]
  },

  // 数学
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
        description: '数的运算和方程求解',
        icon: 'i-heroicons-variable',
        path: '/mathematics/algebra',
        navigation: [
          {
            title: '代数基础',
            path: '/mathematics/algebra',
            description: '代数运算的基本概念',
            difficulty: 'beginner',
            icon: 'i-heroicons-academic-cap',
            order: 1
          }
        ]
      },
      {
        id: 'calculus',
        title: '微积分',
        description: '连续变化的数学描述',
        icon: 'i-heroicons-chart-bar',
        path: '/mathematics/calculus',
        navigation: [
          {
            title: '微积分基础',
            path: '/mathematics/calculus',
            description: '极限、导数与积分',
            difficulty: 'intermediate',
            icon: 'i-heroicons-academic-cap',
            order: 1
          }
        ]
      }
    ]
  }
]

// 工具函数：根据路径查找导航项
export const findNavItemByPath = (path: string): NavItem | null => {
  const searchInItems = (items: NavItem[]): NavItem | null => {
    for (const item of items) {
      if (item.path === path) {
        return item
      }
      if (item.children) {
        const found = searchInItems(item.children)
        if (found) return found
      }
    }
    return null
  }

  for (const subject of navigationConfig) {
    // 检查学科路径
    if (subject.path === path) {
      return {
        title: subject.title,
        path: subject.path,
        description: subject.description,
        icon: subject.icon
      }
    }

    for (const category of subject.categories) {
      // 检查分类路径
      if (category.path === path) {
        return {
          title: category.title,
          path: category.path,
          description: category.description,
          icon: category.icon
        }
      }

      // 检查导航项
      if (category.navigation) {
        const found = searchInItems(category.navigation)
        if (found) return found
      }
    }
  }

  return null
}

// 工具函数：根据路径生成面包屑
export const getBreadcrumbsFromConfig = (path: string) => {
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
      const category = subject.categories.find(c => c.id === segments[1] || c.path === `/${segments[0]}/${segments[1]}`)
      if (category) {
        breadcrumbs.push({
          title: category.title,
          path: category.path
        })
      }
    }
  }

  return breadcrumbs
}

// 工具函数：获取所有学科的扁平列表（用于搜索等功能）
export const getAllSubjects = () => {
  return navigationConfig.map(subject => ({
    id: subject.id,
    title: subject.title,
    description: subject.description,
    icon: subject.icon,
    path: subject.path
  }))
}

// 工具函数：获取所有分类的扁平列表
export const getAllCategories = () => {
  const categories: Array<Category & { subjectId: string; subjectTitle: string }> = []
  
  for (const subject of navigationConfig) {
    for (const category of subject.categories) {
      categories.push({
        ...category,
        subjectId: subject.id,
        subjectTitle: subject.title
      })
    }
  }
  
  return categories
}

// 工具函数：获取所有导航项的扁平列表（用于全站搜索）
export const getAllNavItems = (): Array<NavItem & { 
  subjectId: string; 
  subjectTitle: string; 
  categoryId?: string; 
  categoryTitle?: string 
}> => {
  const items: Array<NavItem & { 
    subjectId: string; 
    subjectTitle: string; 
    categoryId?: string; 
    categoryTitle?: string 
  }> = []

  const collectItems = (
    navItems: NavItem[], 
    subjectId: string, 
    subjectTitle: string, 
    categoryId?: string, 
    categoryTitle?: string
  ) => {
    for (const item of navItems) {
      items.push({
        ...item,
        subjectId,
        subjectTitle,
        categoryId,
        categoryTitle
      })
      
      if (item.children) {
        collectItems(item.children, subjectId, subjectTitle, categoryId, categoryTitle)
      }
    }
  }

  for (const subject of navigationConfig) {
    // 添加学科本身
    items.push({
      title: subject.title,
      path: subject.path,
      description: subject.description,
      icon: subject.icon,
      subjectId: subject.id,
      subjectTitle: subject.title
    })

    for (const category of subject.categories) {
      // 添加分类本身
      items.push({
        title: category.title,
        path: category.path,
        description: category.description,
        icon: category.icon,
        subjectId: subject.id,
        subjectTitle: subject.title,
        categoryId: category.id,
        categoryTitle: category.title
      })

      // 添加分类下的导航项
      if (category.navigation) {
        collectItems(
          category.navigation, 
          subject.id, 
          subject.title, 
          category.id, 
          category.title
        )
      }
    }
  }

  return items
}