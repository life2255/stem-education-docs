<!-- File: pages/index.vue -->
<template>
  <div class="relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- 动态渐变背景 -->
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary-400/20 to-blue-400/20 blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-green-400/10 to-cyan-400/10 blur-3xl animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <!-- Hero 区域 -->
    <section class="relative min-h-[80vh] flex items-center justify-center">
      <!-- 背景网格 -->
      <div class="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      
      <div class="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <!-- 主标题区域 -->
        <div class="space-y-8 animate-fade-in-up">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">🚀 现代化 STEM 学习平台</span>
          </div>

          <!-- 主标题 -->
          <h1 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 leading-tight">
            探索科学
            <br>
            <span class="text-4xl md:text-6xl">无限可能</span>
          </h1>

          <!-- 副标题 -->
          <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            系统化的科学、技术、工程和数学学习资源
            <br>
            <span class="text-lg text-gray-500 dark:text-gray-400">为学生和教育工作者提供高质量的 STEM 教育内容</span>
          </p>

          <!-- CTA 按钮 -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <UButton 
              size="xl" 
              to="/physics" 
              icon="i-heroicons-rocket-launch"
              class="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
            >
              开始学习之旅
            </UButton>
            <UButton 
              size="xl" 
              color="white" 
              variant="solid" 
              icon="i-heroicons-magnifying-glass" 
              @click="openSearch"
              class="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20"
            >
              探索内容
            </UButton>
          </div>
        </div>

        <!-- 统计数据 -->
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up" style="animation-delay: 0.5s;">
          <div v-for="stat in stats" :key="stat.label" class="text-center group">
            <div class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              {{ stat.value }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 学科入口卡片 -->
    <section class="relative py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- 区域标题 -->
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            学科<span class="text-primary-600 dark:text-primary-400">导航</span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            选择您感兴趣的学科领域，开始您的学习探索
          </p>
        </div>

        <!-- 学科卡片网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <NuxtLink
            v-for="(subject, index) in subjects"
            :key="subject.id"
            :to="`/${subject.id}`"
            class="group relative overflow-hidden rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-700/20 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                 :class="subject.gradient"></div>
            
            <!-- 卡片内容 -->
            <div class="relative p-8 text-center">
              <!-- 图标容器 -->
              <div class="relative mb-6">
                <div :class="[
                  'w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3',
                  subject.bgColor
                ]">
                  <UIcon :name="subject.icon" class="w-10 h-10" :class="subject.iconColor" />
                </div>
                <!-- 光环效果 -->
                <div class="absolute inset-0 w-20 h-20 mx-auto rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-ping"
                     :class="subject.bgColor"></div>
              </div>

              <!-- 文字内容 -->
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {{ subject.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {{ subject.description }}
              </p>

              <!-- 进入按钮 -->
              <div class="flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
                <span>探索学习</span>
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>

            <!-- 数量徽章 -->
            <div class="absolute top-4 right-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 border border-white/30 dark:border-gray-700/30">
              {{ subject.count }}+ 内容
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 特色功能展示 -->
    <section class="relative py-20 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 区域标题 -->
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            平台<span class="text-primary-600 dark:text-primary-400">特色</span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            现代化的学习体验，助力您的知识探索之旅
          </p>
        </div>

        <!-- 特色功能网格 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="(feature, index) in features" 
            :key="feature.title"
            class="group relative p-8 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/30 dark:border-gray-700/30 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="relative">
              <!-- 图标 -->
              <div :class="[
                'w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110',
                feature.bgColor
              ]">
                <UIcon :name="feature.icon" class="w-8 h-8" :class="feature.iconColor" />
              </div>

              <!-- 内容 -->
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {{ feature.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新内容 -->
    <section class="relative py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- 区域标题 -->
        <div class="flex items-center justify-between mb-12 animate-fade-in-up">
          <div>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              最新<span class="text-primary-600 dark:text-primary-400">内容</span>
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              探索最新添加的学习资源
            </p>
          </div>
          <UButton 
            color="gray" 
            variant="outline" 
            icon="i-heroicons-arrow-right" 
            trailing
            class="hidden sm:flex hover:scale-105 transition-transform duration-300"
          >
            查看全部
          </UButton>
        </div>

        <!-- 最新内容网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ContentList :query="recentQuery" v-slot="{ list }">
            <article
              v-for="(article, index) in list"
              :key="article._path"
              class="group relative overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-700/20 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in-up"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <!-- 背景装饰 -->
              <div class="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-transparent dark:from-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div class="relative p-6">
                <!-- 元信息 -->
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span class="px-2 py-1 rounded-lg bg-white/50 dark:bg-gray-700/50 font-medium">
                    {{ getSubjectName(article._path) }}
                  </span>
                  <span>·</span>
                  <span>{{ formatDate(article.createdAt) }}</span>
                </div>

                <!-- 标题 -->
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2">
                  <NuxtLink :to="article._path">
                    {{ article.title }}
                  </NuxtLink>
                </h3>

                <!-- 描述 -->
                <p class="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                  {{ article.description }}
                </p>

                <!-- 底部信息 -->
                <div class="flex items-center justify-between">
                  <span
                    v-if="article.difficulty"
                    class="px-3 py-1 text-xs rounded-full font-medium"
                    :class="{
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': article.difficulty === 'beginner',
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': article.difficulty === 'intermediate',
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': article.difficulty === 'advanced'
                    }"
                  >
                    {{ difficultyLabels[article.difficulty] }}
                  </span>
                  
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
                    <span>{{ article.readingTime || '5 分钟' }}</span>
                  </div>
                </div>

                <!-- 阅读按钮 -->
                <NuxtLink 
                  :to="article._path"
                  class="absolute inset-0 z-10"
                  aria-label="阅读文章"
                />
              </div>
            </article>
          </ContentList>
        </div>

        <!-- 移动端查看全部按钮 -->
        <div class="text-center mt-12 sm:hidden">
          <UButton 
            color="gray" 
            variant="outline" 
            icon="i-heroicons-arrow-right" 
            trailing
            class="hover:scale-105 transition-transform duration-300"
          >
            查看全部内容
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 搜索组件
const isSearchOpen = ref(false)
const openSearch = () => {
  isSearchOpen.value = true
}

// 统计数据
const stats = [
  { value: '4+', label: '学科领域' },
  { value: '50+', label: '学习内容' },
  { value: '1000+', label: '知识点' },
  { value: '24/7', label: '在线学习' }
]

// 学科配置
const subjects = [
  {
    id: 'physics',
    name: '物理学',
    icon: 'i-heroicons-bolt',
    description: '探索物质运动规律和自然现象的本质，从经典力学到量子物理',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-400 to-cyan-400',
    count: 25
  },
  {
    id: 'chemistry',
    name: '化学',
    icon: 'i-heroicons-beaker',
    description: '研究物质的组成、性质和变化规律，揭示分子世界的奥秘',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    gradient: 'from-green-400 to-emerald-400',
    count: 18
  },
  {
    id: 'biology',
    name: '生物学',
    icon: 'i-heroicons-heart',
    description: '探索生命的奥秘和生物世界的多样性，从细胞到生态系统',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-400 to-pink-400',
    count: 22
  },
  {
    id: 'mathematics',
    name: '数学',
    icon: 'i-heroicons-calculator',
    description: '逻辑推理和抽象思维的基础学科，数字和公式的美妙世界',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-400 to-red-400',
    count: 30
  }
]

// 特色功能
const features = [
  {
    title: '系统化内容',
    description: '清晰的知识体系，从基础到进阶，循序渐进的学习路径让您轻松掌握复杂概念',
    icon: 'i-heroicons-academic-cap',
    bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    iconColor: 'text-primary-600 dark:text-primary-400'
  },
  {
    title: '互动体验',
    description: '支持数学公式、代码高亮、可视化图表等丰富的内容展示，让学习更加生动有趣',
    icon: 'i-heroicons-sparkles',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    title: '随时随地',
    description: '完美适配各种设备的响应式设计，让您在任何时间、任何地点都能享受学习的乐趣',
    icon: 'i-heroicons-device-phone-mobile',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400'
  }
]

// 难度标签
const difficultyLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
}

// 最新内容查询
const recentQuery = {
  path: '/',
  where: [{ _path: { $ne: '/index' } }],
  limit: 6,
  sort: [{ createdAt: -1 }]
}

// 获取学科名称
const getSubjectName = (path: string) => {
  const subject = path.split('/')[1]
  return subjects.find(s => s.id === subject)?.name || subject
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '最近更新'
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
/* 动画定义 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

/* 背景网格图案 */
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.dark .bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

/* 文本裁剪 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 毛玻璃效果优化 */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* 渐变文字 */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* 悬停效果优化 */
.group:hover .animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* 响应式优化 */
@media (max-width: 640px) {
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .text-7xl {
    font-size: 3.5rem;
  }
}

/* 性能优化 */
.transform {
  transform: translateZ(0);
  will-change: transform;
}
</style>