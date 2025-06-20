// File: nuxt.config.ts
// 最终修复版本：彻底解决 KaTeX MathML 组件错误

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

  // 🔧 关键修复：KaTeX 配置，完全避免 MathML
  content: {
    documentDriven: false,
    markdown: {
      remarkPlugins: ['remark-math'],
      rehypePlugins: [
        [
          'rehype-katex',
          {
            // 🎯 关键设置：只输出 HTML，完全禁用 MathML
            output: 'html',
            
            // 其他安全设置
            throwOnError: false,
            strict: false,
            trust: false,
            
            // 确保不生成任何 MathML 相关内容
            displayMode: false,
            
            // 修复智能引号问题
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

  // 🛡️ Vue 编译器配置：防止 MathML 标签被解析为组件
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => {
        // 将所有 MathML 标签标记为自定义元素，不解析为 Vue 组件
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

  // 🎨 KaTeX CSS 加载
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

  // 🔧 修复序列化问题
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
    // 🛡️ 确保 KaTeX 正确处理
    optimizeDeps: {
      include: ['katex']
    }
  }
})