<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// SEO 元数据
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - STEM 教育文档` : 'STEM 教育文档'
  },
  htmlAttrs: {
    lang: 'zh-CN'
  }
})

// 设置颜色模式
const colorMode = useColorMode()

// 可以设置默认主题
// colorMode.preference = 'light'
</script>