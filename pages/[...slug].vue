<!-- File: pages/[...slug].vue -->
<!-- 修复版本：解决 onUnmounted 错误 -->

<script setup lang="ts">
const route = useRoute()

// 从 route.params.slug 构建查询路径
const path = '/' + (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug)

// 数据获取 - 保持服务端安全
const { data, pending, error } = await useAsyncData(`content-${path}`, async () => {
  try {
    const content = await queryContent(path).findOne()
    
    if (!content) {
      return null
    }
    
    // 创建完全可序列化的纯对象
    const safeContent = {
      title: content.title ? String(content.title) : '',
      description: content.description ? String(content.description) : '',
      _path: content._path ? String(content._path) : '',
      body: content.body || null,
      difficulty: content.difficulty ? String(content.difficulty) : undefined,
      readingTime: content.readingTime ? String(content.readingTime) : undefined,
      tags: Array.isArray(content.tags) ? content.tags.map(tag => String(tag)) : [],
      createdAt: content.createdAt ? new Date(content.createdAt).toISOString() : undefined,
      updatedAt: content.updatedAt ? new Date(content.updatedAt).toISOString() : undefined,
    }
    
    return safeContent
  } catch (err) {
    console.error('加载内容失败:', err)
    return null
  }
}, {
  server: true,
  default: () => null,
  transform: (data) => {
    if (!data) return data
    return JSON.parse(JSON.stringify(data))
  }
})

// 设置页面元数据
useHead({
  title: () => data.value?.title || '页面未找到',
  meta: () => [
    { name: 'description', content: data.value?.description || '页面内容不可用' }
  ]
})

// 难度标签映射
const difficultyLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

// 面包屑导航 - 简化版本
const breadcrumbs = computed(() => {
  if (!data.value?._path) return []
  
  const segments = data.value._path.split('/').filter(Boolean)
  return segments.map((segment, index) => ({
    title: segment.replace(/[-_]/g, ' ').replace(/^\d+\./, '').trim(),
    path: '/' + segments.slice(0, index + 1).join('/'),
    isCurrent: index === segments.length - 1
  }))
})

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return ''
  }
}

// ✅ 修复：将 onUnmounted 移出异步回调
let cleanupFunction: (() => void) | null = null

// ✅ 客户端增强功能 - 修复生命周期问题
onMounted(async () => {
  // 确保在客户端环境
  if (!process.client) return

  try {
    // 动态导入客户端专用的 composable
    const { useKaTeXEnhancements } = await import('~/composables/useKaTeXEnhancements')
    
    // 延迟初始化，确保内容已完全渲染
    setTimeout(async () => {
      const { initializeEnhancements } = useKaTeXEnhancements()
      const enhancements = initializeEnhancements()
      
      if (enhancements) {
        // 运行所有增强功能
        const cleanup = enhancements.runEnhancements()
        
        // 保存清理函数
        cleanupFunction = cleanup
        
        // 监听内容变化，重新应用增强
        const observer = new MutationObserver(() => {
          if (enhancements) {
            enhancements.detectOverflow()
            enhancements.addCopyButtons()
          }
        })
        
        const articleContent = document.getElementById('article-content')
        if (articleContent) {
          observer.observe(articleContent, {
            childList: true,
            subtree: true
          })
        }
        
        // 将 observer 也添加到清理函数中
        const originalCleanup = cleanupFunction
        cleanupFunction = () => {
          if (originalCleanup) originalCleanup()
          observer.disconnect()
        }
      }
    }, 300)
  } catch (error) {
    console.error('加载 KaTeX 增强功能失败:', error)
  }
})

// ✅ 修复：正确放置 onUnmounted
onUnmounted(() => {
  if (cleanupFunction) {
    cleanupFunction()
    cleanupFunction = null
  }
})

// 简化的分享和收藏功能
const shareArticle = async () => {
  if (!process.client || !data.value) return
  
  const url = window.location.href
  const title = data.value.title
  const text = data.value.description
  
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
    } catch {
      await copyToClipboard(url)
    }
  } else {
    await copyToClipboard(url)
  }
}

const copyToClipboard = async (text: string) => {
  if (!process.client) return
  
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

const bookmarkArticle = () => {
  console.log('收藏文章:', data.value?.title)
}
</script>

<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="pending" class="flex items-center justify-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span class="ml-3 text-gray-600 dark:text-gray-400">正在加载...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error || !data" class="text-center py-16">
      <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-heroicons-exclamation-triangle-solid" class="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">页面未找到</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">抱歉，您访问的页面不存在或已被移动。</p>
      <NuxtLink
        to="/"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        返回首页
      </NuxtLink>
    </div>

    <!-- 内容展示 -->
    <div v-else class="max-w-4xl mx-auto">
      <!-- 文章头部 -->
      <header class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
        <!-- 面包屑导航 -->
        <nav v-if="breadcrumbs.length > 0" class="flex items-center flex-wrap gap-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <NuxtLink to="/" class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            首页
          </NuxtLink>
          <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
            <UIcon name="i-heroicons-chevron-right-solid" class="w-3 h-3" />
            <NuxtLink
              v-if="!crumb.isCurrent"
              :to="crumb.path"
              class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {{ crumb.title }}
            </NuxtLink>
            <span v-else class="text-gray-900 dark:text-white font-medium">
              {{ data.title }}
            </span>
          </template>
        </nav>

        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {{ data.title }}
            </h1>
            <div v-if="data.description" class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ data.description }}
            </div>
          </div>
          
          <!-- 客户端功能包装 -->
          <ClientOnly>
            <div class="flex items-center space-x-2 ml-6">
              <UButton 
                icon="i-heroicons-share-solid" 
                color="gray" 
                variant="outline" 
                size="sm" 
                aria-label="分享" 
                @click="shareArticle" 
              />
              <UButton 
                icon="i-heroicons-bookmark-solid" 
                color="gray" 
                variant="outline" 
                size="sm" 
                aria-label="收藏" 
                @click="bookmarkArticle" 
              />
            </div>
          </ClientOnly>
        </div>

        <!-- 文章元信息 -->
        <div v-if="data.difficulty || data.readingTime || data.tags?.length" class="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span v-if="data.difficulty" class="flex items-center gap-1">
            <UIcon name="i-heroicons-academic-cap" class="w-4 h-4" />
            {{ difficultyLabels[data.difficulty] }}
          </span>
          <span v-if="data.readingTime" class="flex items-center gap-1">
            <UIcon name="i-heroicons-clock" class="w-4 h-4" />
            {{ data.readingTime }}
          </span>
          <div v-if="data.tags?.length" class="flex items-center gap-2">
            <UIcon name="i-heroicons-tag" class="w-4 h-4" />
            <div class="flex gap-1">
              <span v-for="tag in data.tags" :key="tag" class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- 文章内容 -->
      <article 
        id="article-content"
        class="prose prose-gray max-w-none dark:prose-invert math-content"
      >
        <!-- 使用 ContentRenderer 渲染内容 -->
        <ContentRenderer v-if="data" :value="data" />
      </article>

      <!-- 文章底部导航 -->
      <footer class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <ContentNavigation v-slot="{ prev, next }">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuxtLink 
              v-if="prev" 
              :to="prev._path" 
              class="group block p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
            >
              <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <UIcon name="i-heroicons-arrow-left-solid" class="w-4 h-4" />
                上一篇
              </div>
              <div class="font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                {{ prev.title }}
              </div>
            </NuxtLink>
            <div v-else class="block p-6 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center text-gray-400">
              没有上一篇了
            </div>
            
            <NuxtLink 
              v-if="next" 
              :to="next._path" 
              class="group block p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 text-right"
            >
              <div class="flex items-center justify-end gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                下一篇
                <UIcon name="i-heroicons-arrow-right-solid" class="w-4 h-4" />
              </div>
              <div class="font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                {{ next.title }}
              </div>
            </NuxtLink>
            <div v-else class="block p-6 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center text-gray-400">
              已是最后一篇
            </div>
          </div>
        </ContentNavigation>
      </footer>
    </div>
  </div>
</template>

<style>
/* 基础 prose 样式 */
.prose {
  line-height: 1.7;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  @apply font-semibold scroll-mt-24;
}

.prose h1 { @apply text-3xl; }
.prose h2 { @apply text-2xl; }
.prose h3 { @apply text-xl; }
.prose h4 { @apply text-lg; }

.prose p { 
  @apply text-gray-700 dark:text-gray-300; 
}

.prose a { 
  @apply text-primary-600 dark:text-primary-400 no-underline hover:underline; 
}

.prose code { 
  @apply text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-1 py-0.5 rounded-md text-sm; 
}

.prose pre { 
  @apply bg-gray-900 border border-gray-700 rounded-lg p-4; 
}

.prose pre code { 
  @apply bg-transparent p-0 text-gray-100; 
}

/* 数学内容容器 */
.math-content {
  @apply relative;
}

/* KaTeX 样式 */
.prose .katex-display {
  @apply my-6 text-center overflow-x-auto relative;
}

.prose .katex {
  @apply font-normal;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .prose .katex-display {
    font-size: 0.9em;
  }
  
  .prose .katex {
    font-size: 0.85em;
  }
}
</style>