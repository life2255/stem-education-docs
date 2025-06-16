<template>
    <div class="my-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
      <div class="flex items-center mb-3">
        <UIcon name="i-heroicons-beaker" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
        <span class="font-semibold text-green-900 dark:text-green-100">示例</span>
      </div>
      <div class="prose prose-green dark:prose-invert max-w-none">
        <slot />
      </div>
    </div>
  </template>