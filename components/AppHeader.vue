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
            <button
              @click="toggleSubject(subject.id)"
              :class="[
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
                activeSubject === subject.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <UIcon :name="subject.icon" class="w-4 h-4" />
              <span>{{ subject.title }}</span>
              <UIcon
                name="i-heroicons-chevron-down-20-solid"
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': activeSubject === subject.id }"
              />
            </button>
          </div>
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

    <!-- 二级菜单栏 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="activeSubject && currentSubject && currentSubject.categories.length > 0"
        class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      >
        <div class="stem-container">
          <div class="flex items-center justify-between py-3">
            <!-- 分类导航 -->
            <div class="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
              <div class="flex items-center space-x-1 min-w-max">
                <NuxtLink
                  v-for="category in currentSubject.categories"
                  :key="category.id"
                  :to="category.path"
                  @click="closeMenu"
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

            <!-- 关闭按钮 -->
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              size="sm"
              aria-label="关闭"
              class="ml-4 flex-shrink-0"
              @click="closeMenu"
            />
          </div>
        </div>
      </div>
    </Transition>

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
        <!-- 简化的移动端菜单 -->
        <div class="space-y-2">
          <NuxtLink
            v-for="subject in subjects"
            :key="subject.id"
            :to="subject.path"
            @click="isMobileMenuOpen = false"
            class="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <UIcon :name="subject.icon" class="w-5 h-5" />
            <span>{{ subject.title }}</span>
          </NuxtLink>
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

// 学科数据 - 使用真正动态的数据加载
const { data: subjects, refresh: refreshSubjects } = await useAsyncData('subjects', async () => {
  const result = await getSubjects()
  console.log('=== AppHeader Loading ===')
  console.log('Loaded subjects from filesystem:', result)
  return result
})

// 当内容发生变化时重新加载
const { $router } = useNuxtApp()
$router.afterEach(() => {
  // 可以选择在路由变化时刷新数据
  // refreshSubjects()
})

// 当前激活的学科
const currentSubject = computed(() => {
  if (!subjects.value || !activeSubject.value) return null
  return subjects.value.find(subject => subject.id === activeSubject.value) || null
})

// 主题切换
const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

// 切换学科菜单
const toggleSubject = (subjectId: string) => {
  if (activeSubject.value === subjectId) {
    closeMenu()
  } else {
    activeSubject.value = subjectId
  }
}

// 关闭菜单
const closeMenu = () => {
  activeSubject.value = null
}

// 点击外部区域关闭菜单
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('header')) {
      closeMenu()
    }
  }

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeMenu()
    }
  }

  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
  })
})

// 调试信息（开发时可以查看）
if (process.dev) {
  watchEffect(() => {
    console.log('=== AppHeader Debug ===')
    console.log('Subjects loaded:', subjects.value)
    console.log('Active subject:', activeSubject.value)
    console.log('Current subject:', currentSubject.value)
    if (currentSubject.value) {
      console.log('Current subject categories:', currentSubject.value.categories)
    }
  })
}
</script>

<style scoped>
/* 隐藏滚动条但保持功能 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>