<!-- File: components/SidebarNavigationItem.vue -->
<template>
  <div class="relative">
    <!-- 目录项 -->
    <div
      v-if="item.isDirectory"
      @click="handleToggle"
      :class="[
        'group relative flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200',
        'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        hasActiveChild ? 'bg-primary-50/30 dark:bg-primary-900/10' : '',
        levelPaddingClass
      ]"
    >
      <!-- 展开/收起图标 -->
      <button
        class="w-5 h-5 mr-2 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        @click.stop="handleToggle"
      >
        <UIcon
          :name="isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
          class="w-4 h-4 text-gray-500 dark:text-gray-400"
        />
      </button>

      <!-- 文件夹图标 -->
      <UIcon
        :name="isExpanded ? 'i-heroicons-folder-open' : 'i-heroicons-folder'"
        :class="[
          'w-5 h-5 mr-2',
          hasActiveChild ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'
        ]"
      />

      <!-- 目录名称 -->
      <span :class="[
        'flex-1 text-sm font-medium',
        hasActiveChild 
          ? 'text-gray-900 dark:text-white' 
          : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
      ]">
        {{ item.title }}
      </span>

      <!-- 子项数量 -->
      <span
        v-if="item.children && item.children.length > 0"
        class="text-xs text-gray-400 dark:text-gray-500"
      >
        {{ item.children.length }}
      </span>
    </div>

    <!-- 文件项 -->
    <NuxtLink
      v-else
      :to="item._path"
      :class="[
        'group relative flex items-center px-3 py-2 rounded-lg transition-all duration-200',
        isActive
          ? 'bg-primary-500 text-white shadow-sm'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300',
        levelPaddingClass
      ]"
    >
      <!-- 文件图标 -->
      <div class="w-5 h-5 mr-2 flex items-center justify-center">
        <div :class="[
          'transition-all duration-200',
          isActive
            ? 'w-2 h-2 bg-white rounded-full'
            : 'w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full group-hover:w-2 group-hover:h-2 group-hover:bg-primary-500'
        ]" />
      </div>

      <!-- 文件名 -->
      <span :class="[
        'flex-1 text-sm',
        isActive ? 'font-medium' : 'group-hover:text-gray-900 dark:group-hover:text-white'
      ]">
        {{ item.title }}
      </span>

      <!-- 难度标记 -->
      <div
        v-if="item.difficulty && !isActive"
        :class="[
          'w-1.5 h-1.5 rounded-full',
          item.difficulty === 'beginner' ? 'bg-green-400' :
          item.difficulty === 'intermediate' ? 'bg-yellow-400' :
          'bg-red-400'
        ]"
        :title="difficultyLabels[item.difficulty]"
      />
    </NuxtLink>

    <!-- 子项容器 -->
    <div
      v-if="item.children && item.children.length > 0"
      v-show="isExpanded"
      class="mt-1 space-y-0.5"
    >
      <SidebarNavigationItem
        v-for="child in item.children"
        :key="child._path"
        :item="child"
        :current-path="currentPath"
        :expanded-items="expandedItems"
        :level="level + 1"
        @toggle="emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/composables/useNavigation'

interface Props {
  item: NavigationItem
  currentPath: string
  expandedItems: Set<string>
  level?: number
}

interface Emits {
  (e: 'toggle', path: string): void
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
})

const emit = defineEmits<Emits>()

// 难度标签
const difficultyLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

// 是否展开
const isExpanded = computed(() => props.expandedItems.has(props.item._path))

// 是否为当前页面
const isActive = computed(() => props.currentPath === props.item._path)

// 是否有活跃子项
const hasActiveChild = computed(() => {
  if (!props.item.children) return false
  
  const checkActive = (items: NavigationItem[]): boolean => {
    return items.some(child => {
      if (child._path === props.currentPath) return true
      if (child.children) return checkActive(child.children)
      return false
    })
  }
  
  return checkActive(props.item.children)
})

// 层级缩进
const levelPaddingClass = computed(() => {
  const paddingLeft = 12 + (props.level * 20)
  return { paddingLeft: `${paddingLeft}px` }
})

// 处理展开/收起
const handleToggle = () => {
  if (props.item.isDirectory) {
    emit('toggle', props.item._path)
  }
}
</script>