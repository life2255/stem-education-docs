<template>
    <div class="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-center mb-2">
        <UIcon name="i-heroicons-calculator" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
        <span class="font-semibold text-blue-900 dark:text-blue-100">数学公式</span>
      </div>
      <div class="text-2xl text-center py-4 font-mono text-blue-900 dark:text-blue-100">
        <slot />
      </div>
    </div>
  </template>