// File: composables/useKaTeXEnhancements.ts
// 重构版本：严格遵循客户端边界

export const useKaTeXEnhancements = () => {
  // ❌ 原代码问题：直接在 composable 中执行 DOM 操作
  // ✅ 新方案：返回初始化函数，在组件的 onMounted 中调用

  // 返回一个初始化函数，而不是直接执行
  const initializeEnhancements = () => {
    // 确保只在客户端执行
    if (!process.client) {
      console.warn('KaTeX enhancements should only run on client')
      return
    }

    // 检测公式是否溢出容器
    const detectOverflow = () => {
      const displays = document.querySelectorAll('.katex-display')
      displays.forEach(display => {
        const container = display.parentElement
        if (container && display.scrollWidth > container.clientWidth) {
          display.classList.add('overflow')
        } else {
          display.classList.remove('overflow')
        }
      })
    }

    // 为数学公式添加复制功能
    const addCopyButtons = () => {
      const displays = document.querySelectorAll('.katex-display')
      displays.forEach((display, index) => {
        // 避免重复添加
        if (display.querySelector('.copy-button')) return

        const copyButton = document.createElement('button')
        copyButton.className = 'copy-button'
        copyButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        `
        copyButton.title = '复制公式'
        
        // 获取原始 LaTeX 代码
        const latexSource = getLatexSource(display)
        
        copyButton.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(latexSource)
            showCopyFeedback(copyButton)
          } catch (err) {
            console.error('复制失败:', err)
            fallbackCopy(latexSource)
          }
        })

        display.appendChild(copyButton)
      })
    }

    // 响应式字体大小调整
    const adjustFontSize = () => {
      const handleResize = () => {
        const displays = document.querySelectorAll('.katex-display')
        const screenWidth = window.innerWidth
        
        displays.forEach(display => {
          if (screenWidth < 480) {
            display.style.fontSize = '0.85em'
          } else if (screenWidth < 768) {
            display.style.fontSize = '0.95em'
          } else {
            display.style.fontSize = ''
          }
        })
      }

      handleResize()
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }

    // 执行所有增强功能
    const runEnhancements = () => {
      detectOverflow()
      addCopyButtons()
      const cleanupResize = adjustFontSize()
      
      // 返回清理函数
      return () => {
        if (cleanupResize) cleanupResize()
      }
    }

    return {
      detectOverflow,
      addCopyButtons,
      adjustFontSize,
      runEnhancements
    }
  }

  // 工具函数
  const getLatexSource = (display: Element): string => {
    const latexAttr = display.getAttribute('data-latex')
    if (latexAttr) return latexAttr
    return display.textContent || ''
  }

  const showCopyFeedback = (button: HTMLElement) => {
    const originalIcon = button.innerHTML
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    `
    button.style.color = '#10b981'
    
    setTimeout(() => {
      button.innerHTML = originalIcon
      button.style.color = ''
    }, 2000)
  }

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('降级复制也失败:', err)
    }
    
    document.body.removeChild(textArea)
  }

  return {
    initializeEnhancements
  }
}