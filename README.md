# STEM 教育文档网站

一个基于 Nuxt 3 的 STEM 教育文档网站，提供系统化的科学、技术、工程和数学学习资源。

## 特性

- 📚 **多层级导航系统** - 支持学科 → 分类 → 子分类 → 具体主题的层级结构
- 📝 **Markdown 驱动** - 使用 Nuxt Content 管理文档内容
- 🎨 **美观的 UI** - 基于 Nuxt UI 和 Tailwind CSS
- 🔍 **全站搜索** - 快速查找所需内容
- 🌓 **深色模式** - 保护眼睛，适应不同环境
- 📱 **响应式设计** - 完美适配各种设备
- ⚡ **静态生成** - 快速加载，SEO 友好

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run generate
```

静态文件将生成在 `.output/public` 目录中。

## 项目结构

```
stem-education-docs/
├── assets/              # 静态资源
│   └── css/            # 样式文件
├── components/         # Vue 组件
│   ├── content/       # 内容组件（Alert、YouTube 等）
│   └── App*.vue       # 应用组件（导航、搜索等）
├── composables/        # 组合式函数
├── content/           # Markdown 内容文件
│   ├── physics/      # 物理学科
│   ├── chemistry/    # 化学学科
│   ├── biology/      # 生物学科
│   └── mathematics/  # 数学学科
├── layouts/           # 布局组件
├── pages/            # 页面组件
├── public/           # 公共资源
└── nuxt.config.ts    # Nuxt 配置文件
```

## 内容管理

### 创建新文档

1. 在 `content` 目录下创建对应的 Markdown 文件
2. 添加 Front Matter 元数据
3. 编写内容

示例文档结构：

```markdown
---
title: 文章标题
description: 文章描述
subject: physics
category: mechanics
difficulty: intermediate
readingTime: 15分钟
tags: [标签1, 标签2]
related: [/physics/related-topic]
---

# 文章标题

正文内容...
```

### Front Matter 字段说明

- `title` - 文章标题（必需）
- `description` - 文章描述，用于 SEO 和预览
- `subject` - 所属学科：physics | chemistry | biology | mathematics
- `category` - 所属分类
- `difficulty` - 难度等级：beginner | intermediate | advanced
- `readingTime` - 预计阅读时间
- `tags` - 标签数组
- `related` - 相关文章路径数组

### 使用内容组件

#### Alert 提示框

```markdown
::alert{type="info"}
这是一个信息提示
::

::alert{type="warning" title="警告"}
这是一个警告提示
::
```

类型：info | success | warning | error | example

#### YouTube 视频

```markdown
::youtube{id="视频ID" caption="视频说明"}
::
```

#### 数学公式

行内公式：`$E = mc^2$`

块级公式：
```markdown
$$
\int_{a}^{b} f(x) dx = F(b) - F(a)
$$
```

#### 自定义组件

```markdown
::definition
**定义**：这里是定义内容
::

::example
这里是示例内容
::

::formula
V = I × R
::
```

## 目录配置

每个目录可以包含 `_dir.yml` 文件来配置导航信息：

```yaml
title: 目录标题
navigation:
  title: 导航标题
  icon: i-heroicons-beaker
```

## 部署

### Netlify 部署

1. 推送代码到 GitHub
2. 在 Netlify 中导入项目
3. 构建命令：`npm run generate`
4. 发布目录：`.output/public`

### Vercel 部署

```bash
vercel --prod
```

### 其他静态托管

生成静态文件后，将 `.output/public` 目录的内容上传到任何静态托管服务。

## 开发指南

### 添加新学科

1. 在 `content` 目录下创建学科文件夹
2. 更新 `components/AppHeader.vue` 中的学科配置
3. 创建学科首页 `index.md`
4. 添加 `_dir.yml` 配置文件

### 自定义样式

编辑 `assets/css/tailwind.css` 添加自定义样式类。

### 添加新的内容组件

1. 在 `components/content` 目录创建 `Prose[组件名].vue`
2. 在 Markdown 中使用 `::[组件名]` 语法

## 性能优化

- 图片使用 WebP 格式
- 启用 Nuxt 图片优化模块
- 合理使用懒加载
- 优化字体加载

## 常见问题

### 搜索功能不工作？

确保内容文件的 Front Matter 格式正确，特别是必需的 `title` 字段。

### 导航没有显示？

检查目录结构和 `_dir.yml` 配置文件。

### 数学公式无法渲染？

确保使用正确的 LaTeX 语法，并用 `$` 或 `$$` 包裹。

## 贡献指南

欢迎提交 Pull Request！请确保：

1. 遵循现有的代码风格
2. 添加适当的文档
3. 测试所有功能

## 许可证

MIT License

---

如有问题或建议，请提交 Issue 或联系 contact@stem-docs.com