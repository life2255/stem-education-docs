<template>
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <nav class="stem-container">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">S</span>
          </div>
          <span class="text-xl font-semibold text-gray-900 dark:text-white">STEM Docs</span>
        </NuxtLink>

        <!-- 主导航菜单 -->
        <div class="hidden md:flex items-center space-x-8">
          <!-- 学科导航 -->
          <div v-for="subject in subjects" :key="subject.id" class="relative">
            <UDropdown
              :items="getSubjectMenuItems(subject)"
              :popper="{ placement: 'bottom-start' }"
            >
              <UButton
                color="gray"
                variant="ghost"
                :label="subject.name"
                trailing-icon="i-heroicons-chevron-down-20-solid"
              />
            </UDropdown>
          </div>
        </div>

        <!-- 右侧工具栏 -->
        <div class="flex items-center space-x-4">
          <!-- 搜索按钮 -->
          <UButton
            icon="i-heroicons-magnifying-glass"
            color="gray"
            variant="ghost"
            aria-label="搜索"
            @click="isSearchOpen = true"
          />

          <!-- 主题切换 -->
          <ClientOnly>
            <UButton
              :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
              color="gray"
              variant="ghost"
              aria-label="切换主题"
              @click="toggleColorMode"
            />
            <template #fallback>
              <div class="w-10 h-10" />
            </template>
          </ClientOnly>

          <!-- 移动端菜单按钮 -->
          <UButton
            icon="i-heroicons-bars-3"
            color="gray"
            variant="ghost"
            class="md:hidden"
            aria-label="菜单"
            @click="isMobileMenuOpen = true"
          />
        </div>
      </div>
    </nav>

    <!-- 搜索模态框 -->
    <AppSearch v-model="isSearchOpen" />

    <!-- 移动端菜单 -->
    <USlideover v-model="isMobileMenuOpen">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-4">学科导航</h3>
        <AppMobileNav @close="isMobileMenuOpen = false" />
      </div>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
import type { DropdownItem } from '#ui/types'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const isSearchOpen = ref(false)
const isMobileMenuOpen = ref(false)

const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

// 学科配置
const subjects = [
  {
    id: 'physics',
    name: '物理',
    icon: 'i-heroicons-beaker',
    categories: [
      {
        name: '基础物理',
        items: [
          { label: '力学', to: '/physics/mechanics' },
          { label: '热学', to: '/physics/thermodynamics' },
          { label: '声学', to: '/physics/acoustics' }
        ]
      },
      {
        name: '进阶物理',
        items: [
          { label: '电磁学', to: '/physics/electricity' },
          { label: '光学', to: '/physics/optics' },
          { label: '原子物理', to: '/physics/atomic' }
        ]
      },
      {
        name: '现代物理',
        items: [
          { label: '相对论', to: '/physics/relativity' },
          { label: '量子力学', to: '/physics/quantum' }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    name: '化学',
    icon: 'i-heroicons-fire',
    categories: [
      {
        name: '基础化学',
        items: [
          { label: '原子结构', to: '/chemistry/atomic-structure' },
          { label: '化学键', to: '/chemistry/chemical-bonds' },
          { label: '化学反应', to: '/chemistry/reactions' }
        ]
      },
      {
        name: '无机化学',
        items: [
          { label: '元素周期表', to: '/chemistry/periodic-table' },
          { label: '酸碱理论', to: '/chemistry/acid-base' },
          { label: '氧化还原', to: '/chemistry/redox' }
        ]
      },
      {
        name: '有机化学',
        items: [
          { label: '烃类', to: '/chemistry/hydrocarbons' },
          { label: '官能团', to: '/chemistry/functional-groups' },
          { label: '有机合成', to: '/chemistry/synthesis' }
        ]
      }
    ]
  },
  {
    id: 'biology',
    name: '生物',
    icon: 'i-heroicons-heart',
    categories: [
      {
        name: '细胞生物学',
        items: [
          { label: '细胞结构', to: '/biology/cell-structure' },
          { label: '细胞分裂', to: '/biology/cell-division' },
          { label: '细胞代谢', to: '/biology/metabolism' }
        ]
      },
      {
        name: '遗传学',
        items: [
          { label: 'DNA与RNA', to: '/biology/dna-rna' },
          { label: '基因表达', to: '/biology/gene-expression' },
          { label: '遗传变异', to: '/biology/genetic-variation' }
        ]
      },
      {
        name: '生态学',
        items: [
          { label: '生态系统', to: '/biology/ecosystems' },
          { label: '种群生态', to: '/biology/population' },
          { label: '生物多样性', to: '/biology/biodiversity' }
        ]
      }
    ]
  },
  {
    id: 'mathematics',
    name: '数学',
    icon: 'i-heroicons-calculator',
    categories: [
      {
        name: '代数',
        items: [
          { label: '线性代数', to: '/mathematics/linear-algebra' },
          { label: '多项式', to: '/mathematics/polynomials' },
          { label: '方程与不等式', to: '/mathematics/equations' }
        ]
      },
      {
        name: '几何',
        items: [
          { label: '平面几何', to: '/mathematics/plane-geometry' },
          { label: '立体几何', to: '/mathematics/solid-geometry' },
          { label: '解析几何', to: '/mathematics/analytic-geometry' }
        ]
      },
      {
        name: '微积分',
        items: [
          { label: '极限', to: '/mathematics/limits' },
          { label: '导数', to: '/mathematics/derivatives' },
          { label: '积分', to: '/mathematics/integrals' }
        ]
      }
    ]
  }
]

// 生成下拉菜单项
const getSubjectMenuItems = (subject: any): DropdownItem[][] => {
  return subject.categories.map((category: any) => [
    {
      label: category.name,
      slot: 'header',
      disabled: true
    },
    ...category.items
  ])
}
</script>