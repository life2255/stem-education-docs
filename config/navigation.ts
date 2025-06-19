// File: config/navigation.ts
export interface NavigationConfig {
  subjects: Subject[]
}

export interface Subject {
  id: string
  title: string
  icon: string
  description?: string
  categories: Category[]
}

export interface Category {
  id: string
  title: string
  icon: string
  description?: string
}

// 静态导航配置 - 这里定义所有的学科和分类
export const navigationConfig: NavigationConfig = {
  subjects: [
    {
      id: 'physics',
      title: '物理学',
      icon: 'i-heroicons-bolt',
      description: '探索物质运动规律和自然现象的本质',
      categories: [
        {
          id: 'mechanics',
          title: '力学',
          icon: 'i-heroicons-cog-6-tooth',
          description: '研究物体的运动和相互作用'
        },
        {
          id: 'electricity',
          title: '电磁学',
          icon: 'i-heroicons-bolt',
          description: '电场、磁场及其相互作用'
        },
        {
          id: 'relativity',
          title: '相对论',
          icon: 'i-heroicons-globe-alt',
          description: '时空的本质和引力理论'
        }
      ]
    },
    {
      id: 'chemistry',
      title: '化学',
      icon: 'i-heroicons-beaker',
      description: '研究物质的组成、性质和变化规律',
      categories: [
        {
          id: 'inorganic chemistry',
          title: '无机化学',
          icon: 'i-heroicons-cube',
          description: '研究无机化合物的性质和反应'
        },
        {
          id: 'organic chemistry', 
          title: '有机化学',
          icon: 'i-heroicons-puzzle-piece',
          description: '研究有机化合物的结构和性质'
        },
        {
          id: 'reference',
          title: '参考资料',
          icon: 'i-heroicons-book-open',
          description: '化学参考资料和工具'
        }
      ]
    },
    {
      id: 'biology',
      title: '生物学',
      icon: 'i-heroicons-heart',
      description: '探索生命的奥秘和生物世界的多样性',
      categories: [
        {
          id: 'cell-biology',
          title: '细胞生物学',
          icon: 'i-heroicons-eye-dropper',
          description: '研究细胞的结构和功能'
        },
        {
          id: 'genetics',
          title: '遗传学',
          icon: 'i-heroicons-dna',
          description: '研究遗传和变异规律'
        }
      ]
    },
    {
      id: 'mathematics',
      title: '数学',
      icon: 'i-heroicons-calculator',
      description: '逻辑推理和抽象思维的基础学科',
      categories: [
        {
          id: 'algebra',
          title: '代数',
          icon: 'i-heroicons-variable',
          description: '研究数和符号的运算'
        },
        {
          id: 'calculus',
          title: '微积分',
          icon: 'i-heroicons-chart-bar',
          description: '研究函数的微分和积分'
        }
      ]
    }
  ]
}