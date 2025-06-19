<!-- File: layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏（包含一级和二级菜单） -->
    <AppHeader @open-search="isSearchOpen = true" />

    <!-- 主内容区域 -->
    <div class="flex">
      <!-- 左侧栏 -->
      <aside 
        v-if="showSidebar" 
        class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        <div class="p-6">
          <AppSidebar />
        </div>
      </aside>

      <!-- 主要内容区域 -->
      <main class="flex-1 min-w-0">
        <!-- 内容容器 -->
        <div :class="showToc ? 'pr-80' : ''">
          <div class="stem-container py-8">
            <slot />
          </div>
        </div>

        <!-- 右侧文章目录 -->
        <aside 
          v-if="showToc"
          class="fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
        >
          <div class="p-6">
            <AppToc />
          </div>
        </aside>
      </main>
    </div>

    <!-- 页脚 -->
    <AppFooter />

    <!-- 搜索弹窗 -->
    <AppSearch v-if="isSearchOpen" v-model="isSearchOpen" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// 搜索状态
const isSearchOpen = ref(false)

// 根据页面类型决定是否显示侧边栏
const showSidebar = computed(() => {
  // 首页不显示侧边栏
  if (route.path === '/') return false

  // 检查是否在学科页面（包括学科首页和分类页面）
  const subjects = ['physics', 'chemistry', 'biology', 'mathematics']
  const pathSegments = route.path.split('/').filter(Boolean)

  if (pathSegments.length === 0) return false

  const firstSegment = pathSegments[0]

  // 只有在学科相关页面才显示侧边栏
  return subjects.includes(firstSegment)
})

// 判断是否显示文章目录（TOC）
const showToc = computed(() => {
  // 首页不显示TOC
  if (route.path === '/') return false
  
  const pathSegments = route.path.split('/').filter(Boolean)
  
  // 学科首页不显示TOC（如 /physics）
  if (pathSegments.length === 1) return false
  
  // 分类首页不显示TOC（如 /physics/mechanics）  
  if (pathSegments.length === 2 && route.path.endsWith('/')) return false
  
  // 其他情况（具体文章页面）显示TOC
  return pathSegments.length >= 2
})

// 调试信息
if (process.dev) {
  watchEffect(() => {
    console.log('=== Layout Debug ===')
    console.log('Route path:', route.path)
    console.log('Show sidebar:', showSidebar.value)
    console.log('Show TOC:', showToc.value)
    console.log('Search open:', isSearchOpen.value)
  })
}
</script>

<style>
/* 自定义滚动条样式 */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-300 {
  scrollbar-color: rgb(209 213 219) transparent;
}

.dark .scrollbar-thumb-gray-600 {
  scrollbar-color: rgb(75 85 99) transparent;
}

.scrollbar-track-transparent {
  scrollbar-track-color: transparent;
}

/* WebKit 浏览器滚动条 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 3px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}
</style>