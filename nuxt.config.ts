// File: nuxt.config.ts
// 🎯 KaTeX 方案：服务端渲染，性能最佳，无客户端问题
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  extends: [
    '@d0rich/nuxt-content-mermaid'
  ],

  hooks: {
    'content:file:beforeParse': (file) => {
      if (file._id) {
        file._id = file._id.normalize('NFC')
      }
    }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss'
  ],

  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  },

  experimental: {
    appManifest: false
  },

  // 🔧 关键配置：使用 KaTeX 服务端渲染
  content: {
    documentDriven: false,
    markdown: {
      remarkPlugins: ['remark-math'],
      rehypePlugins: ['rehype-katex'], // 服务端渲染数学公式
    },
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      },
      preload: ['javascript', 'typescript', 'python', 'java', 'cpp', 'vue', 'markdown', 'mermaid']
    },
    navigation: {
      fields: ['title', 'description', 'difficulty', 'order', 'icon']
    },
    experimental: {
      clientDB: true
    }
  },

  router: {
    options: {
      strict: false
    }
  },

  ui: {
    icons: ['heroicons', 'simple-icons']
  },

  // 🎨 只需要加载 KaTeX CSS，无需 JavaScript
  app: {
    head: {
      title: 'STEM 教育文档',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'STEM 教育文档网站 - 系统化的科学、技术、工程和数学学习资源' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // 🔗 KaTeX CSS - 唯一需要的外部资源
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
          integrity: 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
          crossorigin: 'anonymous'
        }
      ]
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js'
  },

  devServer: {
    port: 3000
  },

  vite: {
    fs: {
      strict: false
    }
  }
})