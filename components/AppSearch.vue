<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-2xl' }">
    <div class="p-4">
      <!-- 搜索输入框 -->
      <div class="relative">
        <UInput
          v-model="searchQuery"
          size="lg"
          icon="i-heroicons-magnifying-glass"
          placeholder="搜索文档..."
          :ui="{ icon: { trailing: { pointer: '' } } }"
          @update:model-value="handleSearch"
        />

        <!-- 学科筛选 -->
        <div class="flex items-center gap-2 mt-4">
          <span class="text-sm text-gray-500 dark:text-gray-400">筛选：</span>
          <UButton
            v-for="subject in subjects"
            :key="subject.id"
            size="xs"
            :color="selectedSubject === subject.id ? 'primary' : 'gray'"
            :variant="selectedSubject === subject.id ? 'solid' : 'ghost'"
            @click="toggleSubject(subject.id)"
          >
            {{ subject.name }}
          </UButton>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-if="searchQuery" class="mt-6 space-y-4 max-h-96 overflow-y-auto">
        <!-- 加载中 -->
        <div v-if="loading" class="text-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-gray-400" />
        </div>

        <!-- 搜索结果列表 -->
        <div v-else-if="results.length > 0" class="space-y-2">
          <NuxtLink
            v-for="result in results"
            :key="result._id"
            :to="result._path"
            class="block p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="isOpen = false"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ result.title }}
                </h4>
                <p v-if="result.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {{ result.description }}
                </p>
                <div class="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{{ getSubjectName(result._path) }}</span>
                  <span>·</span>
                  <span>{{ getCategoryName(result._path) }}</span>
                  <span v-if="result.readingTime">·</span>
                  <span v-if="result.readingTime">{{ result.readingTime }}</span>
                </div>
              </div>

              <!-- 难度标记 -->
              <span
                v-if="result.difficulty"
                class="ml-4 px-2 py-1 text-xs rounded-full flex-shrink-0"
                :class="{
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': result.difficulty === 'beginner',
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': result.difficulty === 'intermediate',
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': result.difficulty === 'advanced'
                }"
              >
                {{ difficultyLabels[result.difficulty] }}
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- 无结果 -->
        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">没有找到相关内容</p>
        </div>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')
const selectedSubject = ref<string | null>(null)
const loading = ref(false)
const results = ref<any[]>([])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 学科列表
const subjects = [
  { id: 'physics', name: '物理' },
  { id: 'chemistry', name: '化学' },
  { id: 'biology', name: '生物' },
  { id: 'mathematics', name: '数学' }
]

// 难度标签
const difficultyLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

// 搜索处理
const handleSearch = useDebounceFn(async () => {
  if (!searchQuery.value) {
    results.value = []
    return
  }

  loading.value = true

  try {
    // 构建查询
    let query = queryContent()
      .where({
        $or: [
          { title: { $icontains: searchQuery.value } },
          { description: { $icontains: searchQuery.value } },
          { body: { $icontains: searchQuery.value } }
        ]
      })
      .limit(20)
      .only(['title', 'description', '_path', 'subject', 'category', 'difficulty', 'readingTime'])

    // 学科筛选
    if (selectedSubject.value) {
      query = query.where({ subject: selectedSubject.value })
    }

    const data = await query.find()
    results.value = data
  } catch (error) {
    console.error('搜索失败:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}, 300)

// 切换学科筛选
const toggleSubject = (subject: string) => {
  selectedSubject.value = selectedSubject.value === subject ? null : subject
  handleSearch()
}

// 获取学科名称
const getSubjectName = (path: string) => {
  const subject = path.split('/')[1]
  return subjects.find(s => s.id === subject)?.name || subject
}

// 获取分类名称
const getCategoryName = (path: string) => {
  const segments = path.split('/')
  if (segments.length >= 3) {
    // 这里可以映射分类名称
    return segments[2]
  }
  return ''
}

// 监听关闭时清空搜索
watch(isOpen, (value) => {
  if (!value) {
    searchQuery.value = ''
    results.value = []
    selectedSubject.value = null
  }
})
</script>