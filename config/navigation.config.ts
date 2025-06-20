// File: config/navigation.config.ts
// 简化配置：只配置顶级架构，内容自动发现

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
  // 移除 navigation 字段，改为自动发现
}

export interface BreadcrumbItem {
  title: string
  path: string
}

// 简化的配置：只配置学科和主要分类
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
        description: '物体运动和相互作用',
        icon: 'i-heroicons-cog-6-tooth',
        path: '/physics/mechanics'
      },
      {
        id: 'electricity',
        title: '电磁学',
        description: '电场、磁场及其应用',
        icon: 'i-heroicons-lightning-bolt',
        path: '/physics/electricity'
      },
      {
        id: 'relativity',
        title: '相对论',
        description: '时空的本质和引力理论',
        icon: 'i-heroicons-globe-alt',
        path: '/physics/relativity'
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
        id: 'inorganic-chemistry',
        title: '无机化学',
        description: '无机化合物的性质和反应',
        icon: 'i-heroicons-cube',
        path: '/chemistry/inorganic-chemistry'
      },
      {
        id: 'organic-chemistry',
        title: '有机化学',
        description: '有机化合物的结构和合成',
        icon: 'i-heroicons-puzzle-piece',
        path: '/chemistry/organic-chemistry'
      },
      {
        id: 'reference',
        title: '参考资料',
        description: '化学参考工具和数据',
        icon: 'i-heroicons-book-open',
        path: '/chemistry/reference'
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
        id: 'cell',
        title: '细胞生物学',
        description: '细胞的结构和功能',
        icon: 'i-heroicons-squares-2x2',
        path: '/biology/cell'
      },
      {
        id: 'boltony',
        title: '植物学',
        description: '植物的生长和繁殖',
        icon: 'i-heroicons-leaf',
        path: '/biology/boltony'
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
        description: '数的运算和方程求解',
        icon: 'i-heroicons-variable',
        path: '/mathematics/algebra'
      },
      {
        id: 'calculus',
        title: '微积分',
        description: '连续变化的数学描述',
        icon: 'i-heroicons-chart-bar',
        path: '/mathematics/calculus'
      }
    ]
  }
]

// 辅助函数：根据路径查找配置项
export const findNavItemByPath = (path: string): Subject | Category | null => {
  for (const subject of navigationConfig) {
    if (subject.path === path) return subject
    
    for (const category of subject.categories) {
      if (category.path === path) return category
    }
  }
  return null
}

// 辅助函数：生成面包屑
export const getBreadcrumbsFromConfig = (currentPath: string): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [{ title: '首页', path: '/' }]
  
  const segments = currentPath.split('/').filter(Boolean)
  
  if (segments.length >= 1) {
    const subject = navigationConfig.find(s => s.id === segments[0])
    if (subject) {
      breadcrumbs.push({ title: subject.title, path: subject.path })
    }
  }
  
  if (segments.length >= 2) {
    const subject = navigationConfig.find(s => s.id === segments[0])
    const category = subject?.categories.find(c => c.id === segments[1])
    if (category) {
      breadcrumbs.push({ title: category.title, path: category.path })
    }
  }
  
  return breadcrumbs
}