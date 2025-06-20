<!-- File: components/SimpleNavigationItem.vue -->
<template>
  <div class="space-y-1">
    <!-- 目录项 -->
    <div
      v-if="item.isDirectory"
      :class="[
        'py-2 text-base font-semibold text-gray-900 dark:text-white',
        levelPaddingClass
      ]"
    >
      {{ item.title }}
    </div>

    <!-- 文件项 -->
    <NuxtLink
      v-else
      :to="item._path"
      :class="[
        'block py-1.5 text-sm transition-colors duration-200',
        isActive
          ? 'text-green-600 dark:text-green-400'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
        levelPaddingClass
      ]"
    >
      {{ item.title }}
    </NuxtLink>

    <!-- 子项容器 - 始终显示，无折叠 -->
    <div
      v-if="item.children && item.children.length > 0"
      class="space-y-1"
    >
      <SimpleNavigationItem
        v-for="child in item.children"
        :key="child._path"
        :item="child"
        :current-path="currentPath"
        :level="level + 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/composables/useNavigation'

interface Props {
  item: NavigationItem
  currentPath: string
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
})

// 是否为当前页面
const isActive = computed(() => props.currentPath === props.item._path)

// 层级缩进样式
const levelPaddingClass = computed(() => {
  const indent = props.level * 16 // 每层16px缩进
  return props.level === 0 ? '' : `pl-${Math.min(indent / 4, 12)}`
})
</script>

<style scoped>
/* 层级缩进工具类 */
.pl-4 { padding-left: 1rem; }
.pl-8 { padding-left: 2rem; }
.pl-12 { padding-left: 3rem; }
</style>