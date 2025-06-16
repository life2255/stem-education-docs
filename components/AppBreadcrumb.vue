<template>
    <nav aria-label="面包屑">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <NuxtLink to="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <UIcon name="i-heroicons-home" class="w-4 h-4" />
          </NuxtLink>
        </li>

        <li v-for="(item, index) in breadcrumbs" :key="index" class="flex items-center">
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400 mx-1" />

          <NuxtLink
            v-if="index < breadcrumbs.length - 1"
            :to="item.path"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {{ item.label }}
          </NuxtLink>

          <span v-else class="text-gray-900 dark:text-white font-medium">
            {{ item.label }}
          </span>
        </li>
      </ol>
    </nav>
  </template>

  <script setup lang="ts">
  const route = useRoute()

  // 学科名称映射
  const subjectNames: Record<string, string> = {
    physics: '物理',
    chemistry: '化学',
    biology: '生物',
    mathematics: '数学'
  }

  // 分类名称映射
  const categoryNames: Record<string, string> = {
    mechanics: '力学',
    electricity: '电磁学',
    optics: '光学',
    thermodynamics: '热学',
    acoustics: '声学',
    atomic: '原子物理',
    relativity: '相对论',
    quantum: '量子力学',
    'atomic-structure': '原子结构',
    'chemical-bonds': '化学键',
    reactions: '化学反应',
    'periodic-table': '元素周期表',
    'acid-base': '酸碱理论',
    redox: '氧化还原',
    hydrocarbons: '烃类',
    'functional-groups': '官能团',
    synthesis: '有机合成',
    'cell-structure': '细胞结构',
    'cell-division': '细胞分裂',
    metabolism: '细胞代谢',
    'dna-rna': 'DNA与RNA',
    'gene-expression': '基因表达',
    'genetic-variation': '遗传变异',
    ecosystems: '生态系统',
    population: '种群生态',
    biodiversity: '生物多样性',
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

  // 生成面包屑数据
  const breadcrumbs = computed(() => {
    const paths = route.path.split('/').filter(Boolean)
    const items = []
    let currentPath = ''

    paths.forEach((segment, index) => {
      currentPath += `/${segment}`

      let label = segment
      if (index === 0 && subjectNames[segment]) {
        label = subjectNames[segment]
      } else if (categoryNames[segment]) {
        label = categoryNames[segment]
      } else {
        // 从页面元数据获取标题
        label = route.meta.title as string || segment
      }

      items.push({
        path: currentPath,
        label
      })
    })

    return items
  })
  </script>