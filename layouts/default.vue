<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- 顶部导航栏 -->
      <AppHeader />

      <!-- 面包屑导航 -->
      <div class="stem-container py-4" v-if="route.path !== '/'">
        <AppBreadcrumb />
      </div>

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
    </div>
  </template>

  <script setup lang="ts">
  const route = useRoute()

  // 根据页面类型决定是否显示侧边栏
  const showSidebar = computed(() => {
    // 首页不显示侧边栏
    if (route.path === '/') return false

    // 学科首页显示
    const subjects = ['physics', 'chemistry', 'biology', 'mathematics']
    const firstSegment = route.path.split('/')[1]

    return subjects.includes(firstSegment)
  })
  </script>