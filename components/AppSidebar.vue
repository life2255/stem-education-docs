<!-- File: components/AppSidebar.vue -->
<!-- 修复版本：避免在 useAsyncData 中传递复杂对象 -->
<template>
  <div class="h-full">
    <!-- 学科首页：显示分类导航 -->
    <div v-if="isSubjectHomepage && currentSubject" class="space-y-6">
      <!-- 学科标题 -->
      <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ currentSubject.title }}
        </h2>
        <p v-if="currentSubject.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ currentSubject.description }}
        </p>
      </div>

      <!-- 分类列表 -->
      <nav class="space-y-2">
        <NuxtLink
          v-for="category in currentSubject.categories"
          :key="category.id"
          :to="category.path"
          :class="[
            'relative block py-2 text-base font-semibold transition-colors duration-200',
            route.path.startsWith(category.path)
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400'
          ]"
        >
          <!-- 活跃指示器 -->
          <div
            v-if="route.path.startsWith(category.path)"
            class="absolute left-0 top-0 bottom-0 w-0.5 bg-green-500 rounded-r-full"
          />
          
          {{ category.title }}
        </NuxtLink>
      </nav>
    </div>

    <!-- 分类页面：显示导航结构 -->
    <div v-else-if="navigation && navigation.length > 0" class="space-y-6">
      <!-- 当前分类标题 -->
      <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ currentCategory?.title || '内容导航' }}
        </h2>
        <p v-if="currentCategory?.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ currentCategory.description }}
        </p>
      </div>

      <!-- 导航树 -->
      <nav class="space-y-2">
        <SimpleNavigationItem
          v-for="item in navigation"
          :key="item._path"
          :item="item"
          :current-path="route.path"
          :level="0"
        />
      </nav>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 dark:text-gray-500 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      <h3 class="text-base font-medium text-gray-900 dark:text-white mb-2">
        暂无内容
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        该分类下还没有文章
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/composables/useNavigation'

const route = useRoute()
const { getCategoryNavigation, getSubjectById, getCategoryById } = useNavigation()

// 计算当前路径段
const pathSegments = computed(() => route.path.split('/').filter(Boolean))

// 简化的响应式状态 - 避免复杂对象
const currentSubject = ref<any>(null)
const currentCategory = ref<any>(null)  
const navigation = ref<NavigationItem[]>([])

// 判断是否为学科首页
const isSubjectHomepage = computed(() => {
  return pathSegments.value.length === 1 && currentSubject.value !== null
})

// 加载数据的函数 - 确保返回的都是纯对象
const loadData = async () => {
  try {
    // 重置状态
    currentSubject.value = null
    currentCategory.value = null
    navigation.value = []

    if (pathSegments.value.length === 0) return

    // 加载学科信息
    if (pathSegments.value.length >= 1) {
      const subject = await getSubjectById(pathSegments.value[0])
      // 确保是纯对象
      currentSubject.value = subject ? JSON.parse(JSON.stringify(subject)) : null
    }

    // 加载分类信息和导航
    if (pathSegments.value.length >= 2 && currentSubject.value) {
      const category = await getCategoryById(pathSegments.value[0], pathSegments.value[1])
      // 确保是纯对象
      currentCategory.value = category ? JSON.parse(JSON.stringify(category)) : null
      
      const categoryPath = `/${pathSegments.value[0]}/${pathSegments.value[1]}`
      const nav = await getCategoryNavigation(categoryPath)
      // 确保是纯对象数组
      navigation.value = JSON.parse(JSON.stringify(nav))
    }
  } catch (error) {
    console.error('加载侧边栏数据失败:', error)
    // 重置到安全状态
    currentSubject.value = null
    currentCategory.value = null
    navigation.value = []
  }
}

// 使用 watch 而不是 useAsyncData 来避免序列化问题
watch(() => route.path, () => {
  loadData()
}, { immediate: true })

// 确保在组件销毁时清理状态
onUnmounted(() => {
  currentSubject.value = null
  currentCategory.value = null
  navigation.value = []
})
</script>