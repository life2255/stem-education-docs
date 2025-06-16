<template>
  <div>
    <!-- Hero 区域 -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div class="absolute inset-0 bg-grid-gray-100/50 dark:bg-grid-gray-700/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div class="relative stem-container py-24 text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          STEM 教育文档中心
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          系统化的科学、技术、工程和数学学习资源，为学生和教育工作者提供高质量的 STEM 教育内容
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton size="lg" to="/physics" icon="i-heroicons-academic-cap">
            开始学习
          </UButton>
          <UButton size="lg" color="gray" variant="outline" icon="i-heroicons-magnifying-glass" @click="openSearch">
            搜索文档
          </UButton>
        </div>
      </div>
    </section>

    <!-- 学科入口 -->
    <section class="stem-container py-16">
      <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        学科导航
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="subject in subjects"
          :key="subject.id"
          :to="`/${subject.id}`"
          class="stem-card p-6 text-center group hover:border-primary-500 dark:hover:border-primary-400 transition-all"
        >
          <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
               :class="subject.bgColor">
            <UIcon :name="subject.icon" class="w-8 h-8" :class="subject.iconColor" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ subject.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ subject.description }}
          </p>
          <span class="text-sm text-primary-600 dark:text-primary-400 group-hover:underline">
            进入学习 →
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- 特色功能 -->
    <section class="bg-gray-50 dark:bg-gray-800/50 py-16">
      <div class="stem-container">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          网站特色
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-book-open" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              结构化内容
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              清晰的知识体系，从基础到进阶，循序渐进的学习路径
            </p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-code-bracket" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              互动示例
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              支持代码高亮、数学公式、可视化图表等丰富的内容展示
            </p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-device-phone-mobile" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              响应式设计
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              完美适配各种设备，随时随地进行学习
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新内容 -->
    <section class="stem-container py-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
          最新内容
        </h2>
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-right" trailing>
          查看全部
        </UButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ContentList :query="recentQuery" v-slot="{ list }">
          <article
            v-for="article in list"
            :key="article._path"
            class="stem-card p-6"
          >
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span>{{ getSubjectName(article._path) }}</span>
              <span>·</span>
              <span>{{ formatDate(article.createdAt) }}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              <NuxtLink :to="article._path" class="hover:text-primary-600 dark:hover:text-primary-400">
                {{ article.title }}
              </NuxtLink>
            </h3>
            <p class="text-gray-600 dark:text-gray-400 line-clamp-2">
              {{ article.description }}
            </p>
            <div class="mt-4 flex items-center justify-between">
              <span
                v-if="article.difficulty"
                class="px-2 py-1 text-xs rounded-full"
                :class="{
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': article.difficulty === 'beginner',
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': article.difficulty === 'intermediate',
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': article.difficulty === 'advanced'
                }"
              >
                {{ difficultyLabels[article.difficulty] }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ article.readingTime || '5 分钟' }}
              </span>
            </div>
          </article>
        </ContentList>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 搜索组件
const isSearchOpen = ref(false)
const openSearch = () => {
  isSearchOpen.value = true
}

// 学科配置
const subjects = [
  {
    id: 'physics',
    name: '物理学',
    icon: 'i-heroicons-bolt',
    description: '探索物质运动规律和自然现象的本质',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'chemistry',
    name: '化学',
    icon: 'i-heroicons-beaker',
    description: '研究物质的组成、性质和变化规律',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    id: 'biology',
    name: '生物学',
    icon: 'i-heroicons-heart',
    description: '探索生命的奥秘和生物世界的多样性',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    id: 'mathematics',
    name: '数学',
    icon: 'i-heroicons-calculator',
    description: '逻辑推理和抽象思维的基础学科',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
]

// 难度标签
const difficultyLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

// 最新内容查询
const recentQuery = {
  path: '/',
  where: [{ _path: { $ne: '/index' } }],
  limit: 6,
  sort: [{ createdAt: -1 }]
}

// 获取学科名称
const getSubjectName = (path: string) => {
  const subject = path.split('/')[1]
  return subjects.find(s => s.id === subject)?.name || subject
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '最近更新'
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.bg-grid-gray-100 {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(0 0 0 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

.dark .bg-grid-gray-700 {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>