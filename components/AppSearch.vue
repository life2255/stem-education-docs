<!-- File: components/AppSearch.vue -->
<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-2xl' }">
    <div class="p-6">
      <!-- 搜索输入框 -->
      <div class="relative">
        <UInput
          v-model="searchQuery"
          size="lg"
          icon="i-heroicons-magnifying-glass"
          placeholder="搜索文档内容..."
          class="w-full"
          autofocus
          @input="handleSearch"
          @keydown.esc="isOpen = false"
        />
        
        <!-- 清除按钮 -->
        <UButton
          v-if="searchQuery"
          icon="i-heroicons-x-mark"
          color="gray"
          variant="ghost"
          size="sm"
          class="absolute right-2 top-1/2 transform -translate-y-1/2"
          @click="clearSearch"
        />
      </div>

      <!-- 学科筛选 -->
      <div class="flex items-center gap-2 mt-4">
        <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">筛选：</span>
        <UButton
          :color="selectedSubject === null ? 'primary' : 'gray'"
          :variant="selectedSubject === null ? 'solid' : 'outline'"
          size="xs"
          @click="setSubjectFilter(null)"
        >
          全部
        </UButton>
        <UButton
          v-for="subject in subjects"
          :key="subject.id"
          size="xs"
          :color="selectedSubject === subject.id ? 'primary' : 'gray'"
          :variant="selectedSubject === subject.id ? 'solid' : 'outline'"
          @click="setSubjectFilter(subject.id)"
        >
          {{ subject.title }}
        </UButton>
      </div>

      <!-- 搜索结果 -->
      <div class="mt-6 space-y-4 max-h-96 overflow-y-auto">
        <!-- 加载中 -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p class="text-sm text-gray-500 dark:text-gray-400">正在搜索...</p>
        </div>

        <!-- 搜索结果列表 -->
        <div v-else-if="results.length > 0" class="space-y-3">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            找到 {{ results.length }} 个结果
          </div>
          
          <NuxtLink
            v-for="result in results"
            :key="result._path"
            :to="result._path"
            class="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
            @click="closeSearch"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 dark:text-white mb-1">
                  {{ result.title }}
                </h4>
                <p v-if="result.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {{ result.description }}
                </p>
                <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <UIcon :name="getSubjectIcon(result._path)" class="w-3 h-3" />
                    {{ getSubjectName(result._path) }}
                  </span>
                  <span v-if="getCategoryName(result._path)">
                    {{ getCategoryName(result._path) }}
                  </span>
                  <span v-if="result.readingTime">
                    {{ result.readingTime }}
                  </span>
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
        <div v-else-if="searchQuery && !loading" class="text-center py-12">
          <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">未找到相关内容</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            尝试使用不同的关键词或调整筛选条件
          </p>
        </div>

        <!-- 初始状态 -->
        <div v-else-if="!searchQuery" class="text-center py-12">
          <UIcon name="i-heroicons-document-magnifying-glass" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">搜索文档</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            输入关键词搜索文档内容
          </p>
        </div>
      </div>

      <!-- 快捷提示 -->
      <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">↵</kbd>
              选择
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">Esc</kbd>
              关闭
            </span>
          </div>
          <span>{{ results.length }} / 100</span>
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

const { getSubjects } = useNavigation()

// 响应式数据
const searchQuery = ref('')
const selectedSubject = ref<string | null>(null)
const loading = ref(false)
const results = ref<any[]>([])

// 计算属性
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 获取学科数据（改为异步获取）
const { data: subjects } = await useAsyncData('search-subjects', () => getSubjects())

// 难度标签
const difficultyLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

// 防抖搜索处理
const searchTimeout = ref<NodeJS.Timeout | null>(null)

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(async () => {
    await performSearch()
  }, 300)
}

// 执行搜索
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    results.value = []
    return
  }

  loading.value = true

  try {
    // 构建查询条件
    let query = queryContent()
      .where({
        $or: [
          { title: { $icontains: searchQuery.value } },
          { description: { $icontains: searchQuery.value } },
          { body: { $icontains: searchQuery.value } }
        ]
      })
      .limit(100)
      .only(['title', 'description', '_path', 'subject', 'category', 'difficulty', 'readingTime'])

    // 学科筛选
    if (selectedSubject.value) {
      query = query.where({ _path: { $contains: `/${selectedSubject.value}/` } })
    }

    const data = await query.find()
    results.value = data
  } catch (error) {
    console.error('搜索失败:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

// 设置学科筛选
const setSubjectFilter = (subjectId: string | null) => {
  selectedSubject.value = subjectId
  if (searchQuery.value) {
    performSearch()
  }
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  results.value = []
}

// 关闭搜索
const closeSearch = () => {
  isOpen.value = false
}

// 获取学科名称
const getSubjectName = (path: string) => {
  const segments = path.split('/').filter(Boolean)
  if (segments.length > 0) {
    const subjectId = segments[0]
    const subject = subjects.value?.find(s => s.id === subjectId)
    return subject?.title || subjectId
  }
  return '未知'
}

// 获取学科图标
const getSubjectIcon = (path: string) => {
  const segments = path.split('/').filter(Boolean)
  if (segments.length > 0) {
    const subjectId = segments[0]
    const subject = subjects.value?.find(s => s.id === subjectId)
    return subject?.icon || 'i-heroicons-document-text'
  }
  return 'i-heroicons-document-text'
}

// 获取分类名称
const getCategoryName = (path: string) => {
  const segments = path.split('/').filter(Boolean)
  if (segments.length >= 2) {
    return segments[1]
  }
  return ''
}

// 监听模态框关闭时清空搜索
watch(isOpen, (value) => {
  if (!value) {
    searchQuery.value = ''
    results.value = []
    selectedSubject.value = null
  }
})

// 键盘快捷键
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    // Cmd/Ctrl + K 打开搜索
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      isOpen.value = true
    }
  }

  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 优化滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

/* 键盘快捷键样式 */
kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.75rem;
  font-weight: 500;
}
</style>