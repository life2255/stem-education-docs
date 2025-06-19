<!-- File: components/AppToc.vue -->
<template>
  <div class="space-y-4" v-if="shouldShowToc">
    <!-- 简化的目录标题 -->
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
        <UIcon name="i-heroicons-list-bullet" class="w-4 h-4 text-primary-600 dark:text-primary-400 mr-2" />
        目录
      </h3>
    </div>

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
          'block py-1.5 px-2 text-xs transition-all duration-200 rounded border-l-2 border-transparent hover:border-primary-300 dark:hover:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800',
          activeHeading === heading.id
            ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50',
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
  </div>
</template>

<script setup lang="ts">
interface TocHeading {
  id: string
  text: string
  depth: number
}

// 响应式数据
const headings = ref<TocHeading[]>([])
const activeHeading = ref<string>('')
const tocContainer = ref<HTMLElement>()
const activeHeadingRef = ref<HTMLElement>()

// 是否应该显示TOC - 基于实际内容决定
const shouldShowToc = computed(() => {
  // 至少要有2个标题才显示TOC，避免只有一个主标题的情况
  return headings.value.length >= 2
})

// 获取标题级别对应的样式类 - 更紧凑的间距
const getHeadingClass = (depth: number): string => {
  const classes = {
    1: 'text-xs font-semibold',
    2: 'text-xs ml-2',
    3: 'text-xs ml-4 opacity-90',
    4: 'text-xs ml-6 opacity-80',
    5: 'text-xs ml-8 opacity-70',
    6: 'text-xs ml-10 opacity-60'
  }
  return classes[depth as keyof typeof classes] || classes[6]
}

// 平滑滚动到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const headerHeight = 80 // 考虑固定头部的高度
    const elementPosition = element.offsetTop - headerHeight
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
    
    // 更新活跃标题
    activeHeading.value = id
  }
}

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 将活跃的标题滚动到可视区域
const scrollActiveHeadingIntoView = () => {
  if (activeHeadingRef.value && tocContainer.value) {
    const container = tocContainer.value
    const activeElement = activeHeadingRef.value as HTMLElement
    
    const containerRect = container.getBoundingClientRect()
    const activeRect = activeElement.getBoundingClientRect()
    
    // 计算相对于容器的位置
    const relativeTop = activeRect.top - containerRect.top + container.scrollTop
    const relativeBottom = relativeTop + activeRect.height
    
    // 容器的可视区域
    const containerTop = container.scrollTop
    const containerBottom = containerTop + container.clientHeight
    
    // 如果活跃元素不在可视区域内，则滚动容器
    if (relativeTop < containerTop + 40) {
      // 元素在可视区域上方，向上滚动
      container.scrollTo({
        top: relativeTop - 40,
        behavior: 'smooth'
      })
    } else if (relativeBottom > containerBottom - 40) {
      // 元素在可视区域下方，向下滚动
      container.scrollTo({
        top: relativeBottom - container.clientHeight + 40,
        behavior: 'smooth'
      })
    }
  }
}

// 解析页面标题 - 只解析文章内容区域
const parseHeadings = () => {
  // 只查找文章内容区域内的标题
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
    
    // 如果没有ID，自动生成一个
    if (!id && text) {
      // 生成ID：处理中文字符
      id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 保留中文、英文、数字、空格、连字符
        .replace(/\s+/g, '-') // 空格替换为连字符
        .trim()
      
      // 如果生成的ID为空，使用索引
      if (!id) {
        id = `heading-${index}`
      }
      
      // 设置ID到元素上
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
  console.log('解析到的文章标题:', newHeadings)
  console.log('是否显示TOC:', newHeadings.length >= 2)
}

// 计算活跃标题 - 只考虑文章内容区域
const updateActiveHeading = () => {
  const scrollTop = window.scrollY
  const articleContent = document.getElementById('article-content')
  
  if (!articleContent) {
    return
  }
  
  // 只获取文章内容区域内的标题元素
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
  
  // 如果没有找到合适的标题，且在页面顶部，清空活跃状态
  if (!newActiveHeading && scrollTop < 100) {
    newActiveHeading = ''
  }
  
  // 只有当活跃标题改变时才更新
  if (activeHeading.value !== newActiveHeading) {
    activeHeading.value = newActiveHeading
    
    // 延迟执行滚动，确保DOM已更新
    nextTick(() => {
      scrollActiveHeadingIntoView()
    })
  }
}

// 节流函数 - 更快的响应速度
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

// 节流后的滚动处理函数 - 减少延迟到50ms提高响应性
const throttledScrollHandler = throttle(updateActiveHeading, 50)

// 组件挂载时初始化
onMounted(() => {
  // 延迟解析，确保内容已渲染
  nextTick(() => {
    setTimeout(() => {
      parseHeadings()
      updateActiveHeading()
    }, 300) // 减少延迟时间
  })
  
  // 添加滚动监听
  window.addEventListener('scroll', throttledScrollHandler, { passive: true })
  
  // 监听文章内容区域的DOM变化，重新解析标题
  const observer = new MutationObserver(() => {
    setTimeout(parseHeadings, 100)
  })
  
  // 只监听文章内容区域的变化
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
})

// 监听路由变化，重新解析标题
const route = useRoute()
watch(() => route.path, () => {
  nextTick(() => {
    setTimeout(() => {
      parseHeadings()
      activeHeading.value = ''
    }, 300)
  })
})

// 监听活跃标题变化，自动滚动到可视区域
watch(activeHeading, () => {
  nextTick(() => {
    scrollActiveHeadingIntoView()
  })
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 优化滚动条样式 */
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

/* 活跃状态的特殊效果 */
.bg-primary-50 {
  position: relative;
}

.bg-primary-50::before {
  content: '';
  position: absolute;
  left: -2px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, rgb(59 130 246), rgb(37 99 235));
  border-radius: 1px;
}

.dark .bg-primary-900\/30::before {
  background: linear-gradient(to bottom, rgb(59 130 246), rgb(37 99 235));
}
</style>