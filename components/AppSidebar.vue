<!-- components/AppSidebar.vue -->
<template>
  <div class="space-y-6">
    <!-- 学科首页：显示分类导航 -->
    <div v-if="isSubjectHomepage && currentSubject?.categories?.length">
      <div class="mb-4">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          {{ currentSubject.title }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          选择一个分类开始学习
        </p>
      </div>

      <nav class="space-y-1">
        <NuxtLink
          v-for="category in currentSubject.categories"
          :key="category.id"
          :to="category.path"
          :class="[
            'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
            route.path.startsWith(category.path)
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/50'
          ]"
        >
          <UIcon
            :name="category.icon"
            class="mr-3 h-4 w-4 flex-shrink-0"
            :class="[
              route.path.startsWith(category.path)
                ? 'text-primary-500 dark:text-primary-400'
                : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
            ]"
          />
          {{ category.title }}
        </NuxtLink>
      </nav>
    </div>

    <!-- 分类页面：显示嵌套文件和目录结构 -->
    <div v-else-if="navigation && navigation.length > 0">
      <div class="mb-4">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
          {{ currentCategory?.title || '内容' }}
        </h3>
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
    <div v-else class="text-center py-12">
      <UIcon
        name="i-heroicons-document-text"
        class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4"
      />
      <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
        暂无内容
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        该分类下还没有文章
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/composables/useNavigation'

const route = useRoute()
const { getCategoryNavigation, getSubjects } = useNavigation()

// 展开状态管理
const expandedItems = ref<Set<string>>(new Set())

// 难度标签映射
const difficultyLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

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

    if (pathSegments.length === 1) {
      return []
    }

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

// 计算总项目数量 - 移除此功能
// const totalItemsCount = computed(() => {
//   const countItems = (items: NavigationItem[]): number => {
//     return items.reduce((count, item) => {
//       return count + 1 + (item.children ? countItems(item.children) : 0)
//     }, 0)
//   }
//   return navigation.value ? countItems(navigation.value) : 0
// })

// 切换展开状态
const toggleExpanded = (path: string) => {
  if (expandedItems.value.has(path)) {
    expandedItems.value.delete(path)
  } else {
    expandedItems.value.add(path)
  }
}

// 查找到达指定文件的路径
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

// 自动展开包含当前页面的目录
watch(() => route.path, (newPath) => {
  if (navigation.value) {
    const autoExpandPaths = findPathsToFile(navigation.value, newPath)
    autoExpandPaths.forEach(path => {
      expandedItems.value.add(path)
    })
  }
}, { immediate: true })
</script>