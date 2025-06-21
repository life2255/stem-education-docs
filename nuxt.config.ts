// File: nuxt.config.ts
// 修正版本：移除有问题的模块，使用自定义 Mermaid 组件

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // ❌ 移除有问题的第三方模块
  // extends: [
  //   '@d0rich/nuxt-content-mermaid'  // 移除这行
  // ],

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
    appManifest: false,
    // 🔧 添加这些优化，减少序列化问题
    payloadExtraction: false,
    clientNodeCompat: false
  },

  // 🔧 KaTeX 配置保持不变
  content: {
    documentDriven: false,
    markdown: {
      remarkPlugins: ['remark-math'],
      rehypePlugins: [
        [
          'rehype-katex',
          {
            output: 'html',
            throwOnError: false,
            strict: false,
            trust: false,
            displayMode: false,
            macros: {
              "'": "'"
            }
          }
        ]
      ]
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

  // 🛡️ Vue 编译器配置保持不变
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => {
        const mathmlTags = [
          'math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac',
          'msqrt', 'mroot', 'mtext', 'annotation', 'semantics',
          'mtable', 'mtr', 'mtd', 'munder', 'mover', 'munderover',
          'mfenced', 'menclose', 'mspace', 'mpadded', 'mphantom',
          'maligngroup', 'malignmark', 'mlongdiv', 'mscarries',
          'mscarry', 'msgroup', 'msline', 'msrow', 'mstack',
          'maction', 'merror', 'mstyle'
        ]
        return mathmlTags.includes(tag.toLowerCase())
      }
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
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
          integrity: 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
          crossorigin: 'anonymous'
        }
      ]
    }
  },

  // 🔧 确保 Mermaid 在 SSR 中正确处理
  ssr: {
    noExternal: ['rehype-katex', 'katex', 'mermaid']
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
    },
    optimizeDeps: {
      include: ['katex', 'mermaid']
    },
    // 🔧 确保 Mermaid 正确处理
    define: {
      global: 'globalThis'
    }
  }
})