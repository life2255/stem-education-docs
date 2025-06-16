<template>
    <div class="my-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
      <div class="flex items-start">
        <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-amber-600 dark:text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
        <div class="prose prose-amber dark:prose-invert max-w-none">
          <slot />
        </div>
      </div>
    </div>
  </template>