<!-- File: components/MathContentWrapper.vue -->
<template>
  <div ref="contentContainer" :key="routeKey">
    <slot />
  </div>
</template>

<script setup lang="ts">
// 处理 SPA 导航中 MathJax 显示问题的组件
const route = useRoute()
const contentContainer = ref<HTMLElement>()

// 生成路由键，强制重新渲染
const routeKey = computed(() => route.path)

// 确保数学公式在客户端导航时正确显示
const processMathContent = () => {
  if (!contentContainer.value) return

  nextTick(() => {
    // 查找所有 MathJax 容器
    const mathContainers = contentContainer.value!.querySelectorAll('mjx-container')
    
    // 如果找到 MathJax 容器但是不可见，强制显示
    mathContainers.forEach((container: Element) => {
      const element = container as HTMLElement
      if (element.style.display === 'none' || !element.offsetParent) {
        element.style.display = ''
        element.style.visibility = 'visible'
        element.style.opacity = '1'
      }
    })

    // 触发重新布局
    if (mathContainers.length > 0) {
      // 强制重绘
      contentContainer.value!.style.display = 'none'
      contentContainer.value!.offsetHeight // 强制重排
      contentContainer.value!.style.display = ''
    }
  })
}

// 监听路由变化
watch(() => route.path, () => {
  setTimeout(processMathContent, 100)
}, { immediate: false })

// 组件挂载后处理
onMounted(() => {
  setTimeout(processMathContent, 200)
})

// 内容更新后处理
onUpdated(() => {
  setTimeout(processMathContent, 50)
})
</script>

<style scoped>
/* 确保容器不会影响 MathJax 样式 */
div {
  contain: none;
}
</style>