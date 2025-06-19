<!-- File: components/AppToc.vue -->
<template>
  <div class="space-y-6">
    <!-- 目录标题 -->
    <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2 mb-2">
        <div class="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center">
          <UIcon name="i-heroicons-list-bullet" class="w-3 h-3 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">目录</h3>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400">点击跳转到对应章节</p>
    </div>

    <!-- 目录列表 -->
    <nav class="space-y-1" v-if="headings.length > 0">
      <a
        v-for="heading in headings"
        :key="heading.id"
        :href="`#${heading.id}`"
        @click.prevent="scrollToHeading(heading.id)"
        :class="[
          'block py-2 px-3 text-sm transition-all duration-200 rounded-lg border-l-2 border-transparent hover:border-primary-300 dark:hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
          activeHeading === heading.id
            ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50',
          getHeadingClass(heading.depth)
        ]"
      >
        <span class="line-clamp-2">{{ heading.text }}</span>
      </a>
    </nav>

    <!-- 空状态 -->
    <div v-else class="text-center py-8">
      <UIcon 
        name="i-heroicons-document-text" 
        class="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2"
      />
      <p class="text-sm text-gray-500 dark:text-gray-400">暂无目录</p>
    </div>

    <!-- 阅读进度 -->
    <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>阅读进度</span>
        <span>{{ Math.round(scrollProgress) }}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div 
          class="bg-primary-600 h-1.5 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${scrollProgress}%` }"
        />
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
      <UButton
        variant="outline"
        color="gray"
        size="xs"
        block
        icon="i-heroicons-arrow-up"
        label="回到顶部"
        @click="scrollToTop"
      />
      <UButton
        variant="outline"
        color="gray"
        size="xs"
        block
        icon="i-heroicons-printer"
        label="打印页面"
        @click="printPage"
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
const scrollProgress = ref(0)

// 获取标题级别对应的样式类
const getHeadingClass = (depth: number): string => {
  const classes = {
    1: 'text-base font-semibold',
    2: 'text-sm ml-2',
    3: 'text-sm ml-4 text-gray-500 dark:text-gray-400',
    4: 'text-xs ml-6 text-gray-500 dark:text-gray-400',
    5: 'text-xs ml-8 text-gray-400 dark:text-gray-500',
    6: 'text-xs ml-10 text-gray-400 dark:text-gray-500'
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

// 打印页面
const printPage = () => {
  window.print()
}

// 解析页面标题
const parseHeadings = () => {
  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
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
  console.log('解析到的标题:', newHeadings)
}

// 计算滚动进度和活跃标题
const updateScrollState = () => {
  const scrollTop = window.scrollY
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight
  
  // 更新滚动进度
  scrollProgress.value = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0
  
  // 更新活跃标题
  const headingElements = headings.value.map(h => document.getElementById(h.id)).filter(Boolean)
  const headerHeight = 100
  
  for (let i = headingElements.length - 1; i >= 0; i--) {
    const element = headingElements[i]
    if (element && element.offsetTop <= scrollTop + headerHeight) {
      const headingId = element.id
      if (activeHeading.value !== headingId) {
        activeHeading.value = headingId
      }
      break
    }
  }
  
  // 如果没有找到合适的标题，清空活跃状态
  if (scrollTop < 100) {
    activeHeading.value = ''
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

// 节流后的滚动处理函数
const throttledScrollHandler = throttle(updateScrollState, 100)

// 组件挂载时初始化
onMounted(() => {
  // 延迟解析，确保内容已渲染
  nextTick(() => {
    setTimeout(() => {
      parseHeadings()
      updateScrollState()
    }, 500)
  })
  
  // 添加滚动监听
  window.addEventListener('scroll', throttledScrollHandler, { passive: true })
  
  // 监听DOM变化，重新解析标题
  const observer = new MutationObserver(() => {
    setTimeout(parseHeadings, 100)
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
  
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
      scrollProgress.value = 0
    }, 500)
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 平滑的进度条动画 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
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