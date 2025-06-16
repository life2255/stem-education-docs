<!-- components/AppBreadcrumb.vue -->
<template>
  <nav class="flex items-center space-x-2 text-sm" aria-label="面包屑导航">
    <ol class="flex items-center space-x-2">
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb._path" class="flex items-center">
        <!-- 分隔符 -->
        <UIcon
          v-if="index > 0"
          name="i-heroicons-chevron-right"
          class="w-4 h-4 text-gray-400 dark:text-gray-500 mx-2 flex-shrink-0"
        />

        <!-- 面包屑项 -->
        <div class="flex items-center">
          <NuxtLink
            v-if="index < breadcrumbs.length - 1"
            :to="crumb._path"
            class="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded px-1 py-0.5"
          >
            <UIcon
              v-if="index === 0"
              name="i-heroicons-home"
              class="w-4 h-4 flex-shrink-0"
            />
            <span>{{ crumb.title }}</span>
          </NuxtLink>

          <!-- 当前页面（不可点击） -->
          <div
            v-else
            class="flex items-center space-x-1 text-gray-900 dark:text-white font-medium"
          >
            <span>{{ crumb.title }}</span>
          </div>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const { getBreadcrumbs } = useNavigation()

// 生成面包屑数据
const { data: breadcrumbs } = await useAsyncData(
  `breadcrumbs-${route.path}`,
  () => getBreadcrumbs(route.path),
  {
    watch: [() => route.path]
  }
)

// 调试信息
if (process.dev) {
  watchEffect(() => {
    console.log('=== Breadcrumb Debug ===')
    console.log('Route path:', route.path)
    console.log('Breadcrumbs:', breadcrumbs.value)
  })
}
</script>