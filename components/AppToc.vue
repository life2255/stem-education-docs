<!-- File: components/AppToc.vue -->
<!-- 重构版本：严格遵循客户端边界原则 -->
<template>
  <div class="space-y-4" v-if="shouldShowToc">
    <!-- 简化的目录标题 -->
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
        目录
      </h3>
    </div>

    <!-- ✅ 使用 ClientOnly 包装所有 DOM 依赖的内容 -->
    <ClientOnly>
      <!-- 目录列表 -->
      <nav 
        ref="tocContainer"
        class="space-y-0.5 max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        <a
          v-for="heading in headings"
          :key="heading.id"
          :ref="el => { if (activeHeading === heading.id) activeHeadingRef = el }"
          :href="`#${heading.id}`"
          @click.prevent="scrollToHeading(heading.id)"
          :class="[
            'block py-1.5 px-2 text-sm transition-colors duration-200',
            activeHeading === heading.id
              ? 'text-green-600 dark:text-green-400 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400',
            getHeadingClass(heading.depth)
          ]"
        >
          <span class="line-clamp-3 leading-tight">{{ heading.text }}</span>
        </a>
      </nav>

      <!-- 简化的快捷操作 -->
      <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
        <UButton
          variant="outline"
          color="gray"
          size="xs"
          block
          icon="i-heroicons-arrow-up"
          label="回到顶部"
          @click="scrollToTop"
        />
      </div>

      <!-- 加载状态模板 -->
      <template #fallback>
        <div class="space-y-2 animate-pulse">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
interface TocHeading {
  id: string
  text: string
  depth: number
}

// ❌ 原代码问题：大量 DOM 操作在服务端也会执行
// ✅ 新方案：使用响应式数据 + ClientOnly + onMounted

// 响应式数据
const headings = ref<TocHeading[]>([])
const activeHeading = ref<string>('')
const tocContainer = ref<HTMLElement>()
const activeHeadingRef = ref<HTMLElement>()

// 计算属性（安全，不涉及 DOM）
const shouldShowToc = computed(() => {
  return headings.value.length >= 2
})

// 获取标题级别对应的样式类
const getHeadingClass = (depth: number): string => {
  const classes = {
    1: 'text-sm font-semibold',
    2: 'text-sm ml-2',
    3: 'text-sm ml-4',
    4: 'text-sm ml-6',
    5: 'text-sm ml-8',
    6: 'text-sm ml-10'
  }
  return classes[depth as keyof typeof classes] || classes[6]
}

// ✅ 所有 DOM 操作都在 onMounted 中执行
onMounted(async () => {
  // 确保在客户端环境
  if (!process.client) return

  // 动态初始化 TOC 功能
  const { initializeToc } = await initializeTocFeatures()
  
  // 延迟执行，确保内容已渲染
  setTimeout(() => {
    initializeToc()
  }, 500)
})

// ✅ 将所有 DOM 相关逻辑封装为异步函数
const initializeTocFeatures = async () => {
  
  // 解析页面标题
  const parseHeadings = () => {
    const articleContent = document.getElementById('article-content')
    if (!articleContent) {
      console.log('未找到文章内容区域')
      headings.value = []
      return
    }
    
    const headingElements = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const newHeadings: TocHeading[] = []
    
    headingElements.forEach((el, index) => {
      let id = el.id
      let text = el.textContent?.trim() || ''
      
      if (!id && text) {
        id = text
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim()
        
        if (!id) {
          id = `heading-${index}`
        }
        
        el.id = id
      }
      
      if (id && text) {
        newHeadings.push({
          id: id,
          text: text,
          depth: parseInt(el.tagName.substring(1))
        })
      }
    })
    
    headings.value = newHeadings
  }

  // 计算活跃标题
  const updateActiveHeading = () => {
    const scrollTop = window.scrollY
    const articleContent = document.getElementById('article-content')
    
    if (!articleContent) return
    
    const headingElements = headings.value
      .map(h => articleContent.querySelector(`#${h.id}`))
      .filter(Boolean) as HTMLElement[]
      
    const headerHeight = 100
    let newActiveHeading = ''
    
    for (let i = headingElements.length - 1; i >= 0; i--) {
      const element = headingElements[i]
      if (element && element.offsetTop <= scrollTop + headerHeight) {
        newActiveHeading = element.id
        break
      }
    }
    
    if (!newActiveHeading && scrollTop < 100) {
      newActiveHeading = ''
    }
    
    if (activeHeading.value !== newActiveHeading) {
      activeHeading.value = newActiveHeading
      nextTick(() => {
        scrollActiveHeadingIntoView()
      })
    }
  }

  // 滚动活跃标题到可视区域
  const scrollActiveHeadingIntoView = () => {
    if (activeHeadingRef.value && tocContainer.value) {
      const container = tocContainer.value
      const activeElement = activeHeadingRef.value as HTMLElement
      
      const containerRect = container.getBoundingClientRect()
      const activeRect = activeElement.getBoundingClientRect()
      
      const relativeTop = activeRect.top - containerRect.top + container.scrollTop
      const relativeBottom = relativeTop + activeRect.height
      
      const containerTop = container.scrollTop
      const containerBottom = containerTop + container.clientHeight
      
      if (relativeTop < containerTop + 40) {
        container.scrollTo({
          top: relativeTop - 40,
          behavior: 'smooth'
        })
      } else if (relativeBottom > containerBottom - 40) {
        container.scrollTo({
          top: relativeBottom - container.clientHeight + 40,
          behavior: 'smooth'
        })
      }
    }
  }

  // 节流函数
  const throttle = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null
    let lastExecTime = 0
    
    return (...args: any[]) => {
      const currentTime = Date.now()
      
      if (currentTime - lastExecTime > delay) {
        func(...args)
        lastExecTime = currentTime
      } else {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func(...args)
          lastExecTime = Date.now()
        }, delay - (currentTime - lastExecTime))
      }
    }
  }

  const throttledScrollHandler = throttle(updateActiveHeading, 50)

  // 初始化函数
  const initializeToc = () => {
    parseHeadings()
    updateActiveHeading()
    
    // 添加滚动监听
    window.addEventListener('scroll', throttledScrollHandler, { passive: true })
    
    // 监听DOM变化
    const observer = new MutationObserver(() => {
      setTimeout(parseHeadings, 100)
    })
    
    const articleContent = document.getElementById('article-content')
    if (articleContent) {
      observer.observe(articleContent, {
        childList: true,
        subtree: true
      })
    }
    
    // 清理函数
    onUnmounted(() => {
      window.removeEventListener('scroll', throttledScrollHandler)
      observer.disconnect()
    })
  }

  return { initializeToc }
}

// ✅ 安全的客户端操作函数
const scrollToHeading = (id: string) => {
  if (!process.client) return
  
  const element = document.getElementById(id)
  if (element) {
    const headerHeight = 80
    const elementPosition = element.offsetTop - headerHeight
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
    
    activeHeading.value = id
  }
}

const scrollToTop = () => {
  if (!process.client) return
  
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听路由变化
const route = useRoute()
watch(() => route.path, () => {
  if (process.client) {
    nextTick(() => {
      setTimeout(() => {
        headings.value = []
        activeHeading.value = ''
        // 重新初始化
        const articleContent = document.getElementById('article-content')
        if (articleContent) {
          initializeTocFeatures().then(({ initializeToc }) => {
            initializeToc()
          })
        }
      }, 300)
    })
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 2px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}
</style>