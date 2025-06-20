<!-- File: components/AppHeader.vue -->
<template>
  <header class="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
    <!-- 主导航栏 -->
    <nav class="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center space-x-3 px-3 py-2 -mx-3 -my-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
            <span class="text-white font-bold text-lg">S</span>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">STEM Docs</span>
        </NuxtLink>

        <!-- 主导航菜单 -->
        <div class="hidden md:flex items-center space-x-2">
          <NuxtLink
            v-for="subject in subjects"
            :key="subject.id"
            :to="subject.path"
            @click="activeSubject = subject.id"
            :class="[
              'flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              activeSubject === subject.id
                ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            <UIcon :name="subject.icon" class="w-4 h-4" />
            <span>{{ subject.title }}</span>
          </NuxtLink>
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
            @click="$emit('open-search')"
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
        v-if="currentSubject && currentSubject.categories && currentSubject.categories.length > 0"
        class="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
      >
        <div class="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6">
          <div class="flex items-center justify-between py-3">
            <!-- 分类导航 -->
            <div class="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
              <div class="flex items-center space-x-1 min-w-max">
                <!-- 学科概述链接 -->
                <NuxtLink
                  :to="currentSubject.path"
                  :class="[
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    route.path === currentSubject.path
                      ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-700/70 hover:text-gray-900 dark:hover:text-white'
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
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    route.path.startsWith(category.path)
                      ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-700/70 hover:text-gray-900 dark:hover:text-white'
                  ]"
                >
                  <UIcon :name="category.icon" class="w-4 h-4" />
                  <span>{{ category.title }}</span>
                </NuxtLink>
              </div>
            </div>

            <!-- 学科信息指示器 -->
            <div class="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 ml-4">
              <div class="flex items-center space-x-1">
                <UIcon name="i-heroicons-folder" class="w-3 h-3" />
                <span>{{ currentSubject.categories.length }} 个分类</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 移动端菜单 -->
    <USlideover v-model="isMobileMenuOpen">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">学科导航</h3>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            size="sm"
            @click="isMobileMenuOpen = false"
          />
        </div>
        
        <!-- 移动端学科列表 -->
        <div class="space-y-4">
          <div v-for="subject in subjects" :key="subject.id" class="space-y-2">
            <!-- 学科标题 -->
            <NuxtLink
              :to="subject.path"
              @click="handleMobileSubjectClick(subject.id)"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                activeSubject === subject.id 
                  ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700' 
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <UIcon :name="subject.icon" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ subject.title }}</span>
              <UIcon 
                name="i-heroicons-chevron-right" 
                class="w-4 h-4 text-gray-400 ml-auto"
              />
            </NuxtLink>
            
            <!-- 移动端分类列表 -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="activeSubject === subject.id" class="ml-4 space-y-1 overflow-hidden">
                <NuxtLink
                  v-for="category in subject.categories"
                  :key="category.id"
                  :to="category.path"
                  @click="isMobileMenuOpen = false"
                  class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <UIcon :name="category.icon" class="w-4 h-4" />
                  <span>{{ category.title }}</span>
                </NuxtLink>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
import { navigationConfig } from '~/config/navigation.config'

const route = useRoute()
const colorMode = useColorMode()

// 响应式状态
const isDark = computed(() => colorMode.value === 'dark')
const isMobileMenuOpen = ref(false)
const activeSubject = ref<string | null>(null)

// 直接使用配置中的学科数据
const subjects = navigationConfig

// 当前学科
const currentSubject = computed(() => {
  if (!activeSubject.value) return null
  return subjects.find(s => s.id === activeSubject.value)
})

// 根据路由自动设置 activeSubject
watch(() => route.path, (newPath) => {
  const pathSegments = newPath.split('/').filter(Boolean)
  if (pathSegments.length > 0) {
    const subjectId = pathSegments[0]
    if (subjects.some(s => s.id === subjectId)) {
      activeSubject.value = subjectId
    } else {
      activeSubject.value = null
    }
  } else {
    activeSubject.value = null
  }
}, { immediate: true })

// 处理移动端学科点击
const handleMobileSubjectClick = (subjectId: string) => {
  if (activeSubject.value === subjectId) {
    activeSubject.value = null
  } else {
    activeSubject.value = subjectId
  }
}

// 主题切换
const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

// 定义事件
defineEmits(['open-search'])
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.max-h-96 {
  max-height: 24rem;
}
</style>