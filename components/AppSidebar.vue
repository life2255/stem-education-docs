<!-- components/AppSidebar.vue -->
<template>
  <div class="sticky top-24">
    <nav class="space-y-6">
      <!-- 当前分类标题 -->
      <div v-if="currentCategory">
        <div class="flex items-center space-x-2 mb-4">
          <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-folder" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ currentCategory.title }}
          </h3>
        </div>
      </div>

      <!-- 文章列表 -->
      <div v-if="navigation.length > 0" class="space-y-2">
        <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          文章列表
        </h4>

        <ul class="space-y-1">
          <li v-for="item in navigation" :key="item._path">
            <NuxtLink
              :to="item._path"
              class="group flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              :class="{
                'bg-primary-600 text-white shadow-sm': isActive(item._path),
                'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800': !isActive(item._path)
              }"
            >
              <div class="flex items-center space-x-2 min-w-0">
                <UIcon
                  name="i-heroicons-document-text"
                  class="w-4 h-4 flex-shrink-0"
                  :class="{
                    'text-white': isActive(item._path),
                    'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300': !isActive(item._path)
                  }"
                />
                <span class="truncate">{{ item.title }}</span>
              </div>

              <!-- 难度标记 -->
              <span
                v-if="item.difficulty"
                class="ml-2 px-2 py-0.5 text-xs rounded-full flex-shrink-0"
                :class="{
                  'bg-white/20 text-white': isActive(item._path),
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': !isActive(item._path) && item.difficulty === 'beginner',
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': !isActive(item._path) && item.difficulty === 'intermediate',
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': !isActive(item._path) && item.difficulty === 'advanced'
                }"
              >
                {{ difficultyLabels[item.difficulty] }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- 没有内容时的提示 -->
      <div v-else class="text-center py-8">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-sm">暂无相关内容</p>
        <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">请选择其他分类或稍后再试</p>
      </div>

      <!-- 分类信息卡片 -->
      <div v-if="currentCategory" class="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">分类信息</h4>
        <div class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div class="flex justify-between">
            <span>文章数量</span>
            <span class="font-medium">{{ navigation.length }}</span>
          </div>
          <div class="flex justify-between">
            <span>难度分布</span>
            <div class="flex space-x-1">
              <span v-if="difficultyStats.beginner" class="inline-block w-2 h-2 bg-green-400 rounded-full" title="初级"></span>
              <span v-if="difficultyStats.intermediate" class="inline-block w-2 h-2 bg-yellow-400 rounded-full" title="中级"></span>
              <span v-if="difficultyStats.advanced" class="inline-block w-2 h-2 bg-red-400 rounded-full" title="高级"></span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getCategoryNavigation } = useNavigation()

// 获取导航数据
const { data: navigation } = await useAsyncData(
  `sidebar-navigation-${route.path}`,
  async () => {
    const pathSegments = route.path.split('/').filter(Boolean)
    if (pathSegments.length >= 2) {
      const categoryPath = `/${pathSegments[0]}/${pathSegments[1]}`
      return await getCategoryNavigation(categoryPath)
    }
    return []
  },
  {
    watch: [() => route.path]
  }
)

// 当前分类信息
const currentCategory = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length >= 2) {
    return {
      subject: pathSegments[0],
      category: pathSegments[1],
      title: getCategoryTitle(pathSegments[0], pathSegments[1]),
      path: `/${pathSegments[0]}/${pathSegments[1]}`
    }
  }
  return null
})

// 难度标签映射
const difficultyLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

// 难度统计
const difficultyStats = computed(() => {
  const stats = { beginner: 0, intermediate: 0, advanced: 0 }
  navigation.value?.forEach(item => {
    if (item.difficulty && stats.hasOwnProperty(item.difficulty)) {
      stats[item.difficulty as keyof typeof stats]++
    }
  })
  return stats
})

// 判断链接是否激活
const isActive = (path: string) => {
  return route.path === path
}

// 获取分类标题的辅助函数
function getCategoryTitle(subject: string, category: string): string {
  // 这里可以扩展映射表，或者从API获取
  const titles: Record<string, Record<string, string>> = {
    physics: {
      mechanics: '力学',
      electricity: '电磁学',
      optics: '光学',
      thermodynamics: '热学',
      acoustics: '声学',
      atomic: '原子物理',
      relativity: '相对论',
      quantum: '量子力学'
    },
    chemistry: {
      'atomic-structure': '原子结构',
      'chemical-bonds': '化学键',
      'reactions': '化学反应',
      'periodic-table': '元素周期表',
      'acid-base': '酸碱理论',
      'redox': '氧化还原',
      'hydrocarbons': '烃类',
      'functional-groups': '官能团',
      'synthesis': '有机合成',
      'inorganic': '无机化学',
      'organic': '有机化学'
    },
    biology: {
      'cell-structure': '细胞结构',
      'cell-division': '细胞分裂',
      'metabolism': '细胞代谢',
      'dna-rna': 'DNA与RNA',
      'gene-expression': '基因表达',
      'genetic-variation': '遗传变异',
      'ecosystems': '生态系统',
      'population': '种群生态',
      'biodiversity': '生物多样性',
      'cell-biology': '细胞生物学',
      'genetics': '遗传学',
      'ecology': '生态学'
    },
    mathematics: {
      'linear-algebra': '线性代数',
      'polynomials': '多项式',
      'equations': '方程与不等式',
      'plane-geometry': '平面几何',
      'solid-geometry': '立体几何',
      'analytic-geometry': '解析几何',
      'limits': '极限',
      'derivatives': '导数',
      'integrals': '积分',
      'algebra': '代数',
      'geometry': '几何',
      'calculus': '微积分'
    }
  }

  return titles[subject]?.[category] || category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
</script>