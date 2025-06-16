<!-- components/AppSidebar.vue -->
<template>
  <div class="space-y-6">
    <!-- 当前位置标题 -->
    <div v-if="currentCategory" class="pb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2 mb-2">
        <UIcon :name="currentCategory.icon || 'i-heroicons-folder'" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ currentCategory.title }}
        </h2>
      </div>
      <p v-if="currentCategory.description" class="text-sm text-gray-600 dark:text-gray-400">
        {{ currentCategory.description }}
      </p>
    </div>

    <!-- 学科首页情况 -->
    <div v-else-if="isSubjectHomepage" class="pb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2 mb-2">
        <UIcon :name="currentSubject?.icon || 'i-heroicons-academic-cap'" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ currentSubject?.title || '学科概述' }}
        </h2>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        浏览该学科的所有分类内容
      </p>
    </div>

    <!-- 加载状态 -->
    <div v-if="pending" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      <span class="ml-3 text-sm text-gray-600 dark:text-gray-400">加载中...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-8">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-yellow-500 mx-auto mb-2" />
      <p class="text-sm text-gray-600 dark:text-gray-400">加载失败</p>
    </div>

    <!-- 侧边栏导航 -->
    <nav v-else-if="navigation && navigation.length > 0" class="space-y-1">
      <div v-for="item in navigation" :key="item._path">
        <!-- 文章链接 -->
        <NuxtLink
          :to="item._path"
          :class="[
            'group flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
            route.path === item._path
              ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <div class="flex items-center space-x-3 min-w-0 flex-1">
            <UIcon :name="item.icon || 'i-heroicons-document-text'" class="w-4 h-4 flex-shrink-0" />
            <span class="truncate">{{ item.title }}</span>
          </div>

          <!-- 难度标记 -->
          <div v-if="item.difficulty" class="flex-shrink-0 ml-2">
            <span
              :class="[
                'inline-block w-2 h-2 rounded-full',
                item.difficulty === 'beginner' ? 'bg-green-400' :
                item.difficulty === 'intermediate' ? 'bg-yellow-400' :
                'bg-red-400'
              ]"
              :title="difficultyLabels[item.difficulty]"
            />
          </div>
        </NuxtLink>
      </div>
    </nav>

    <!-- 学科首页的分类导航 -->
    <nav v-else-if="isSubjectHomepage && currentSubject?.categories?.length" class="space-y-1">
      <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
        分类导航
      </div>
      <div v-for="category in currentSubject.categories" :key="category.id">
        <NuxtLink
          :to="category.path"
          :class="[
            'group flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <UIcon :name="category.icon || 'i-heroicons-folder'" class="w-4 h-4 flex-shrink-0" />
          <span class="truncate">{{ category.title }}</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 text-sm">暂无相关内容</p>
      <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">请选择其他分类或稍后再试</p>
    </div>

    <!-- 分类统计信息卡片 -->
    <div v-if="navigation && navigation.length > 0" class="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">分类统计</h4>
      <div class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
        <div class="flex justify-between items-center">
          <span>文章数量</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ navigation.length }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span>难度分布</span>
          <div class="flex space-x-1">
            <span
              v-if="difficultyStats.beginner > 0"
              class="inline-flex items-center justify-center w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full"
              :title="`初级: ${difficultyStats.beginner}篇`"
            >
              {{ difficultyStats.beginner }}
            </span>
            <span
              v-if="difficultyStats.intermediate > 0"
              class="inline-flex items-center justify-center w-5 h-5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full"
              :title="`中级: ${difficultyStats.intermediate}篇`"
            >
              {{ difficultyStats.intermediate }}
            </span>
            <span
              v-if="difficultyStats.advanced > 0"
              class="inline-flex items-center justify-center w-5 h-5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full"
              :title="`高级: ${difficultyStats.advanced}篇`"
            >
              {{ difficultyStats.advanced }}
            </span>
          </div>
        </div>
        <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
          <div class="flex justify-between items-center">
            <span>上次更新</span>
            <span class="font-medium text-gray-900 dark:text-white">最近</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 学科分类信息卡片 -->
    <div v-if="isSubjectHomepage && currentSubject?.categories?.length" class="mt-8 p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl border border-primary-200 dark:border-primary-700">
      <h4 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3 flex items-center">
        <UIcon name="i-heroicons-folder-open" class="w-4 h-4 mr-2" />
        学科概览
      </h4>
      <div class="space-y-2 text-xs text-primary-700 dark:text-primary-300">
        <div class="flex justify-between items-center">
          <span>总分类数</span>
          <span class="font-medium">{{ currentSubject.categories.length }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span>学习路径</span>
          <span class="font-medium">{{ currentSubject.categories.length > 0 ? '已规划' : '待完善' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getCategoryNavigation, getSubjects } = useNavigation()

// 获取学科数据
const { data: subjects } = await useAsyncData('sidebar-subjects', getSubjects)

// 计算当前学科
const currentSubject = computed(() => {
  if (!subjects.value) return null
  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length === 0) return null
  const subjectId = pathSegments[0]
  return subjects.value.find(s => s.id === subjectId) || null
})

// 计算当前分类
const currentCategory = computed(() => {
  if (!currentSubject.value) return null
  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length < 2) return null
  const categoryId = pathSegments[1]
  return currentSubject.value.categories.find(c => c.id === categoryId) || null
})

// 判断是否为学科首页
const isSubjectHomepage = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  return pathSegments.length === 1 && currentSubject.value !== null
})

// 获取导航数据
const { data: navigation, pending, error } = await useAsyncData(
  `sidebar-navigation-${route.path}`,
  async () => {
    const pathSegments = route.path.split('/').filter(Boolean)

    // 如果是学科首页，不获取具体分类的导航
    if (pathSegments.length === 1) {
      return []
    }

    // 如果是分类页面，获取该分类的导航
    if (pathSegments.length >= 2) {
      const categoryPath = `/${pathSegments[0]}/${pathSegments[1]}`
      return await getCategoryNavigation(categoryPath)
    }

    return []
  },
  {
    watch: [() => route.path]
  }
)

// 难度标签映射
const difficultyLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

// 计算难度统计
const difficultyStats = computed(() => {
  if (!navigation.value) {
    return { beginner: 0, intermediate: 0, advanced: 0 }
  }

  return navigation.value.reduce((stats, item) => {
    if (item.difficulty) {
      stats[item.difficulty as keyof typeof stats]++
    }
    return stats
  }, { beginner: 0, intermediate: 0, advanced: 0 })
})

// 调试信息
if (process.dev) {
  watchEffect(() => {
    console.log('=== Sidebar Debug ===')
    console.log('Route path:', route.path)
    console.log('Current subject:', currentSubject.value)
    console.log('Current category:', currentCategory.value)
    console.log('Is subject homepage:', isSubjectHomepage.value)
    console.log('Navigation:', navigation.value)
    console.log('Difficulty stats:', difficultyStats.value)
  })
}
</script>