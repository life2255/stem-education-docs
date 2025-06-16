<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏（包含一级和二级菜单） -->
    <AppHeader @open-search="isSearchOpen = true" />

    <!-- 主内容区域 -->
    <main class="stem-container py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- 侧边栏 -->
        <aside class="lg:col-span-3" v-if="showSidebar">
          <AppSidebar />
        </aside>

        <!-- 内容区域 -->
        <div :class="showSidebar ? 'lg:col-span-9' : 'lg:col-span-12'">
          <slot />
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <AppFooter />

    <!-- 搜索弹窗 -->
    <AppSearch v-model="isSearchOpen" />
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

// 调试信息
if (process.dev) {
  watchEffect(() => {
    console.log('=== Layout Debug ===')
    console.log('Route path:', route.path)
    console.log('Show sidebar:', showSidebar.value)
    console.log('Search open:', isSearchOpen.value)
  })
}
</script>