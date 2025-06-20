<!-- File: layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏（包含一级和二级菜单） -->
    <AppHeader @open-search="isSearchOpen = true" />

    <!-- 主内容区域 - 使用更宽的容器 -->
    <div class="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6">
      <div 
        :class="[
          'grid gap-6 py-8',
          showSidebar && showToc ? 'grid-cols-12' : 
          showSidebar || showToc ? 'grid-cols-10' : 
          'grid-cols-1'
        ]"
      >
        <!-- 左侧栏 - 保持原宽度 -->
        <aside 
          v-if="showSidebar" 
          :class="[
            'sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent',
            showToc ? 'col-span-2' : 'col-span-3'
          ]"
        >
          <div class="pr-2">
            <AppSidebar />
          </div>
        </aside>

        <!-- 主要内容区域 - 调整宽度 -->
        <main 
          :class="[
            // 关键修改：当同时显示左侧栏和TOC时，主内容从col-span-8改为col-span-7
            showSidebar && showToc ? 'col-span-7' :
            showSidebar || showToc ? 'col-span-7' :
            'col-span-12',
            'min-w-0'
          ]"
        >
          <!-- 内容容器 - 调整最大宽度 -->
          <div class="max-w-5xl mx-auto px-4">
            <slot />
          </div>
        </main>

        <!-- 右侧文章目录 - 加宽 -->
        <aside 
          v-if="showToc"
          :class="[
            'sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent',
            // 关键修改：右侧TOC从col-span-2改为col-span-3
            showSidebar ? 'col-span-3' : 'col-span-3'
          ]"
        >
          <div class="pl-2">
            <AppToc />
          </div>
        </aside>
      </div>
    </div>

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

// 判断是否显示文章目录（TOC）
const showToc = computed(() => {
  // 首页不显示TOC
  if (route.path === '/') return false
  
  const pathSegments = route.path.split('/').filter(Boolean)
  
  // 至少需要是学科下的页面才考虑显示TOC
  if (pathSegments.length < 1) return false
  
  // 学科首页（如 /physics）不显示TOC，因为通常是分类导航页面
  if (pathSegments.length === 1) return false
  
  // 其他情况（包括分类index页面和具体文章）都可能显示TOC
  // 具体是否显示由TOC组件根据实际解析到的标题数量决定
  return true
})
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

/* 网格布局优化 */
.grid {
  align-items: start;
}

/* 内容区域阅读优化 */
.max-w-5xl {
  max-width: 64rem; /* 1024px - 更宽的阅读区域 */
}

/* 侧栏内边距优化 */
.pr-2 {
  padding-right: 0.5rem;
}

.pl-2 {
  padding-left: 0.5rem;
}
</style>