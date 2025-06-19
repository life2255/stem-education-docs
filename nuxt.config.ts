// File: nuxt.config.ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // 模块配置
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss'
  ],

  // 静态生成配置
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  },

  // 解决中间件冲突的关键配置
  experimental: {
    // 方案一：完全禁用（推荐用于开发环境）
    appManifest: false
    
    // 方案二：启用但允许覆盖（推荐用于生产环境）
    // appManifest: true
  },

  // 内容配置
  content: {
    highlight: {
      theme: 'github-dark',
      preload: ['javascript', 'typescript', 'python', 'java', 'cpp']
    },
    markdown: {
      remarkPlugins: [],
      rehypePlugins: []
    }
  },

  // UI 配置
  ui: {
    icons: ['heroicons', 'simple-icons']
  },

  // 应用配置
  app: {
    head: {
      title: 'STEM 教育文档',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'STEM 教育文档网站 - 系统化的科学、技术、工程和数学学习资源' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Tailwind CSS 配置
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js'
  },

  // 开发服务器配置
  devServer: {
    port: 3000
  }

  // 备选方案：如果上面不行，尝试调整模块顺序
  // modules: [
  //   '@nuxtjs/tailwindcss',
  //   '@nuxt/content', 
  //   '@nuxt/ui'
  // ],
})