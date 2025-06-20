// File: nuxt.config.ts
// 更新配置以更好地支持中文路径
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // [最终策略]
  hooks: {
    // 只保留策略一: 在源头确保内容ID的Unicode标准化 (NFC)，这是一个好习惯。
    'content:file:beforeParse': (file) => {
      if (file._id) {
        file._id = file._id.normalize('NFC')
      }
    }
  },

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

  // 解决中间件冲突
  experimental: {
    appManifest: false
  },

  // 内容配置
  content: {
    documentDriven: false,
    markdown: {
      remarkPlugins: [],
      rehypePlugins: []
    },
    highlight: {
      theme: 'github-dark',
      preload: ['javascript', 'typescript', 'python', 'java', 'cpp', 'vue', 'markdown']
    },
    navigation: {
      fields: ['title', 'description', 'difficulty', 'order', 'icon']
    },
    experimental: {
      clientDB: true
    }
  },

  // 路由配置
  router: {
    options: {
      strict: false
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
  },

  // Vite 配置
  vite: {
    fs: {
      strict: false
    }
  }
})
