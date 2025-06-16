<template>
    <div
      class="my-6 p-4 rounded-lg border"
      :class="alertClasses"
    >
      <div class="flex items-start">
        <UIcon :name="icon" class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" :class="iconClasses" />
        <div class="flex-1">
          <h4 v-if="title" class="font-semibold mb-1" :class="titleClasses">
            {{ title }}
          </h4>
          <div class="prose dark:prose-invert max-w-none" :class="contentClasses">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  interface Props {
    type?: 'info' | 'success' | 'warning' | 'error' | 'example'
    title?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'info'
  })

  const alertConfig = {
    info: {
      classes: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      icon: 'i-heroicons-information-circle',
      iconClasses: 'text-blue-600 dark:text-blue-400',
      titleClasses: 'text-blue-900 dark:text-blue-100',
      contentClasses: 'prose-blue'
    },
    success: {
      classes: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      icon: 'i-heroicons-check-circle',
      iconClasses: 'text-green-600 dark:text-green-400',
      titleClasses: 'text-green-900 dark:text-green-100',
      contentClasses: 'prose-green'
    },
    warning: {
      classes: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
      icon: 'i-heroicons-exclamation-triangle',
      iconClasses: 'text-amber-600 dark:text-amber-400',
      titleClasses: 'text-amber-900 dark:text-amber-100',
      contentClasses: 'prose-amber'
    },
    error: {
      classes: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      icon: 'i-heroicons-x-circle',
      iconClasses: 'text-red-600 dark:text-red-400',
      titleClasses: 'text-red-900 dark:text-red-100',
      contentClasses: 'prose-red'
    },
    example: {
      classes: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      icon: 'i-heroicons-beaker',
      iconClasses: 'text-purple-600 dark:text-purple-400',
      titleClasses: 'text-purple-900 dark:text-purple-100',
      contentClasses: 'prose-purple'
    }
  }

  const config = computed(() => alertConfig[props.type])
  const alertClasses = computed(() => config.value.classes)
  const icon = computed(() => config.value.icon)
  const iconClasses = computed(() => config.value.iconClasses)
  const titleClasses = computed(() => config.value.titleClasses)
  const contentClasses = computed(() => config.value.contentClasses)
  </script>