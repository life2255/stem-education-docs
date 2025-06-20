<!-- File: components/ModernNavigationItem.vue -->
<template>
  <div class="relative">
    <!-- 目录项 -->
    <div
      v-if="item.isDirectory"
      @click="handleToggle"
      :class="[
        'group relative flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200',
        'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        isActive ? 'bg-primary-50/50 dark:bg-primary-900/20' : '',
        levelPaddingClass
      ]"
    >
      <!-- 缩进线条 -->
      <div
        v-if="level > 0"
        class="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"
        :style="{ left: `${(level - 1) * 20 + 12}px` }"
      />

      <!-- 展开/收起图标 -->
      <button
        class="w-5 h-5 mr-2 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        @click.stop="handleToggle"
      >
        <UIcon
          :name="isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
          class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-0': !isExpanded }"
        />
      </button>

      <!-- 文件夹图标 -->
      <div :class="[
        'w-5 h-5 mr-2 flex items-center justify-center',
        isActive || hasActiveChild ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'
      ]">
        <UIcon
          :name="isExpanded ? 'i-heroicons-folder-open' : 'i-heroicons-folder'"
          class="w-5 h-5"
        />
      </div>

      <!-- 目录名称 -->
      <span :class="[
        'flex-1 text-sm font-medium',
        isActive || hasActiveChild 
          ? 'text-gray-900 dark:text-white' 
          : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
      ]">
        {{ item.title }}
      </span>

      <!-- 子项数量 -->
      <span
        v-if="item.children && item.children.length > 0"
        class="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
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
          ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300',
        levelPaddingClass
      ]"
    >
      <!-- 缩进线条 -->
      <div
        v-if="level > 0"
        class="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"
        :style="{ left: `${(level - 1) * 20 + 12}px` }"
      />

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
        isActive
          ? 'font-medium'
          : 'group-hover:text-gray-900 dark:group-hover:text-white'
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

      <!-- 活跃状态右侧指示器 -->
      <div
        v-if="isActive"
        class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/30 rounded-l-full"
      />
    </NuxtLink>

    <!-- 子项容器 -->
    <div
      v-if="item.children && item.children.length > 0"
      v-show="isExpanded"
      class="relative mt-1 space-y-0.5"
    >
      <ModernNavigationItem
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
  const baseIndent = 12 // 基础缩进 (px)
  const levelIndent = 20 // 每层缩进 (px)
  const totalIndent = baseIndent + (props.level * levelIndent)
  
  // 使用内联样式以支持动态缩进
  return {
    paddingLeft: `${totalIndent}px`
  }
})

// 处理展开/收起
const handleToggle = () => {
  if (props.item.isDirectory) {
    emit('toggle', props.item._path)
  }
}
</script>

<style scoped>
/* 平滑过渡动画 */
.rotate-0 {
  transform: rotate(0deg);
}

/* 确保链接占满整个区域 */
a {
  text-decoration: none;
}

/* 优化触摸设备的点击区域 */
@media (hover: none) {
  .group {
    min-height: 44px;
  }
}
</style>