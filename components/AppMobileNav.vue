<!-- components/AppMobileNav.vue -->
<template>
  <div class="space-y-3 max-h-[70vh] overflow-y-auto">
    <!-- 学科列表 -->
    <div v-for="subject in subjects" :key="subject.id" class="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
      <!-- 学科标题 -->
      <button
        @click="toggleSubject(subject.id)"
        class="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        :class="{
          'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800': expandedSubject === subject.id
        }"
      >
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <UIcon :name="subject.icon" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <span class="font-medium text-gray-900 dark:text-white">{{ subject.title }}</span>
        </div>
        <UIcon
          :name="expandedSubject === subject.id ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          class="w-5 h-5 text-gray-400 transition-transform duration-200"
        />
      </button>

      <!-- 展开的分类 -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2 max-h-0"
        enter-to-class="opacity-100 translate-y-0 max-h-96"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 max-h-96"
        leave-to-class="opacity-0 -translate-y-2 max-h-0"
      >
        <div v-if="expandedSubject === subject.id" class="mt-2 ml-4 space-y-1 overflow-hidden">
          <NuxtLink
            v-for="category in subject.categories"
            :key="category.id"
            :to="category.path"
            @click="$emit('close')"
            class="group flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <!-- 分类图标 -->
            <div class="w-6 h-6 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-800/50 transition-colors">
              <UIcon name="i-heroicons-folder" class="w-3 h-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
            </div>

            <!-- 分类标题 -->
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 flex-1">
              {{ category.title }}
            </span>

            <!-- 箭头 -->
            <UIcon
              name="i-heroicons-arrow-right"
              class="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
            />
          </NuxtLink>
        </div>
      </Transition>
    </div>

    <!-- 底部快捷操作 -->
    <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-2 gap-3">
        <UButton
          variant="outline"
          color="gray"
          block
          icon="i-heroicons-magnifying-glass"
          label="搜索"
          size="sm"
          @click="$emit('search')"
        />
        <UButton
          variant="outline"
          color="gray"
          block
          :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          :label="isDark ? '深色' : '浅色'"
          size="sm"
          @click="toggleColorMode"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Subject } from '~/composables/useNavigation'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

interface Props {
  subjects?: Subject[]
}

defineProps<Props>()
defineEmits(['close', 'search'])

const expandedSubject = ref<string | null>(null)

const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

// 切换学科展开状态
const toggleSubject = (subjectId: string) => {
  expandedSubject.value = expandedSubject.value === subjectId ? null : subjectId
}
</script>