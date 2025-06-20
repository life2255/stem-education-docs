// File: plugins/mathjax.client.ts
// 简化的 MathJax 客户端插件 - 处理 remark-math 生成的代码块

export default defineNuxtPlugin(() => {
  const router = useRouter()

  // 等待 MathJax 加载
  const waitForMathJax = (): Promise<any> => {
    return new Promise((resolve) => {
      const check = () => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          resolve(window.MathJax)
        } else {
          setTimeout(check, 100)
        }
      }
      check()
    })
  }

  // 处理页面中的数学代码块
  const processMathBlocks = async () => {
    try {
      const MathJax = await waitForMathJax()
      
      // 查找所有数学代码块
      const mathInline = document.querySelectorAll('code.language-math.math-inline')
      const mathDisplay = document.querySelectorAll('pre code.language-math.math-display')
      
      console.log(`发现 ${mathInline.length} 个行内公式，${mathDisplay.length} 个块级公式`)
      
      // 处理行内数学
      mathInline.forEach(element => {
        const math = element.textContent || ''
        const span = document.createElement('span')
        span.innerHTML = `$${math}$`
        element.parentNode?.replaceChild(span, element)
      })
      
      // 处理块级数学
      mathDisplay.forEach(element => {
        const math = element.textContent || ''
        const div = document.createElement('div')
        div.innerHTML = `$$${math}$$`
        div.style.textAlign = 'center'
        div.style.margin = '1rem 0'
        element.closest('pre')?.parentNode?.replaceChild(div, element.closest('pre')!)
      })
      
      // 重新渲染 MathJax
      await MathJax.typesetPromise()
      console.log('✅ MathJax 渲染完成')
      
    } catch (error) {
      console.warn('⚠️ MathJax 处理失败:', error)
    }
  }

  // 首次加载时处理
  onMounted(() => {
    nextTick(() => {
      setTimeout(processMathBlocks, 500)
    })
  })

  // 路由变化时处理
  router.afterEach(async (to, from) => {
    if (from.name && to.path !== from.path) {
      console.log('🔄 路由变化，重新处理数学公式')
      await nextTick()
      setTimeout(processMathBlocks, 300)
    }
  })

  return {
    provide: {
      processMath: processMathBlocks
    }
  }
})