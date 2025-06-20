// File: pages/[...slug].vue 
// 保持原有结构，让插件自动处理数学公式

<script setup lang="ts">
const route = useRoute()

// 从 route.params.slug 构建查询路径
const path = '/' + (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug)

// 获取页面内容
const { data, pending, error } = await useAsyncData(`content-${path}`, () => {
  return queryContent(path).findOne()
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

// 获取难度对应的图标
const getDifficultyIcon = (difficulty: string): string => {
  const icons = {
    beginner: 'i-heroicons-academic-cap-solid',
    intermediate: 'i-heroicons-fire-solid',
    advanced: 'i-heroicons-bolt-solid'
  }
  return icons[difficulty as keyof typeof icons] || 'i-heroicons-academic-cap-solid'
}

// 面包屑导航
const breadcrumbs = computed(() => {
  if (!data.value || !data.value._path) {
    return []
  }
  const pathSegments = data.value._path.split('/').filter(Boolean)
  let currentPath = ''
  return pathSegments.map((segment, index) => {
    currentPath += `/${segment}`
    const title = data.value._dir?.title || segment
    return {
      title: title,
      path: currentPath,
      isCurrent: index === pathSegments.length - 1
    }
  })
})

// 格式化日期
const formatDate = (date: string | Date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 分享文章
const shareArticle = async () => {
  if (navigator.share && data.value) {
    try {
      await navigator.share({
        title: data.value.title,
        text: data.value.description,
        url: window.location.href
      })
    } catch (err) {
      await copyToClipboard()
    }
  } else {
    await copyToClipboard()
  }
}

// 复制链接到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    console.log('链接已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 收藏文章
const bookmarkArticle = () => {
  console.log('收藏文章')
}

// 文章内容引用
const articleContent = ref<HTMLElement>()

// 确保标题有ID
onMounted(() => {
  if (error.value) return
  nextTick(() => {
    if (articleContent.value) {
      const headings = articleContent.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
      headings.forEach((heading, index) => {
        if (!heading.id) {
          const text = heading.textContent || ''
          const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim()
          heading.id = id || `heading-${index}`
        }
      })
    }
  })
})
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
    <ContentDoc v-else v-slot="{ doc }">
      <div class="max-w-4xl mx-auto">
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
                {{ doc.title }}
              </span>
            </template>
          </nav>

          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {{ doc.title }}
              </h1>
              <div v-if="doc.description" class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ doc.description }}
              </div>
            </div>
            <div class="flex items-center space-x-2 ml-6">
              <UButton icon="i-heroicons-share-solid" color="gray" variant="outline" size="sm" aria-label="分享" @click="shareArticle" />
              <UButton icon="i-heroicons-bookmark-solid" color="gray" variant="outline" size="sm" aria-label="收藏" @click="bookmarkArticle" />
            </div>
          </div>
        </header>

        <!-- 文章内容 - 保持原有的 ContentRenderer -->
        <article 
          id="article-content"
          class="prose prose-gray max-w-none dark:prose-invert"
          ref="articleContent"
        >
          <ContentRenderer :value="doc" />
        </article>

        <!-- 文章底部 -->
        <footer class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-8">
          <!-- 导航 -->
          <ContentNavigation v-slot="{ prev, next }" class="pt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NuxtLink v-if="prev" :to="prev._path" class="group block p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200">
                <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <UIcon name="i-heroicons-arrow-left-solid" class="w-4 h-4" />
                  上一篇
                </div>
                <div class="font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {{ prev.title }}
                </div>
              </NuxtLink>
              <span v-else class="block p-6 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center text-gray-400">没有上一篇了</span>
              <NuxtLink v-if="next" :to="next._path" class="group block p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 text-right">
                <div class="flex items-center justify-end gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  下一篇
                  <UIcon name="i-heroicons-arrow-right-solid" class="w-4 h-4" />
                </div>
                <div class="font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {{ next.title }}
                </div>
              </NuxtLink>
              <span v-else class="block p-6 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center text-gray-400">已是最后一篇</span>
            </div>
          </ContentNavigation>
        </footer>
      </div>
    </ContentDoc>
  </div>
</template>

<style>
/* Basic prose styling */
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
.prose p { @apply text-gray-700 dark:text-gray-300; }
.prose a { @apply text-primary-600 dark:text-primary-400 no-underline hover:underline; }
.prose code { @apply text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-1 py-0.5 rounded-md text-sm; }
.prose pre { @apply bg-gray-900 border border-gray-700 rounded-lg p-4; }
.prose pre code { @apply bg-transparent p-0 text-gray-100; }

/* MathJax 样式 */
.prose :deep(mjx-container) {
  margin: 0.5rem 0;
}

.prose :deep(mjx-container[display="true"]) {
  margin: 1.5rem auto !important;
  text-align: center !important;
}
</style>