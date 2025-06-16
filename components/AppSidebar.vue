<template>
    <div class="sticky top-24">
      <nav class="space-y-6">
        <!-- 当前分类标题 -->
        <div v-if="currentCategory">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ currentCategory.title }}
          </h3>
        </div>

        <!-- 文章列表 -->
        <div v-for="section in navigation" :key="section.title" class="space-y-3">
          <h4 v-if="section.title" class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            {{ section.title }}
          </h4>

          <ul class="space-y-2">
            <li v-for="item in section.items" :key="item._path">
              <NuxtLink
                :to="item._path"
                class="group flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors"
                :class="{
                  'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400': isActive(item._path),
                  'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800': !isActive(item._path)
                }"
              >
                <span class="truncate">{{ item.title }}</span>

                <!-- 难度标记 -->
                <span
                  v-if="item.difficulty"
                  class="ml-2 px-2 py-0.5 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': item.difficulty === 'beginner',
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': item.difficulty === 'intermediate',
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': item.difficulty === 'advanced'
                  }"
                >
                  {{ difficultyLabels[item.difficulty] }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 没有内容时的提示 -->
        <div v-if="!navigation.length" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">暂无相关内容</p>
        </div>
      </nav>
    </div>
  </template>

  <script setup lang="ts">
  const route = useRoute()
  const { data: navigation } = await useAsyncData(
    `navigation-${route.path}`,
    () => fetchContentNavigation(queryContent(route.path))
  )

  // 当前分类信息
  const currentCategory = computed(() => {
    const paths = route.path.split('/').filter(Boolean)
    if (paths.length >= 2) {
      return {
        subject: paths[0],
        category: paths[1],
        title: getCategoryTitle(paths[0], paths[1])
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

  // 判断链接是否激活
  const isActive = (path: string) => {
    return route.path === path
  }

  // 获取分类标题
  function getCategoryTitle(subject: string, category: string): string {
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
        reactions: '化学反应',
        'periodic-table': '元素周期表',
        'acid-base': '酸碱理论',
        redox: '氧化还原',
        hydrocarbons: '烃类',
        'functional-groups': '官能团',
        synthesis: '有机合成'
      },
      biology: {
        'cell-structure': '细胞结构',
        'cell-division': '细胞分裂',
        metabolism: '细胞代谢',
        'dna-rna': 'DNA与RNA',
        'gene-expression': '基因表达',
        'genetic-variation': '遗传变异',
        ecosystems: '生态系统',
        population: '种群生态',
        biodiversity: '生物多样性'
      },
      mathematics: {
        'linear-algebra': '线性代数',
        polynomials: '多项式',
        equations: '方程与不等式',
        'plane-geometry': '平面几何',
        'solid-geometry': '立体几何',
        'analytic-geometry': '解析几何',
        limits: '极限',
        derivatives: '导数',
        integrals: '积分'
      }
    }

    return titles[subject]?.[category] || category
  }
  </script>