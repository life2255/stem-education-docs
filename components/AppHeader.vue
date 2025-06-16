<!-- components/AppHeader.vue -->
<template>
  <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
    <nav class="stem-container">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center space-x-3 px-2 py-1 -mx-2 -my-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <div class="w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">S</span>
          </div>
          <span class="text-lg font-semibold text-gray-900 dark:text-white">STEM Docs</span>
        </NuxtLink>

        <!-- 主导航菜单 -->
        <div v-if="subjects && subjects.length > 0" class="hidden md:flex items-center space-x-1">
          <div v-for="subject in subjects" :key="subject.id" class="relative">
            <NuxtLink
              :to="subject.path"
              @click="handleSubjectClick(subject.id)"
              :class="[
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
                activeSubject === subject.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <UIcon :name="subject.icon" class="w-4 h-4" />
              <span>{{ subject.title }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- 学科数据加载失败提示 -->
        <div v-else-if="!pending && !subjects" class="text-red-500 text-sm">
          学科数据加载失败
        </div>

        <!-- 加载中提示 -->
        <div v-else-if="pending" class="text-gray-500 text-sm">
          加载中...
        </div>

        <!-- 右侧工具栏 -->
        <div class="flex items-center space-x-2">
          <!-- 搜索按钮 -->
          <UButton
            icon="i-heroicons-magnifying-glass"
            color="gray"
            variant="ghost"
            size="sm"
            aria-label="搜索"
            @click="isSearchOpen = true"
          />

          <!-- 主题切换 -->
          <ClientOnly>
            <UButton
              :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
              color="gray"
              variant="ghost"
              size="sm"
              aria-label="切换主题"
              @click="toggleColorMode"
            />
            <template #fallback>
              <div class="w-8 h-8" />
            </template>
          </ClientOnly>

          <!-- 移动端菜单按钮 -->
          <UButton
            icon="i-heroicons-bars-3"
            color="gray"
            variant="ghost"
            size="sm"
            class="md:hidden"
            aria-label="菜单"
            @click="isMobileMenuOpen = true"
          />
        </div>
      </div>
    </nav>

    <!-- 固定的二级菜单栏 -->
    <div
      v-if="activeSubject && currentSubject && currentSubject.categories && currentSubject.categories.length > 0"
      class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="stem-container">
        <div class="flex items-center justify-between py-3">
          <!-- 分类导航 -->
          <div class="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
            <div class="flex items-center space-x-1 min-w-max">
              <!-- 学科首页链接 -->
              <NuxtLink
                :to="currentSubject.path"
                :class="[
                  'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
                  route.path === currentSubject.path
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                <UIcon :name="currentSubject.icon" class="w-4 h-4" />
                <span>概述</span>
              </NuxtLink>

              <!-- 分类链接 -->
              <NuxtLink
                v-for="category in currentSubject.categories"
                :key="category.id"
                :to="category.path"
                :class="[
                  'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
                  route.path.startsWith(category.path)
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                <span>{{ category.title }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- 学科信息指示器 -->
          <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <UIcon name="i-heroicons-folder" class="w-3 h-3" />
            <span>{{ currentSubject.categories.length }} 个分类</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索模态框 -->
    <AppSearch v-if="isSearchOpen" v-model="isSearchOpen" />

    <!-- 移动端菜单 -->
    <USlideover v-model="isMobileMenuOpen">
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">学科导航</h3>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            size="sm"
            @click="isMobileMenuOpen = false"
          />
        </div>
        <!-- 移动端菜单内容 -->
        <div class="space-y-2">
          <div v-for="subject in subjects" :key="subject.id">
            <NuxtLink
              :to="subject.path"
              @click="handleMobileSubjectClick(subject.id)"
              :class="[
                'flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full',
                activeSubject === subject.id ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : ''
              ]"
            >
              <UIcon :name="subject.icon" class="w-5 h-5" />
              <span>{{ subject.title }}</span>
            </NuxtLink>

            <!-- 移动端二级菜单 -->
            <div v-if="activeSubject === subject.id && subject.categories && subject.categories.length > 0" class="ml-8 mt-2 space-y-1">
              <NuxtLink
                v-for="category in subject.categories"
                :key="category.id"
                :to="category.path"
                @click="isMobileMenuOpen = false"
                :class="[
                  'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                  route.path.startsWith(category.path)
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                ]"
              >
                <span>{{ category.title }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()
const { getSubjects } = useNavigation()

// 响应式状态
const isDark = computed(() => colorMode.value === 'dark')
const isSearchOpen = ref(false)
const isMobileMenuOpen = ref(false)
const activeSubject = ref<string | null>(null)

// 学科数据加载
const { data: subjects, pending, error } = await useAsyncData('subjects', async () => {
  try {
    console.log('获取学科数据...')
    const result = await getSubjects()
    console.log('学科数据获取成功:', result)

    // 输出每个学科的详细信息
    result.forEach(subject => {
      console.log(`学科 ${subject.title}:`, {
        id: subject.id,
        categoriesCount: subject.categories?.length || 0,
        categories: subject.categories
      })
    })

    return result
  } catch (err) {
    console.error('获取学科数据失败:', err)
    throw err
  }
})

// 当前激活的学科
const currentSubject = computed(() => {
  if (!subjects.value || !activeSubject.value) {
    return null
  }
  const found = subjects.value.find(subject => subject.id === activeSubject.value)
  console.log('当前学科:', found)
  return found || null
})

// 根据路由自动设置 activeSubject
watch(() => route.path, (newPath) => {
  console.log('路由变化:', newPath)
  const pathSegments = newPath.split('/').filter(Boolean)

  if (pathSegments.length > 0) {
    const subjectId = pathSegments[0]
    console.log('检测到学科ID:', subjectId)

    // 检查这个学科是否存在
    if (subjects.value?.some(s => s.id === subjectId)) {
      console.log('设置 activeSubject 为:', subjectId)
      activeSubject.value = subjectId
    } else {
      console.log('学科不存在，可用学科:', subjects.value?.map(s => s.id))
      activeSubject.value = null
    }
  } else {
    activeSubject.value = null
  }
}, { immediate: true })

// 处理学科点击
const handleSubjectClick = (subjectId: string) => {
  console.log('点击学科:', subjectId)
  activeSubject.value = subjectId
}

// 处理移动端学科点击
const handleMobileSubjectClick = (subjectId: string) => {
  activeSubject.value = subjectId
  isMobileMenuOpen.value = false
}

// 主题切换
const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

// 监控状态变化
watchEffect(() => {
  console.log('=== 状态监控 ===')
  console.log('当前路径:', route.path)
  console.log('激活学科:', activeSubject.value)
  console.log('当前学科:', currentSubject.value?.id)
  console.log('分类数量:', currentSubject.value?.categories?.length || 0)
  console.log('二级菜单显示条件:', {
    hasActiveSubject: !!activeSubject.value,
    hasCurrentSubject: !!currentSubject.value,
    hasCategories: (currentSubject.value?.categories?.length || 0) > 0
  })
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>