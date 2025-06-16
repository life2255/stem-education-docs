<template>
  <footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div class="stem-container py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 关于 -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            关于本站
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            STEM 教育文档网站致力于提供高质量的科学、技术、工程和数学学习资源，帮助学生和教育工作者更好地理解和掌握 STEM 知识。
          </p>
        </div>

        <!-- 学科导航 -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            学科导航
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/physics" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                物理学
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/chemistry" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                化学
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/biology" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                生物学
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/mathematics" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                数学
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 资源 -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            资源
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                学习路径
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                练习题库
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                教学资源
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                参考文献
              </a>
            </li>
          </ul>
        </div>

        <!-- 联系方式 -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            联系我们
          </h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li class="flex items-center">
              <UIcon name="i-heroicons-envelope" class="w-4 h-4 mr-2" />
              contact@stem-docs.com
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-academic-cap" class="w-4 h-4 mr-2" />
              教育合作咨询
            </li>
          </ul>

          <!-- 社交媒体 -->
          <div class="mt-4 flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <UIcon name="i-simple-icons-github" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <UIcon name="i-simple-icons-twitter" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <UIcon name="i-simple-icons-youtube" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-center text-gray-500 dark:text-gray-400">
          © {{ currentYear }} STEM 教育文档网站. 保留所有权利.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>