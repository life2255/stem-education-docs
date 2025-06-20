// File: nuxt.config.ts
// 🎯 这就是我说的简化配置！只用 remark-math + 客户端处理
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

  // 🔧 关键：只用 remark-math，不用 rehype-mathjax
  content: {
    documentDriven: false,
    markdown: {
      remarkPlugins: ['remark-math'], // 只解析，不渲染
      // 去掉 rehype-mathjax，让客户端处理
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

  // 🚀 客户端加载 MathJax
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
      ],
      script: [
        {
          innerHTML: `
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                packages: {'[+]': ['base', 'ams', 'autoload', 'require', 'newcommand']},
                processEscapes: true
              },
              svg: {
                fontCache: 'global'
              },
              startup: {
                typeset: false // 手动控制渲染时机
              }
            };
          `,
          type: 'text/javascript'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js',
          async: true
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