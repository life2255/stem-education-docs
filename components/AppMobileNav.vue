<template>
  <div class="space-y-4">
    <!-- 学科列表 -->
    <div v-for="subject in subjects" :key="subject.id" class="border-b border-gray-200 dark:border-gray-700 pb-4">
      <button
        @click="toggleSubject(subject.id)"
        class="w-full flex items-center justify-between text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <span class="font-medium text-gray-900 dark:text-white">{{ subject.name }}</span>
        <UIcon
          :name="expandedSubject === subject.id ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          class="w-5 h-5 text-gray-400"
        />
      </button>

      <!-- 展开的分类 -->
      <div v-if="expandedSubject === subject.id" class="mt-2 space-y-2">
        <div v-for="category in subject.categories" :key="category.name" class="ml-4">
          <button
            @click="toggleCategory(`${subject.id}-${category.name}`)"
            class="w-full flex items-center justify-between text-left p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span class="text-gray-700 dark:text-gray-300">{{ category.name }}</span>
            <UIcon
              :name="expandedCategory === `${subject.id}-${category.name}` ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
              class="w-4 h-4 text-gray-400"
            />
          </button>

          <!-- 展开的链接 -->
          <div v-if="expandedCategory === `${subject.id}-${category.name}`" class="mt-1 ml-4 space-y-1">
            <NuxtLink
              v-for="item in category.items"
              :key="item.to"
              :to="item.to"
              class="block p-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50"
              @click="$emit('close')"
            >
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])

const expandedSubject = ref<string | null>(null)
const expandedCategory = ref<string | null>(null)

// 学科配置（与 AppHeader 相同）
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

// 切换学科展开状态
const toggleSubject = (subjectId: string) => {
  expandedSubject.value = expandedSubject.value === subjectId ? null : subjectId
  expandedCategory.value = null
}

// 切换分类展开状态
const toggleCategory = (categoryId: string) => {
  expandedCategory.value = expandedCategory.value === categoryId ? null : categoryId
}
</script>