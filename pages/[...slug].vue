<!-- pages/[...slug].vue -->
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
      <!-- 文章头部 -->
      <header class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ doc.title }}
          </h1>
        </div>

        <!-- 文章元信息 -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <!-- 难度标记 -->
          <span
            v-if="doc.difficulty"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="{
              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': doc.difficulty === 'beginner',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': doc.difficulty === 'intermediate',
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': doc.difficulty === 'advanced'
            }"
          >
            {{ difficultyLabels[doc.difficulty] }}
          </span>

          <!-- 阅读时间 -->
          <span v-if="doc.readingTime" class="flex items-center">
            <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
            {{ doc.readingTime }}
          </span>

          <!-- 发布日期 -->
          <span v-if="doc.createdAt" class="flex items-center">
            <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1" />
            {{ formatDate(doc.createdAt) }}
          </span>
        </div>

        <!-- 文章描述 -->
        <p v-if="doc.description" class="mt-4 text-lg text-gray-700 dark:text-gray-300">
          {{ doc.description }}
        </p>
      </header>

      <!-- 文章内容 -->
      <article class="prose prose-gray max-w-none dark:prose-invert prose-headings:scroll-mt-24">
        <ContentRenderer :value="doc" />
      </article>

      <!-- 文章底部 -->
      <footer class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <!-- 标签 -->
        <div v-if="doc.tags && doc.tags.length" class="mb-6">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">标签</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in doc.tags"
              :key="tag"
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 导航 -->
        <ContentNavigation v-slot="{ prev, next }">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuxtLink
              v-if="prev"
              :to="prev._path"
              class="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
            >
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
                上一篇
              </div>
              <div class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {{ prev.title }}
              </div>
            </NuxtLink>

            <NuxtLink
              v-if="next"
              :to="next._path"
              class="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 transition-colors text-right"
            >
              <div class="flex items-center justify-end gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                下一篇
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
              </div>
              <div class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {{ next.title }}
              </div>
            </NuxtLink>
          </div>
        </ContentNavigation>

        <!-- 相关推荐 -->
        <div v-if="doc.related && doc.related.length" class="mt-8">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">相关推荐</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContentList :query="{ where: { _path: { $in: doc.related } } }" v-slot="{ list }">
              <NuxtLink
                v-for="item in list"
                :key="item._path"
                :to="item._path"
                class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <h4 class="font-medium text-gray-900 dark:text-white mb-1">
                  {{ item.title }}
                </h4>
                <p v-if="item.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {{ item.description }}
                </p>
              </NuxtLink>
            </ContentList>
          </div>
        </div>
      </footer>
    </ContentDoc>

    <!-- 默认状态（如果没有找到内容但也没有错误） -->
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

// 格式化日期
const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 调试信息
if (process.dev) {
  watchEffect(() => {
    console.log('=== Page Debug ===')
    console.log('Route path:', route.path)
    console.log('Data:', data.value)
    console.log('Pending:', pending.value)
    console.log('Error:', error.value)
  })
}
</script>