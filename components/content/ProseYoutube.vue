<template>
    <div class="my-6">
      <div class="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <iframe
          :src="`https://www.youtube.com/embed/${id}`"
          :title="title || 'YouTube video'"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="absolute top-0 left-0 w-full h-full"
        />
      </div>
      <p v-if="caption" class="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        {{ caption }}
      </p>
    </div>
  </template>

  <script setup lang="ts">
  interface Props {
    id: string
    title?: string
    caption?: string
  }

  defineProps<Props>()
  </script>