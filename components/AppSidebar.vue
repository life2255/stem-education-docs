<!-- File: components/AppSidebar.vue -->
<template>
  <div class="h-full">
    <!-- 学科首页：显示分类导航 -->
    <div v-if="isSubjectHomepage && currentSubject" class="space-y-4">
      <!-- 学科信息卡片 -->
      <div class="bg-gradient-to-br from-primary-500/10 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-600/20 rounded-2xl p-5">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg flex items-center justify-center flex-shrink-0">
            <UIcon :name="currentSubject.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {{ currentSubject.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ currentSubject.description || '选择一个分类开始学习' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 分类列表 -->
      <nav class="space-y-2">
        <NuxtLink
          v-for="category in currentSubject.categories"
          :key="category.id"
          :to="category.path"
          :class="[
            'group relative flex items-center p-4 rounded-xl transition-all duration-200',
            'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
            route.path.startsWith(category.path)
              ? 'bg-white dark:bg-gray-800 shadow-md ring-1 ring-primary-500/20'
              : 'bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800'
          ]"
        >
          <!-- 活跃指示器 -->
          <div
            v-if="route.path.startsWith(category.path)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"
          />

          <!-- 图标 -->
          <div :class="[
            'w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all duration-200',
            route.path.startsWith(category.path)
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400'
          ]">
            <UIcon :name="category.icon" class="w-5 h-5" />
          </div>

          <!-- 文本内容 -->
          <div class="flex-1 min-w-0">
            <h4 :class="[
              'font-medium transition-colors duration-200',
              route.path.startsWith(category.path)
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
            ]">
              {{ category.title }}
            </h4>
            <p v-if="category.description" class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {{ category.description }}
            </p>
          </div>

          <!-- 箭头 -->
          <UIcon
            name="i-heroicons-chevron-right"
            :class="[
              'w-5 h-5 transition-all duration-200',
              route.path.startsWith(category.path)
                ? 'text-primary-500 translate-x-0'
                : 'text-gray-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
            ]"
          />
        </NuxtLink>
      </nav>
    </div>

    <!-- 分类页面：显示导航结构 -->
    <div v-else-if="navigation && navigation.length > 0" class="space-y-4">
      <!-- 分类信息头 -->
      <div class="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl shadow-sm flex items-center justify-center">
            <UIcon :name="currentCategory?.icon || 'i-heroicons-folder'" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ currentCategory?.title || '内容导航' }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {{ navigation.length }} 个项目
            </p>
          </div>
        </div>
      </div>

      <!-- 导航树 -->
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
    <div v-else class="flex flex-col items-center justify-center py-12 px-4">
      <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
        <UIcon name="i-heroicons-folder-open" class="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        暂无内容
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
        该分类下还没有文章
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/composables/useNavigation'

const route = useRoute()
const { getCategoryNavigation, getSubjectById, getCategoryById } = useNavigation()

// 展开状态管理
const expandedItems = ref<Set<string>>(new Set())

// 计算当前路径段
const pathSegments = computed(() => route.path.split('/').filter(Boolean))

// 当前学科
const currentSubject = ref<any>(null)

// 当前分类
const currentCategory = ref<any>(null)

// 导航数据
const navigation = ref<NavigationItem[]>([])

// 判断是否为学科首页
const isSubjectHomepage = computed(() => {
  return pathSegments.value.length === 1 && currentSubject.value !== null
})

// 切换展开状态
const toggleExpanded = (path: string) => {
  if (expandedItems.value.has(path)) {
    expandedItems.value.delete(path)
  } else {
    expandedItems.value.add(path)
  }
}

// 自动展开包含当前页面的目录
const expandParentPaths = () => {
  if (!navigation.value) return

  const findAndExpand = (items: NavigationItem[], targetPath: string, parentPaths: string[] = []): boolean => {
    for (const item of items) {
      const currentPaths = [...parentPaths]
      
      if (item.isDirectory) {
        currentPaths.push(item._path)
        
        if (item._path === targetPath || (item.children && findAndExpand(item.children, targetPath, currentPaths))) {
          currentPaths.forEach(path => expandedItems.value.add(path))
          return true
        }
      } else if (item._path === targetPath) {
        parentPaths.forEach(path => expandedItems.value.add(path))
        return true
      }
    }
    return false
  }

  findAndExpand(navigation.value, route.path)
}

// 加载数据
const loadData = async () => {
  // 重置状态
  currentSubject.value = null
  currentCategory.value = null
  navigation.value = []

  if (pathSegments.value.length === 0) return

  // 加载学科信息
  if (pathSegments.value.length >= 1) {
    currentSubject.value = await getSubjectById(pathSegments.value[0])
  }

  // 加载分类信息和导航
  if (pathSegments.value.length >= 2 && currentSubject.value) {
    currentCategory.value = await getCategoryById(pathSegments.value[0], pathSegments.value[1])
    
    const categoryPath = `/${pathSegments.value[0]}/${pathSegments.value[1]}`
    navigation.value = await getCategoryNavigation(categoryPath)
    
    // 自动展开
    nextTick(() => {
      expandParentPaths()
    })
  }
}

// 监听路由变化
watch(() => route.path, () => {
  loadData()
}, { immediate: true })
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>