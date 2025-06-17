<!-- components/SidebarNavigationItem.vue -->
<template>
  <div>
    <!-- 目录项 -->
    <div
      v-if="item.isDirectory"
      @click="handleToggle"
      :class="[
        'group flex items-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors duration-150',
        'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/50',
        indentClass
      ]"
    >
      <UIcon
        :name="isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
        class="mr-2 h-3 w-3 flex-shrink-0 text-gray-400 transition-transform duration-150"
      />
      <span class="font-medium">{{ item.title }}</span>
    </div>

    <!-- 文件项 -->
    <NuxtLink
      v-else
      :to="item._path"
      :class="[
        'group flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors duration-150',
        isActive
          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 font-medium'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/50',
        indentClass
      ]"
    >
      <div class="flex items-center min-w-0 flex-1">
        <!-- 文件不使用任何图标，直接显示标题 -->
        <span :class="['truncate', level > 0 ? 'ml-7' : '']">{{ item.title }}</span>
      </div>

      <!-- 难度标记 -->
      <div v-if="item.difficulty" class="ml-2 flex-shrink-0">
        <div
          :class="[
            'w-2 h-2 rounded-full',
            item.difficulty === 'beginner' ? 'bg-green-400' :
            item.difficulty === 'intermediate' ? 'bg-yellow-400' :
            'bg-red-400'
          ]"
          :title="difficultyLabels[item.difficulty]"
        />
      </div>
    </NuxtLink>

    <!-- 子项目（递归展开） -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="item.children && isExpanded" class="overflow-hidden">
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
    </Transition>
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

// 难度标签映射
const difficultyLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

// 是否展开
const isExpanded = computed(() => props.expandedItems.has(props.item._path))

// 是否为当前页面
const isActive = computed(() => props.currentPath === props.item._path)

// 缩进样式 - 使用 Tailwind 的标准间距类
const indentClass = computed(() => {
  if (props.level === 0) return ''

  // 根据层级应用不同的左边距
  const indentMap: Record<number, string> = {
    1: 'ml-4',   // 16px
    2: 'ml-8',   // 32px
    3: 'ml-12',  // 48px
    4: 'ml-16',  // 64px
  }

  return indentMap[Math.min(props.level, 4)] || 'ml-16'
})

// 处理目录展开/折叠
const handleToggle = () => {
  if (props.item.isDirectory) {
    emit('toggle', props.item._path)
  }
}
</script>