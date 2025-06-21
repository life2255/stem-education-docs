// File: nuxt.config.ts
// 安全优化版本：只修改性能关键点，避免破坏性改动

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

  // ✅ 保持原有模块配置，不做改动
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

  // 🔧 关键优化：KaTeX 配置保持不变
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
      // 🚀 关键优化1：减少语法高亮预加载 (从8种减少到3种)
      preload: ['javascript', 'typescript', 'vue']
      // 原来：['javascript', 'typescript', 'python', 'java', 'cpp', 'vue', 'markdown', 'mermaid']
    },
    navigation: {
      fields: ['title', 'description', 'difficulty', 'order', 'icon']
    },
    // 🚀 关键优化2：启用实验性缓存功能
    experimental: {
      clientDB: true,
      // 新增：启用内容缓存
      cacheContents: true,
      stripQueryParameters: true
    }
  },

  // ✅ Vue 配置保持不变
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

  // ✅ 保持原有 app 配置
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

  ssr: {
    noExternal: ['rehype-katex', 'katex']
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
    // 🚀 关键优化3：依赖预构建
    optimizeDeps: {
      include: ['katex']
    }
  }
})