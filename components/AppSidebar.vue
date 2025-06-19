<!-- File: components/AppSidebar.vue -->
<template>
  <div class="space-y-6">
    <!-- 学科首页：显示分类导航 -->
    <div v-if="isSubjectHomepage && currentSubject">
      <div class="mb-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-800">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center">
            <UIcon :name="currentSubject.icon" class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100">
            {{ currentSubject.title }}
          </h3>
        </div>
        <p class="text-sm text-primary-700 dark:text-primary-300">
          {{ currentSubject.description || '选择一个分类开始学习' }}
        </p>
      </div>

      <nav class="space-y-2">
        <NuxtLink
          v-for="category in currentSubject.categories"
          :key="category.id"
          :to="`/${currentSubject.id}/${category.id}`"
          :class="[
            'group flex items-center p-4 rounded-xl border transition-all duration-200',
            route.path.startsWith(`/${currentSubject.id}/${category.id}`)
              ? 'bg-primary-50 border-primary-200 text-primary-700 shadow-sm dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
              : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-600 dark:hover:bg-primary-900/20'
          ]"
        >
          <div :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors',
            route.path.startsWith(`/${currentSubject.id}/${category.id}`)
              ? 'bg-primary-100 dark:bg-primary-800/50'
              : 'bg-gray-100 group-hover:bg-primary-100 dark:bg-gray-700 dark:group-hover:bg-primary-800/50'
          ]">
            <UIcon 
              :name="category.icon" 
              :class="[
                'w-5 h-5 transition-colors',
                route.path.startsWith(`/${currentSubject.id}/${category.id}`)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400'
              ]"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium truncate">{{ category.title }}</h4>
            <p v-if="category.description" class="text-sm opacity-75 truncate">
              {{ category.description }}
            </p>
          </div>
          <UIcon
            name="i-heroicons-arrow-right"
            class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1"
          />
        </NuxtLink>
      </nav>
    </div>

    <!-- 分类页面：显示嵌套文件和目录结构 -->
    <div v-else-if="navigation && navigation.length > 0">
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-lg flex items-center justify-center">
            <UIcon :name="currentCategory?.icon || 'i-heroicons-folder'" class="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ currentCategory?.title || '内容导航' }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ currentCategory?.description || '浏览该分类下的所有内容' }}
            </p>
          </div>
        </div>
      </div>

      <nav class="space-y-1">
        <SidebarNavigationItem
          v-for="item in navigation"
          :key="item._path"
          :item="item"
          :current-path="route.path"
          :expanded-items="expandedItems"
          :level="0"
          @toggle="toggleExpanded"
        />
      </nav>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon
          name="i-heroicons-document-text"
          class="w-8 h-8 text-gray-400 dark:text-gray-500"
        />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        暂无内容
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        该分类下还没有文章
      </p>
    </div>

    <!-- 加载状态 -->
    <div v-if="pending" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">加载中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/composables/useNavigation'

const route = useRoute()
const { getCategoryNavigation, getSubjectById, getCategoryById } = useNavigation()

// 展开状态管理
const expandedItems = ref<Set<string>>(new Set())

// 计算当前学科和分类
const pathSegments = computed(() => route.path.split('/').filter(Boolean))

const currentSubject = computed(() => {
  if (pathSegments.value.length === 0) return null
  return getSubjectById(pathSegments.value[0])
})

const currentCategory = computed(() => {
  if (pathSegments.value.length < 2 || !currentSubject.value) return null
  return getCategoryById(pathSegments.value[0], pathSegments.value[1])
})

// 判断是否为学科首页
const isSubjectHomepage = computed(() => {
  return pathSegments.value.length === 1 && currentSubject.value !== null
})

// 获取导航数据
const { data: navigation, pending, error } = await useAsyncData(
  `sidebar-navigation-${route.path}`,
  async () => {
    // 只有在分类页面才获取导航数据
    if (pathSegments.value.length >= 2) {
      const categoryPath = `/${pathSegments.value[0]}/${pathSegments.value[1]}`
      console.log('获取侧边栏导航:', categoryPath)
      return await getCategoryNavigation(categoryPath)
    }
    return []
  },
  {
    watch: [() => route.path]
  }
)

// 切换展开状态
const toggleExpanded = (path: string) => {
  if (expandedItems.value.has(path)) {
    expandedItems.value.delete(path)
  } else {
    expandedItems.value.add(path)
  }
}

// 自动展开包含当前页面的目录
const findPathsToFile = (items: NavigationItem[], targetPath: string): string[] => {
  const paths: string[] = []

  const traverse = (items: NavigationItem[], currentPaths: string[] = []): boolean => {
    for (const item of items) {
      const newPaths = [...currentPaths, item._path]

      if (item._path === targetPath) {
        paths.push(...currentPaths.filter(path => path !== targetPath))
        return true
      }

      if (item.children && traverse(item.children, newPaths)) {
        paths.push(item._path)
        return true
      }
    }
    return false
  }

  traverse(items)
  return paths
}

// 监听路由变化，自动展开相关目录
watch(() => route.path, (newPath) => {
  if (navigation.value) {
    const autoExpandPaths = findPathsToFile(navigation.value, newPath)
    autoExpandPaths.forEach(path => {
      expandedItems.value.add(path)
    })
  }
}, { immediate: true })

// 调试信息
watchEffect(() => {
  console.log('=== Sidebar 状态 ===')
  console.log('当前路径:', route.path)
  console.log('路径段:', pathSegments.value)
  console.log('当前学科:', currentSubject.value?.title)
  console.log('当前分类:', currentCategory.value?.title)
  console.log('是学科首页:', isSubjectHomepage.value)
  console.log('导航项数量:', navigation.value?.length || 0)
})
</script>

<style scoped>
/* 优化动画效果 */
.nav-item-enter-active,
.nav-item-leave-active {
  transition: all 0.3s ease;
}

.nav-item-enter-from,
.nav-item-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>