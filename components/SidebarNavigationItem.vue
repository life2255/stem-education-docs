<!-- File: components/SidebarNavigationItem.vue -->
<template>
  <div>
    <!-- 目录项 -->
    <div
      v-if="item.isDirectory"
      @click="handleToggle"
      :class="[
        'group flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200',
        'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800',
        indentClass,
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
      ]"
      :tabindex="0"
      @keydown.enter="handleToggle"
      @keydown.space.prevent="handleToggle"
    >
      <div class="flex items-center min-w-0 flex-1">
        <UIcon
          :name="isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
          class="mr-3 h-4 w-4 flex-shrink-0 text-gray-400 transition-all duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300"
        />
        <UIcon 
          name="i-heroicons-folder" 
          :class="[
            'mr-3 h-4 w-4 flex-shrink-0 transition-colors duration-200',
            isExpanded 
              ? 'text-primary-500 dark:text-primary-400' 
              : 'text-gray-400 group-hover:text-primary-500 dark:text-gray-500 dark:group-hover:text-primary-400'
          ]"
        />
        <span class="font-medium truncate">{{ item.title }}</span>
      </div>

      <!-- 子项数量指示器 -->
      <div v-if="item.children && item.children.length > 0" 
           class="flex-shrink-0 ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
        {{ item.children.length }}
      </div>
    </div>

    <!-- 文件项 -->
    <NuxtLink
      v-else
      :to="item._path"
      :class="[
        'group flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200',
        isActive
          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium border-l-2 border-primary-500'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800',
        indentClass,
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
      ]"
    >
      <div class="flex items-center min-w-0 flex-1">
        <div class="mr-3 h-4 w-4 flex-shrink-0 flex items-center justify-center">
          <div :class="[
            'w-1.5 h-1.5 rounded-full transition-all duration-200',
            isActive 
              ? 'bg-primary-500 scale-100' 
              : 'bg-gray-300 dark:bg-gray-600 scale-75 group-hover:bg-primary-400 group-hover:scale-100'
          ]" />
        </div>
        <span :class="['truncate', level > 0 ? 'text-sm' : '']">{{ item.title }}</span>
      </div>

      <div class="flex items-center space-x-2">
        <!-- 难度标记 -->
        <div v-if="item.difficulty" class="flex-shrink-0">
          <div
            :class="[
              'w-2 h-2 rounded-full transition-all duration-200',
              item.difficulty === 'beginner' ? 'bg-green-400 shadow-green-400/30' :
              item.difficulty === 'intermediate' ? 'bg-yellow-400 shadow-yellow-400/30' :
              'bg-red-400 shadow-red-400/30',
              'shadow-sm'
            ]"
            :title="difficultyLabels[item.difficulty]"
          />
        </div>

        <!-- 活跃状态指示器 -->
        <UIcon
          v-if="isActive"
          name="i-heroicons-arrow-right"
          class="w-3 h-3 text-primary-500 dark:text-primary-400 opacity-75"
        />
      </div>
    </NuxtLink>

    <!-- 子项目（递归展开） -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0 -translate-y-2"
      enter-to-class="opacity-100 max-h-[1000px] translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-[1000px] translate-y-0"
      leave-to-class="opacity-0 max-h-0 -translate-y-2"
    >
      <div v-if="item.children && isExpanded" class="overflow-hidden">
        <div class="relative">
          <!-- 连接线 -->
          <div :class="[
            'absolute left-6 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700',
            level === 0 ? 'ml-0' : `ml-${level * 4}`
          ]" />
          
          <div class="space-y-1 pt-1 pb-2">
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

// 缩进样式 - 使用更精细的缩进控制
const indentClass = computed(() => {
  if (props.level === 0) return ''

  // 根据层级应用不同的左边距，使用Tailwind的动态类
  const indentMap: Record<number, string> = {
    1: 'ml-6',   // 24px
    2: 'ml-10',  // 40px
    3: 'ml-14',  // 56px
    4: 'ml-18',  // 72px
  }

  return indentMap[Math.min(props.level, 4)] || 'ml-18'
})

// 处理目录展开/折叠
const handleToggle = () => {
  if (props.item.isDirectory) {
    emit('toggle', props.item._path)
  }
}
</script>

<style scoped>
/* 确保过渡动画的最大高度足够大 */
.max-h-\[1000px\] {
  max-height: 1000px;
}

/* 优化焦点环样式 */
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* 难度标记的发光效果 */
.shadow-green-400\/30 {
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3);
}

.shadow-yellow-400\/30 {
  box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.3);
}

.shadow-red-400\/30 {
  box-shadow: 0 0 0 1px rgba(248, 113, 113, 0.3);
}
</style>