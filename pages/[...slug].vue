<!-- File: pages/[...slug].vue -->
<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="pending" class="flex items-center justify-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span class="ml-3 text-gray-600 dark:text-gray-400">正在加载...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-16">
      <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-600 dark:text-red-400" />
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
    <ContentDoc v-else-if="data" v-slot="{ doc }">
      <div class="max-w-4xl mx-auto">
        <!-- 文章头部 -->
        <header class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <!-- 面包屑导航 -->
          <nav class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <NuxtLink to="/" class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              首页
            </NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-3 h-3" />
            <NuxtLink 
              v-if="breadcrumbs.subject" 
              :to="breadcrumbs.subject.path" 
              class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {{ breadcrumbs.subject.title }}
            </NuxtLink>
            <template v-if="breadcrumbs.category">
              <UIcon name="i-heroicons-chevron-right" class="w-3 h-3" />
              <NuxtLink 
                :to="breadcrumbs.category.path" 
                class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {{ breadcrumbs.category.title }}
              </NuxtLink>
            </template>
            <UIcon name="i-heroicons-chevron-right" class="w-3 h-3" />
            <span class="text-gray-900 dark:text-white font-medium">{{ doc.title }}</span>
          </nav>

          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {{ doc.title }}
              </h1>

              <!-- 文章元信息 -->
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <!-- 难度标记 -->
                <div
                  v-if="doc.difficulty"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': doc.difficulty === 'beginner',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': doc.difficulty === 'intermediate',
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': doc.difficulty === 'advanced'
                  }"
                >
                  <UIcon 
                    :name="getDifficultyIcon(doc.difficulty)" 
                    class="w-3 h-3 mr-1"
                  />
                  {{ difficultyLabels[doc.difficulty] }}
                </div>

                <!-- 阅读时间 -->
                <div v-if="doc.readingTime" class="flex items-center">
                  <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
                  {{ doc.readingTime }}
                </div>

                <!-- 发布日期 -->
                <div v-if="doc.createdAt" class="flex items-center">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1" />
                  {{ formatDate(doc.createdAt) }}
                </div>

                <!-- 最后更新 -->
                <div v-if="doc.updatedAt && doc.updatedAt !== doc.createdAt" class="flex items-center">
                  <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-1" />
                  更新于 {{ formatDate(doc.updatedAt) }}
                </div>
              </div>

              <!-- 文章描述 -->
              <p v-if="doc.description" class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ doc.description }}
              </p>
            </div>

            <!-- 文章操作按钮 -->
            <div class="flex items-center space-x-2 ml-6">
              <UButton
                icon="i-heroicons-share"
                color="gray"
                variant="outline"
                size="sm"
                aria-label="分享"
                @click="shareArticle"
              />
              <UButton
                icon="i-heroicons-bookmark"
                color="gray"
                variant="outline"
                size="sm"
                aria-label="收藏"
                @click="bookmarkArticle"
              />
            </div>
          </div>
        </header>

        <!-- 文章内容 -->
        <article 
          id="article-content"
          class="prose prose-gray max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700"
          ref="articleContent"
        >
          <ContentRenderer :value="doc" />
        </article>

        <!-- 文章底部 -->
        <footer class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-8">
          <!-- 标签 -->
          <div v-if="doc.tags && doc.tags.length" class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <UIcon name="i-heroicons-tag" class="w-5 h-5 mr-2 text-gray-500" />
              标签
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in doc.tags"
                :key="tag"
                class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors cursor-pointer"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- 相关推荐 -->
          <div v-if="doc.related && doc.related.length" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 mr-2 text-gray-500" />
              相关推荐
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ContentList :query="{ where: { _path: { $in: doc.related } } }" v-slot="{ list }">
                <NuxtLink
                  v-for="item in list"
                  :key="item._path"
                  :to="item._path"
                  class="group p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-primary-50 dark:hover:from-primary-900/20 hover:to-primary-100 dark:hover:to-primary-800/20 border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200"
                >
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                    {{ item.title }}
                  </h4>
                  <p v-if="item.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {{ item.description }}
                  </p>
                </NuxtLink>
              </ContentList>
            </div>
          </div>

          <!-- 导航 -->
          <ContentNavigation v-slot="{ prev, next }" class="pt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NuxtLink
                v-if="prev"
                :to="prev._path"
                class="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
              >
                <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
                  上一篇
                </div>
                <div class="font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {{ prev.title }}
                </div>
              </NuxtLink>

              <NuxtLink
                v-if="next"
                :to="next._path"
                class="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 text-right md:text-right"
              >
                <div class="flex items-center justify-end gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  下一篇
                  <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
                </div>
                <div class="font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {{ next.title }}
                </div>
              </NuxtLink>
            </div>
          </ContentNavigation>
        </footer>
      </div>
    </ContentDoc>

    <!-- 默认状态 -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-gray-400" />
      </div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">内容不可用</h1>
      <p class="text-gray-600 dark:text-gray-400">请稍后再试或联系管理员。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getSubjectById, getCategoryById } = useNavigation()

// 获取页面内容
const { data, pending, error } = await useAsyncData(`content-${route.path}`, () => {
  return queryContent(route.path).findOne()
})

// 设置页面元数据
useHead({
  title: data.value?.title || '页面未找到',
  meta: [
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
    beginner: 'i-heroicons-academic-cap',
    intermediate: 'i-heroicons-fire',
    advanced: 'i-heroicons-bolt'
  }
  return icons[difficulty as keyof typeof icons] || 'i-heroicons-academic-cap'
}

// 计算面包屑导航
const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const result: any = {}

  if (pathSegments.length >= 1) {
    const subjectId = pathSegments[0]
    const subject = getSubjectById(subjectId)
    if (subject) {
      result.subject = {
        title: subject.title,
        path: `/${subjectId}`
      }
    }
  }

  if (pathSegments.length >= 2) {
    const subjectId = pathSegments[0]
    const categoryId = pathSegments[1]
    const category = getCategoryById(subjectId, categoryId)
    if (category) {
      result.category = {
        title: category.title,
        path: `/${subjectId}/${categoryId}`
      }
    }
  }

  return result
})

// 格式化日期
const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
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
      // 复制到剪贴板作为备选
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
    // 这里可以显示一个提示消息
    console.log('链接已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 收藏文章
const bookmarkArticle = () => {
  // 这里可以实现收藏功能
  console.log('收藏文章')
}

// 文章内容引用
const articleContent = ref<HTMLElement>()

// 确保标题有ID（用于TOC）
onMounted(() => {
  nextTick(() => {
    if (articleContent.value) {
      const headings = articleContent.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
      headings.forEach((heading, index) => {
        if (!heading.id) {
          // 生成ID：基于文本内容
          const text = heading.textContent || ''
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // 移除特殊字符
            .replace(/\s+/g, '-') // 空格替换为连字符
            .trim()
          heading.id = id || `heading-${index}`
        }
      })
    }
  })
})

// 调试信息
if (process.dev) {
  watchEffect(() => {
    console.log('=== Page Debug ===')
    console.log('Route path:', route.path)
    console.log('Data:', data.value)
    console.log('Pending:', pending.value)
    console.log('Error:', error.value)
    console.log('Breadcrumbs:', breadcrumbs.value)
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 优化代码块样式 */
.prose pre {
  @apply bg-gray-900 border border-gray-700 rounded-lg;
}

.prose code {
  @apply text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-1 py-0.5 rounded text-sm;
}

.prose pre code {
  @apply text-gray-100 bg-transparent p-0;
}

/* 优化链接样式 */
.prose a {
  @apply text-primary-600 dark:text-primary-400 font-medium;
}

.prose a:hover {
  @apply text-primary-700 dark:text-primary-300 underline;
}

/* 优化表格样式 */
.prose table {
  @apply border-collapse border border-gray-300 dark:border-gray-600;
}

.prose th,
.prose td {
  @apply border border-gray-300 dark:border-gray-600 px-4 py-2;
}

.prose th {
  @apply bg-gray-50 dark:bg-gray-800 font-semibold;
}
</style>