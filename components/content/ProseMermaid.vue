<!-- File: components/content/ProseMermaid.vue -->
<!-- 严格遵循客户端边界原则的 Mermaid 组件 -->
<template>
  <!-- ✅ 使用 ClientOnly 确保只在客户端渲染 -->
  <ClientOnly>
    <div class="mermaid-wrapper my-8">
      <!-- 图表容器 -->
      <div 
        ref="mermaidContainer" 
        class="mermaid-container bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 overflow-x-auto"
        :class="{ 'opacity-0': !isRendered }"
      >
        <!-- 这里将被 mermaid 替换 -->
        <div class="mermaid-content text-center">
          <pre class="mermaid">{{ content }}</pre>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-if="hasError" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
          <span class="text-sm text-red-700 dark:text-red-300">图表渲染失败</span>
        </div>
        <details class="mt-2">
          <summary class="text-xs text-red-600 dark:text-red-400 cursor-pointer">查看详情</summary>
          <pre class="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-2 rounded overflow-x-auto">{{ errorMessage }}</pre>
        </details>
        <!-- 显示原始代码作为降级 -->
        <div class="mt-3 text-xs text-gray-600 dark:text-gray-400">
          <div class="font-medium mb-1">原始代码：</div>
          <pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">{{ content }}</pre>
        </div>
      </div>
    </div>

    <!-- ✅ 加载状态的 Fallback -->
    <template #fallback>
      <div class="mermaid-wrapper my-8">
        <div class="mermaid-skeleton bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="animate-pulse space-y-4">
            <div class="flex items-center justify-center h-48">
              <div class="text-center space-y-2">
                <div class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto animate-spin"></div>
                <div class="text-sm text-gray-500 dark:text-gray-400">正在加载图表...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
interface Props {
  content: string
  id?: string
  config?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  id: () => `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  config: () => ({})
})

// ❌ 避免：在顶层导入 mermaid
// ✅ 方案：在 onMounted 中动态导入

// 响应式状态
const mermaidContainer = ref<HTMLElement>()
const isRendered = ref(false)
const hasError = ref(false)
const errorMessage = ref('')

// 颜色模式检测
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// ✅ 严格在客户端环境中初始化
onMounted(async () => {
  // 确保在客户端环境
  if (!process.client) return

  try {
    await initializeMermaid()
  } catch (error) {
    console.error('Mermaid 初始化失败:', error)
    handleError(error)
  }
})

// 监听主题变化，重新渲染
watch(isDark, async () => {
  if (process.client && isRendered.value) {
    await renderMermaid()
  }
})

// ✅ Mermaid 初始化函数
const initializeMermaid = async () => {
  try {
    // 🎯 动态导入 mermaid，避免 SSR 问题
    const mermaid = (await import('mermaid')).default

    // 根据主题配置 mermaid
    const theme = isDark.value ? 'dark' : 'default'
    
    const mermaidConfig = {
      startOnLoad: false,
      theme: theme,
      securityLevel: 'loose',
      fontSize: 16,
      darkMode: isDark.value,
      // 自定义主题配置
      themeVariables: isDark.value ? {
        primaryColor: '#6366f1',
        primaryTextColor: '#f9fafb',
        primaryBorderColor: '#4f46e5',
        lineColor: '#9ca3af',
        secondaryColor: '#374151',
        tertiaryColor: '#1f2937',
        background: '#111827',
        mainBkg: '#1f2937',
        secondBkg: '#374151',
      } : {
        primaryColor: '#6366f1',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#4f46e5',
        lineColor: '#6b7280',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#f9fafb',
      },
      // 合并用户配置
      ...props.config
    }

    // 初始化 mermaid
    mermaid.initialize(mermaidConfig)

    // 渲染图表
    await renderMermaid(mermaid)

  } catch (error) {
    console.error('Mermaid 导入或初始化失败:', error)
    handleError(error)
  }
}

// ✅ 渲染 Mermaid 图表
const renderMermaid = async (mermaidInstance?: any) => {
  if (!process.client || !mermaidContainer.value) return

  try {
    // 获取 mermaid 实例
    let mermaid = mermaidInstance
    if (!mermaid) {
      mermaid = (await import('mermaid')).default
    }

    // 清除之前的内容
    const container = mermaidContainer.value
    const contentElement = container.querySelector('.mermaid-content')
    if (contentElement) {
      contentElement.innerHTML = `<pre class="mermaid">${props.content}</pre>`
    }

    // 渲染图表
    await mermaid.run({
      nodes: container.querySelectorAll('.mermaid')
    })

    // 标记为已渲染
    isRendered.value = true
    hasError.value = false

    // 添加响应式处理
    addResponsiveHandling()

  } catch (error) {
    console.error('Mermaid 渲染失败:', error)
    handleError(error)
  }
}

// ✅ 响应式处理
const addResponsiveHandling = () => {
  if (!process.client || !mermaidContainer.value) return

  const container = mermaidContainer.value
  const svgElement = container.querySelector('svg')
  
  if (svgElement) {
    // 确保 SVG 是响应式的
    svgElement.style.maxWidth = '100%'
    svgElement.style.height = 'auto'
    
    // 为小屏幕添加水平滚动
    const handleResize = () => {
      if (window.innerWidth < 768 && svgElement.scrollWidth > container.clientWidth) {
        container.style.overflowX = 'auto'
      } else {
        container.style.overflowX = 'visible'
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // 清理函数
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })
  }
}

// ✅ 错误处理
const handleError = (error: any) => {
  hasError.value = true
  errorMessage.value = error.message || String(error)
  isRendered.value = false
}

// 监听内容变化，重新渲染
watch(() => props.content, async () => {
  if (process.client && isRendered.value) {
    isRendered.value = false
    await renderMermaid()
  }
})
</script>

<style scoped>
.mermaid-wrapper {
  @apply relative;
}

.mermaid-container {
  @apply transition-opacity duration-300;
  min-height: 200px;
}

.mermaid-skeleton {
  min-height: 200px;
}

/* 确保 Mermaid SVG 的响应式 */
.mermaid-container :deep(svg) {
  max-width: 100%;
  height: auto;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .mermaid-container {
    @apply p-4;
  }
  
  .mermaid-container :deep(svg) {
    font-size: 14px;
  }
}

/* 深色模式优化 */
.dark .mermaid-container :deep(.node rect) {
  fill: #374151 !important;
  stroke: #6b7280 !important;
}

.dark .mermaid-container :deep(.node .label) {
  color: #f9fafb !important;
}

.dark .mermaid-container :deep(.edgePath .path) {
  stroke: #9ca3af !important;
}

.dark .mermaid-container :deep(.arrowheadPath) {
  fill: #9ca3af !important;
}

/* 高对比度支持 */
@media (prefers-contrast: high) {
  .mermaid-container {
    @apply border-2;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .mermaid-container {
    @apply transition-none;
  }
}
</style>