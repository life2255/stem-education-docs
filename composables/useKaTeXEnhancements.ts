// File: composables/useKaTeXEnhancements.ts

export const useKaTeXEnhancements = () => {
  // 检测公式是否溢出容器
  const detectOverflow = () => {
    if (process.client) {
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
  }

  // 为数学公式添加复制功能
  const addCopyButtons = () => {
    if (process.client) {
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
  }

  // 获取 LaTeX 源码
  const getLatexSource = (display: Element): string => {
    // 尝试从数据属性获取原始 LaTeX
    const latexAttr = display.getAttribute('data-latex')
    if (latexAttr) return latexAttr

    // 从 KaTeX 渲染的内容中提取（不完美但可用）
    const katexHtml = display.querySelector('.katex-html')
    if (katexHtml) {
      // 这里可以添加更复杂的逆向解析逻辑
      // 简单实现：返回文本内容
      return katexHtml.textContent || ''
    }

    return display.textContent || ''
  }

  // 显示复制成功反馈
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

  // 降级复制方法
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

  // 为公式添加编号
  const addEquationNumbers = () => {
    if (process.client) {
      const displays = document.querySelectorAll('.katex-display')
      let equationCount = 0

      displays.forEach(display => {
        // 检查是否需要编号（可以通过类名或数据属性控制）
        if (display.classList.contains('numbered') && !display.querySelector('.katex-numberer')) {
          equationCount++
          
          const numberer = document.createElement('span')
          numberer.className = 'katex-numberer'
          numberer.textContent = `(${equationCount})`
          display.appendChild(numberer)
        }
      })
    }
  }

  // 为公式添加工具提示
  const addTooltips = () => {
    if (process.client) {
      const mathElements = document.querySelectorAll('.katex[data-tooltip]')
      mathElements.forEach(element => {
        element.classList.add('math-tooltip')
      })
    }
  }

  // 优化公式的可访问性
  const enhanceAccessibility = () => {
    if (process.client) {
      const mathElements = document.querySelectorAll('.katex')
      mathElements.forEach(element => {
        // 添加 ARIA 标签
        if (!element.getAttribute('role')) {
          element.setAttribute('role', 'math')
        }
        
        // 添加 aria-label（如果有的话）
        const altText = element.getAttribute('data-alt')
        if (altText && !element.getAttribute('aria-label')) {
          element.setAttribute('aria-label', altText)
        }
      })
    }
  }

  // 响应式字体大小调整
  const adjustFontSize = () => {
    if (process.client) {
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
  }

  // 公式加载动画
  const addLoadingAnimation = () => {
    if (process.client) {
      const mathElements = document.querySelectorAll('.katex-display')
      mathElements.forEach((element, index) => {
        element.style.opacity = '0'
        element.style.transform = 'translateY(10px)'
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
        
        setTimeout(() => {
          element.style.opacity = '1'
          element.style.transform = 'translateY(0)'
        }, index * 100)
      })
    }
  }

  // 公式高亮功能
  const addHighlighting = () => {
    if (process.client) {
      const mathElements = document.querySelectorAll('.katex-display')
      mathElements.forEach(element => {
        element.addEventListener('click', () => {
          // 移除其他高亮
          mathElements.forEach(el => el.classList.remove('math-focus'))
          // 添加当前高亮
          element.classList.add('math-focus')
          
          // 3秒后移除高亮
          setTimeout(() => {
            element.classList.remove('math-focus')
          }, 3000)
        })
      })
    }
  }

  // 检测公式渲染错误
  const detectRenderErrors = () => {
    if (process.client) {
      const mathElements = document.querySelectorAll('.katex')
      mathElements.forEach(element => {
        // 检查是否有错误类名或空内容
        if (element.classList.contains('katex-error') || element.textContent?.trim() === '') {
          element.classList.add('math-error')
          console.warn('数学公式渲染错误:', element)
        }
      })
    }
  }

  // 主初始化函数
  const initialize = () => {
    if (process.client) {
      // 使用 nextTick 确保 DOM 已经渲染
      nextTick(() => {
        detectOverflow()
        addCopyButtons()
        addEquationNumbers()
        addTooltips()
        enhanceAccessibility()
        addLoadingAnimation()
        addHighlighting()
        detectRenderErrors()
        
        // 设置响应式调整
        const cleanup = adjustFontSize()
        
        // 监听窗口大小变化
        window.addEventListener('resize', detectOverflow)
        
        // 返回清理函数
        onUnmounted(() => {
          window.removeEventListener('resize', detectOverflow)
          if (cleanup) cleanup()
        })
      })
    }
  }

  // 手动触发溢出检测（用于动态内容）
  const refreshOverflowDetection = () => {
    setTimeout(detectOverflow, 100)
  }

  // 手动重新初始化（用于动态加载的内容）
  const reinitialize = () => {
    setTimeout(initialize, 100)
  }

  return {
    initialize,
    detectOverflow,
    addCopyButtons,
    addEquationNumbers,
    refreshOverflowDetection,
    reinitialize
  }
}