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
          @click="selectedSubject = null"
        >
          全部
        </UButton>
        <UButton
          v-for="subject in subjects"
          :key="subject.id"
          size="xs"
          :color="selectedSubject === subject.id ? 'primary' : 'gray'"
          :variant="selectedSubject === subject.id ? 'solid' : 'outline'"
          @click="selectedSubject = subject.id"
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
            <h4 class="font-medium text-gray-900 dark:text-white mb-1">
              {{ result.title }}
            </h4>
            <p v-if="result.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
              {{ result.description }}
            </p>
            <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>{{ getSubjectName(result._path) }}</span>
              <span v-if="result.difficulty" class="capitalize">
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
        <div v-else class="text-center py-12">
          <UIcon name="i-heroicons-document-magnifying-glass" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">搜索文档</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            输入关键词搜索文档内容
          </p>
        </div>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { navigationConfig } from '~/config/navigation.config'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

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

// 使用配置中的学科数据
const subjects = navigationConfig

// 难度标签
const difficultyLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

// 防抖搜索处理
let searchTimeout: NodeJS.Timeout | null = null

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    performSearch()
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
    // 构建查询
    let query = queryContent()
      .where({
        $or: [
          { title: { $icontains: searchQuery.value } },
          { description: { $icontains: searchQuery.value } }
        ]
      })
      .limit(20)
      .only(['title', 'description', '_path', 'difficulty'])

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
    const subject = subjects.find(s => s.id === segments[0])
    return subject?.title || segments[0]
  }
  return '未知'
}

// 监听模态框关闭时清空搜索
watch(isOpen, (value) => {
  if (!value) {
    searchQuery.value = ''
    results.value = []
    selectedSubject.value = null
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>