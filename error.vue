<template>
    <NuxtLayout>
      <div class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center">
          <div class="mb-8">
            <h1 class="text-9xl font-bold text-gray-200 dark:text-gray-700">
              {{ error.statusCode }}
            </h1>
            <p class="text-2xl font-medium text-gray-900 dark:text-white mt-4">
              {{ errorTitle }}
            </p>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
              {{ errorMessage }}
            </p>
          </div>

          <div class="flex items-center justify-center gap-4">
            <UButton
              icon="i-heroicons-arrow-left"
              @click="goBack"
              color="gray"
              variant="outline"
            >
              返回上一页
            </UButton>
            <UButton
              icon="i-heroicons-home"
              to="/"
            >
              返回首页
            </UButton>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </template>

  <script setup lang="ts">
  interface Props {
    error: {
      statusCode: number
      statusMessage?: string
    }
  }

  const props = defineProps<Props>()
  const router = useRouter()

  const errorTitle = computed(() => {
    switch (props.error.statusCode) {
      case 404:
        return '页面未找到'
      case 403:
        return '访问被拒绝'
      case 500:
        return '服务器错误'
      default:
        return '出错了'
    }
  })

  const errorMessage = computed(() => {
    switch (props.error.statusCode) {
      case 404:
        return '抱歉，您访问的页面不存在'
      case 403:
        return '您没有权限访问此页面'
      case 500:
        return '服务器遇到了问题，请稍后再试'
      default:
        return props.error.statusMessage || '发生了未知错误'
    }
  })

  const goBack = () => {
    router.back()
  }
  </script>