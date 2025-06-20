<!-- File: components/MathJaxRenderer.vue -->
<!-- 处理动态 MathJax 渲染的 Vue 组件 -->
<template>
  <div ref="container" v-html="processedContent"></div>
</template>

<script setup lang="ts">
interface Props {
  content: string
}

const props = defineProps<Props>()
const container = ref<HTMLElement>()
const processedContent = ref('')
const { $mathJax } = useNuxtApp()

// 处理数学公式的函数
const processMathContent = (content: string): string => {
  if (!content) return ''
  
  // 预处理：确保数学公式被正确标记
  let processed = content
  
  // 处理行内数学公式 $...$
  processed = processed.replace(/\$([^$\n]+?)\$/g, '<span class="math-inline">$$$1$$</span>')
  
  // 处理块级数学公式 $$...$$
  processed = processed.replace(/\$\$([^$]+?)\$\$/g, '<div class="math-display">$$$$1$$$$</div>')
  
  return processed
}

// 渲染 MathJax
const renderMath = async () => {
  if (!container.value || !window.MathJax) return
  
  try {
    // 等待 MathJax 准备就绪
    if (window.MathJax.startup) {
      await window.MathJax.startup.promise
    }
    
    // 清除之前的渲染
    if (window.MathJax.typesetClear) {
      window.MathJax.typesetClear([container.value])
    }
    
    // 重新渲染
    await window.MathJax.typesetPromise([container.value])
    
    console.log('✅ MathJax 渲染完成')
  } catch (error) {
    console.warn('⚠️ MathJax 渲染失败:', error)
  }
}

// 监听内容变化
watch(() => props.content, (newContent) => {
  processedContent.value = processMathContent(newContent)
  nextTick(() => {
    renderMath()
  })
}, { immediate: true })

// 组件挂载后渲染
onMounted(() => {
  processedContent.value = processMathContent(props.content)
  nextTick(() => {
    // 延迟渲染，确保 MathJax 已加载
    setTimeout(renderMath, 300)
  })
})

// 确保在组件卸载时清理
onUnmounted(() => {
  if (container.value && window.MathJax && window.MathJax.typesetClear) {
    try {
      window.MathJax.typesetClear([container.value])
    } catch (error) {
      // 静默忽略清理错误
    }
  }
})
</script>

<style scoped>
/* MathJax 容器样式 */
:deep(.math-inline) {
  display: inline-block;
  margin: 0 2px;
}

:deep(.math-display) {
  display: block;
  text-align: center;
  margin: 1rem 0;
}

/* 确保 MathJax 元素正确显示 */
:deep(mjx-container) {
  display: inline-block !important;
}

:deep(mjx-container[display="true"]) {
  display: block !important;
  text-align: center !important;
  margin: 1rem auto !important;
}
</style>