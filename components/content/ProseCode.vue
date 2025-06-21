<!-- File: components/content/ProseCode.vue -->
<!-- 代码块拦截器：处理 mermaid 和常规代码块 -->
<template>
  <!-- 🎯 Mermaid 图表渲染 -->
  <ProseMermaid 
    v-if="language === 'mermaid'" 
    :content="code" 
    :id="codeId"
  />
  
  <!-- 🎯 常规代码块渲染 -->
  <div v-else class="code-block-wrapper my-6">
    <!-- 代码块头部 -->
    <div 
      v-if="filename || language" 
      class="flex items-center justify-between bg-gray-800 dark:bg-gray-900 text-gray-200 px-4 py-2 text-sm border-b border-gray-700"
    >
      <div class="flex items-center space-x-3">
        <!-- 文件名 -->
        <span v-if="filename" class="font-mono text-green-400">
          {{ filename }}
        </span>
        <!-- 语言标签 -->
        <span v-if="language && !filename" class="px-2 py-1 bg-gray-700 rounded text-xs uppercase">
          {{ language }}
        </span>
      </div>
      
      <!-- 复制按钮 -->
      <ClientOnly>
        <button
          @click="copyCode"
          class="flex items-center space-x-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
          :title="copySuccess ? '已复制!' : '复制代码'"
        >
          <UIcon 
            :name="copySuccess ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'" 
            class="w-4 h-4" 
          />
          <span>{{ copySuccess ? '已复制' : '复制' }}</span>
        </button>
      </ClientOnly>
    </div>

    <!-- 代码内容 -->
    <div class="relative">
      <pre 
        :class="[
          'overflow-x-auto text-sm leading-relaxed',
          filename || language 
            ? 'rounded-t-none border-t-0' 
            : 'rounded-lg',
          'bg-gray-900 text-gray-100 p-4'
        ]"
      ><code 
        :class="[language && `language-${language}`]" 
        v-html="highlightedCode"
      /></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  code: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: '',
  filename: '',
  highlights: () => [],
  meta: ''
})

// 生成唯一ID
const codeId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// 复制状态
const copySuccess = ref(false)

// 处理语言标识
const language = computed(() => {
  return props.language?.toLowerCase() || ''
})

// 处理高亮代码
const highlightedCode = computed(() => {
  // 如果是 mermaid，直接返回原始代码（虽然不会用到）
  if (language.value === 'mermaid') {
    return props.code
  }

  // 对于其他语言，使用 Nuxt Content 的内置高亮
  // 这里可以集成 Shiki 或其他高亮库
  return escapeHtml(props.code)
})

// HTML 转义函数
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// 复制功能
const copyCode = async () => {
  if (!process.client) return

  try {
    await navigator.clipboard.writeText(props.code)
    copySuccess.value = true
    
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
    // 降级复制方法
    fallbackCopy(props.code)
  }
}

// 降级复制方法
const fallbackCopy = (text: string) => {
  if (!process.client) return

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.select()
  
  try {
    const successful = document.execCommand('copy')
    if (successful) {
      copySuccess.value = true
      setTimeout(() => {
        copySuccess.value = false
      }, 2000)
    }
  } catch (error) {
    console.error('降级复制也失败:', error)
  }
  
  document.body.removeChild(textArea)
}
</script>

<style scoped>
.code-block-wrapper {
  @apply rounded-lg overflow-hidden border border-gray-700;
}

/* 代码块滚动条优化 */
pre {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

pre::-webkit-scrollbar {
  height: 6px;
}

pre::-webkit-scrollbar-track {
  background: transparent;
}

pre::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* 行号样式（如果需要） */
.line-numbers {
  counter-reset: linenumber;
}

.line-numbers .line {
  counter-increment: linenumber;
}

.line-numbers .line::before {
  content: counter(linenumber);
  @apply inline-block w-8 text-right text-gray-500 mr-4 select-none;
}

/* 高亮行样式 */
.highlighted-line {
  @apply bg-yellow-500/10 border-l-2 border-yellow-500;
}
</style>