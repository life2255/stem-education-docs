<!-- File: components/AppSidebar.vue -->
<!-- 优化版本：防止左侧栏闪动 -->
<template>
  <div class="h-full">
    <!-- 学科首页：/chemistry (层级=1，不显示侧栏) -->
    <div v-if="pathSegments.length === 1" class="space-y-6">
      <div class="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
        <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <div>通过顶部菜单浏览分类</div>
      </div>
    </div>

    <!-- 二级概述页和具体内容页：/chemistry/inorganic-chemistry (层级>=2，显示导航) -->
    <div v-else-if="pathSegments.length >= 2" class="space-y-2">
      <!-- 导航树 - 添加平滑过渡 -->
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        leave-active-class="transition-opacity duration-150 ease-in"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        mode="out-in"
      >
        <nav v-if="navigation.length > 0" key="nav-content" class="space-y-1">
          <SimpleNavigationItem
            v-for="item in navigation"
            :key="item._path"
            :item="item"
            :current-path="route.path"
            :level="0"
          />
        </nav>
        
        <!-- 加载状态 -->
        <div v-else key="nav-loading" class="text-center py-8">
          <div class="text-gray-500 dark:text-gray-400 text-sm">
            <div class="animate-pulse">正在加载导航...</div>
          </div>
        </div>
      </Transition>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/composables/useNavigation'

const route = useRoute()
const { getCategoryNavigation, getSubjectById } = useNavigation()

// 响应式数据
const currentSubject = ref<any>(null)
const navigation = ref<NavigationItem[]>([])

// 🎯 关键：追踪当前分类路径，避免不必要的重新加载
const currentCategoryPath = ref<string>('')

// 路径分析
const pathSegments = computed(() => route.path.split('/').filter(Boolean))

// 🎯 智能数据加载逻辑 - 防止闪动
const loadData = async () => {
  try {
    const segments = pathSegments.value
    if (segments.length === 0) return

    // 1. 始终更新学科信息（轻量级操作）
    if (segments.length >= 1) {
      const subject = await getSubjectById(segments[0])
      currentSubject.value = subject ? JSON.parse(JSON.stringify(subject)) : null
    }

    // 2. 🎯 智能导航加载：只有分类路径改变时才重新加载
    if (segments.length >= 2) {
      const newCategoryPath = `/${segments[0]}/${segments[1]}`
      
      // ✨ 关键优化：如果是同一个分类，不重新加载导航数据
      if (currentCategoryPath.value === newCategoryPath && navigation.value.length > 0) {
        // 同一分类下的文章切换，保持导航数据不变
        return
      }
      
      // 分类改变了，才需要重新加载导航
      if (currentCategoryPath.value !== newCategoryPath) {
        // 🎯 只有跨分类时才清空数据（减少闪动）
        if (currentCategoryPath.value && currentCategoryPath.value.split('/')[1] !== segments[0]) {
          navigation.value = [] // 跨学科时才清空
        }
        
        currentCategoryPath.value = newCategoryPath
        
        const nav = await getCategoryNavigation(newCategoryPath)
        navigation.value = JSON.parse(JSON.stringify(nav))
      }
    } else {
      // 回到学科首页，清空导航和分类路径
      if (currentCategoryPath.value) {
        currentCategoryPath.value = ''
        navigation.value = []
      }
    }
  } catch (error) {
    console.error('加载侧边栏数据失败:', error)
    // 发生错误时也不要清空现有导航，除非必要
    currentSubject.value = null
  }
}

// 监听路由变化
watch(() => route.path, loadData, { immediate: true })

// 🎯 组件卸载时清理状态
onUnmounted(() => {
  currentCategoryPath.value = ''
  navigation.value = []
  currentSubject.value = null
})
</script>