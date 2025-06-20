// File: nuxt.config.ts
// 更新配置以更好地支持中文路径
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

  // 解决中间件冲突
  experimental: {
    appManifest: false
  },

  // 内容配置 - 关键更新
  content: {
    // 文档驱动配置
    documentDriven: false, // 关闭文档驱动模式，使用自定义路由
    
    // Markdown 配置
    markdown: {
      remarkPlugins: [],
      rehypePlugins: []
    },
    
    // 高亮配置
    highlight: {
      theme: 'github-dark',
      preload: ['javascript', 'typescript', 'python', 'java', 'cpp', 'vue', 'markdown']
    },
    
    // 导航配置
    navigation: {
      fields: ['title', 'description', 'difficulty', 'order', 'icon']
    },
    
    // 关键：禁用路径的自动 slugify
    experimental: {
      clientDB: true
    }
  },

  // 路由配置
  router: {
    options: {
      strict: false // 允许更灵活的路由匹配
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

  // Vite 配置 - 确保正确处理中文文件名
  vite: {
    fs: {
      strict: false // 允许访问项目外的文件
    }
  }
})