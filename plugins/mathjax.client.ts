// File: plugins/mathjax.client.ts
export default defineNuxtPlugin(() => {
  if (process.client) {
    // 等待 MathJax 加载完成
    const initMathJax = () => {
      if (window.MathJax && window.MathJax.startup) {
        // MathJax 已加载，设置路由监听
        const router = useRouter()
        
        router.afterEach((to) => {
          // 延迟重新渲染数学公式
          nextTick(() => {
            setTimeout(() => {
              if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise()
                  .then(() => {
                    console.log('MathJax 重新渲染完成:', to.path)
                    optimizeMathDisplay()
                  })
                  .catch((err: Error) => {
                    console.warn('MathJax 渲染错误:', err)
                  })
              }
            }, 100)
          })
        })

        // 初始渲染
        setTimeout(() => {
          if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise().then(() => {
              optimizeMathDisplay()
            })
          }
        }, 500)
      }
    }

    // 检查 MathJax 是否已加载
    if (window.MathJax) {
      initMathJax()
    } else {
      // 等待 MathJax 加载
      const checkMathJax = setInterval(() => {
        if (window.MathJax && window.MathJax.startup) {
          clearInterval(checkMathJax)
          initMathJax()
        }
      }, 100)

      // 最多等待 10 秒
      setTimeout(() => {
        clearInterval(checkMathJax)
        if (!window.MathJax) {
          console.warn('MathJax 加载超时')
        }
      }, 10000)
    }
  }
})

// 优化数学公式显示
function optimizeMathDisplay() {
  if (typeof window === 'undefined') return

  try {
    // 为数学公式添加自定义样式
    const style = document.createElement('style')
    style.textContent = `
      /* MathJax 3 优化样式 */
      .MathJax {
        font-size: 1.1em !important;
        line-height: 1.4 !important;
      }
      
      /* 块级公式 */
      .MathJax_Display {
        margin: 1.5rem 0 !important;
        text-align: center !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
      }
      
      /* 行内公式 */
      .MathJax[style*="display: inline"] {
        margin: 0 0.2em !important;
      }
      
      /* 响应式数学公式 */
      @media (max-width: 640px) {
        .MathJax {
          font-size: 0.95em !important;
        }
        
        .MathJax_Display {
          margin: 1rem 0 !important;
          font-size: 0.9em !important;
        }
      }
      
      /* 暗色模式支持 */
      .dark .MathJax svg {
        color: rgb(229 231 235) !important;
      }
      
      .dark .MathJax svg text {
        fill: rgb(229 231 235) !important;
      }
      
      .dark .MathJax svg path {
        stroke: rgb(229 231 235) !important;
      }
      
      /* 滚动条样式 */
      .MathJax_Display::-webkit-scrollbar {
        height: 4px;
      }
      
      .MathJax_Display::-webkit-scrollbar-track {
        background: rgb(243 244 246);
      }
      
      .MathJax_Display::-webkit-scrollbar-thumb {
        background: rgb(156 163 175);
        border-radius: 2px;
      }
      
      .dark .MathJax_Display::-webkit-scrollbar-track {
        background: rgb(31 41 55);
      }
      
      .dark .MathJax_Display::-webkit-scrollbar-thumb {
        background: rgb(75 85 99);
      }
      
      /* 防止公式被选中时的样式问题 */
      .MathJax svg {
        max-width: 100% !important;
        height: auto !important;
      }
      
      /* 提高可访问性 */
      .MathJax[aria-label] {
        cursor: help;
      }
      
      /* 错误显示优化 */
      .MathJax_Error {
        color: rgb(220 38 38) !important;
        background: rgb(254 242 242) !important;
        padding: 0.25rem 0.5rem !important;
        border-radius: 0.25rem !important;
        font-size: 0.875rem !important;
      }
      
      .dark .MathJax_Error {
        color: rgb(248 113 113) !important;
        background: rgb(127 29 29) !important;
      }
    `
    
    // 只添加一次样式
    if (!document.querySelector('style[data-mathjax-styles]')) {
      style.setAttribute('data-mathjax-styles', 'true')
      document.head.appendChild(style)
    }

    // 添加可访问性支持
    const mathElements = document.querySelectorAll('.MathJax')
    mathElements.forEach((element) => {
      // 确保数学公式有合适的 aria 标签
      if (!element.getAttribute('aria-label') && element.getAttribute('title')) {
        element.setAttribute('aria-label', `数学公式: ${element.getAttribute('title')}`)
      }
      
      // 添加键盘导航支持
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0')
      }
    })

    // 处理大型公式的响应式显示
    const displayMath = document.querySelectorAll('.MathJax_Display')
    displayMath.forEach((element) => {
      const mathElement = element as HTMLElement
      if (mathElement.scrollWidth > mathElement.clientWidth) {
        mathElement.style.textAlign = 'left'
        mathElement.style.paddingLeft = '1rem'
      }
    })

  } catch (error) {
    console.warn('MathJax 显示优化出现问题:', error)
  }
}

// 全局类型声明
declare global {
  interface Window {
    MathJax: {
      typesetPromise: () => Promise<void>
      startup: any
      tex2jax?: any
      Hub?: any
    }
  }
}