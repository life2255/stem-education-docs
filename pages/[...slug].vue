<template>
  <div>
    <ContentDoc v-slot="{ doc }">
      <!-- 页面标题区域 -->
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ doc.title }}
        </h1>

        <!-- 元信息 -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <!-- 难度标记 -->
          <span
            v-if="doc.difficulty"
            class="px-3 py-1 rounded-full"
            :class="{
              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': doc.difficulty === 'beginner',
              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': doc.difficulty === 'intermediate',
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': doc.difficulty === 'advanced'
            }"
          >
            {{ difficultyLabels[doc.difficulty] }}
          </span>

          <!-- 阅读时间 -->
          <span v-if="doc.readingTime" class="flex items-center gap-1">
            <UIcon name="i-heroicons-clock" class="w-4 h-4" />
            {{ doc.readingTime }}
          </span>

          <!-- 更新时间 -->
          <span v-if="doc.updatedAt" class="flex items-center gap-1">
            <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
            更新于 {{ formatDate(doc.updatedAt) }}
          </span>
        </div>

        <!-- 描述 -->
        <p v-if="doc.description" class="mt-4 text-lg text-gray-600 dark:text-gray-300">
          {{ doc.description }}
        </p>
      </header>

      <!-- 文章内容 -->
      <article class="stem-prose">
        <ContentRenderer :value="doc" />
      </article>

      <!-- 相关内容 -->
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
  </div>
</template>

<script setup lang="ts">
// 设置页面元数据
const { page } = useContent()

useHead({
  title: page.value?.title,
  meta: [
    { name: 'description', content: page.value?.description }
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
</script>