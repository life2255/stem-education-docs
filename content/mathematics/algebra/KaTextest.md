---
title: KaTeX 数学公式测试
description: 验证 KaTeX 渲染效果，确保 MathJax 已完全清理
subject: mathematics
category: test
difficulty: intermediate
readingTime: 5分钟
tags: [KaTeX, 数学公式, 测试]
---

# KaTeX 数学公式测试页面

此页面用于验证 KaTeX 是否正常工作，确保 MathJax 已完全清理。

## 行内公式测试

这是行内公式 $E = mc^2$，还有 $a^2 + b^2 = c^2$。

更复杂的行内公式：$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$

## 块级公式测试

### 简单公式

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

### 复杂积分

$$\int_{-\infty}^{\infty} \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}} dx = 1$$

## 矩阵和向量

$$\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}$$

## 多行公式

$$\begin{align}
f(x) &= ax^2 + bx + c \\
f'(x) &= 2ax + b \\
f''(x) &= 2a
\end{align}$$

## 求和与极限

$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$

## 物理公式

### 麦克斯韦方程组

$$\begin{align}
\nabla \cdot \vec{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \vec{B} &= 0 \\
\nabla \times \vec{E} &= -\frac{\partial \vec{B}}{\partial t} \\
\nabla \times \vec{B} &= \mu_0\vec{J} + \mu_0\epsilon_0\frac{\partial \vec{E}}{\partial t}
\end{align}$$

### 薛定谔方程

$$i\hbar\frac{\partial}{\partial t}|\psi\rangle = \hat{H}|\psi\rangle$$

## 希腊字母测试

$\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \iota, \kappa, \lambda, \mu, \nu, \xi, \pi, \rho, \sigma, \tau, \upsilon, \phi, \chi, \psi, \omega$

大写：$\Gamma, \Delta, \Theta, \Lambda, \Xi, \Pi, \Sigma, \Upsilon, \Phi, \Psi, \Omega$

## 数学字体

$\mathbb{R}, \mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{C}$

$\mathcal{A}, \mathcal{B}, \mathcal{C}, \mathcal{L}, \mathcal{O}$

$\mathfrak{A}, \mathfrak{B}, \mathfrak{C}$

## 复杂公式

### 连分数

$$e = 2 + \cfrac{1}{1 + \cfrac{1}{2 + \cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{4 + \cfrac{1}{1 + \cfrac{1}{1 + \cdots}}}}}}}$$

### 大型公式

$$\frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} \equiv 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\cdots} } } }$$

## 验证清单

如果以上所有公式都能正确显示，说明：

✅ **KaTeX 配置正确** - 服务端渲染工作正常  
✅ **MathJax 已完全清理** - 没有客户端 JS 冲突  
✅ **样式正确** - 深色模式和响应式设计正常  
✅ **性能优化** - 无客户端渲染延迟  

### 技术优势

- **服务端渲染**：公式在构建时就已渲染，无客户端延迟
- **体积小**：只需要 KaTeX CSS，无需 JavaScript
- **兼容性好**：支持所有现代浏览器
- **SEO 友好**：公式内容可被搜索引擎索引
- **无 hydration 问题**：避免了 SPA 导航时的闪烁

如果有任何公式显示异常，请检查：
1. `nuxt.config.ts` 中的 `rehype-katex` 配置
2. KaTeX CSS 是否正确加载
3. 控制台是否有错误信息