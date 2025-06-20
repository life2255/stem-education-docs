// File: app.config.ts
export default defineAppConfig({
  // Mermaid 配置
  contentMermaid: {
    enabled: true,
    // 主题模式：'default' 或 '@nuxtjs/color-mode'
    color: '@nuxtjs/color-mode', // 支持深色模式
    // 自定义加载组件（可选）
    spinnerComponent: 'LoadingSpinner'
  }
})