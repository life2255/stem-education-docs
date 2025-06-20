---
title: KaTeX 数学公式测试（可用版）
description: 验证 KaTeX 渲染效果，解决所有显示问题
subject: mathematics
category: test
difficulty: intermediate
readingTime: 5分钟
tags: [KaTeX, 数学公式, 测试]
---

# KaTeX 数学公式完整测试

## 行内公式测试

这是行内公式 $E = mc^2$，还有勾股定理 $a^2 + b^2 = c^2$。

更复杂的行内公式：$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$

## 简单块级公式

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

$$\int_{-\infty}^{\infty} \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}} dx = 1$$

## 矩阵测试（无背景框）

### 圆括号矩阵
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$

### 方括号矩阵
$$\begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}$$

### 行列式
$$\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$$

### 大型矩阵
$$\begin{pmatrix} 1 & 2 & 3 & 4 \\ 5 & 6 & 7 & 8 \\ 9 & 10 & 11 & 12 \\ 13 & 14 & 15 & 16 \end{pmatrix}$$

### 矩阵运算
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}$$

## 多行公式测试（关键修复）

### 基本对齐
$$\begin{aligned} f(x) &= ax^2 + bx + c \\ f'(x) &= 2ax + b \\ f''(x) &= 2a \end{aligned}$$

### 麦克斯韦方程组
$$\begin{aligned} \nabla \cdot \vec{E} &= \frac{\rho}{\epsilon_0} \\ \nabla \cdot \vec{B} &= 0 \\ \nabla \times \vec{E} &= -\frac{\partial \vec{B}}{\partial t} \\ \nabla \times \vec{B} &= \mu_0\vec{J} + \mu_0\epsilon_0\frac{\partial \vec{E}}{\partial t} \end{aligned}$$

### 线性方程组
$$\begin{aligned} 2x + 3y - z &= 1 \\ x - y + 2z &= 3 \\ 3x + 2y + z &= 7 \end{aligned}$$

### 分步求解
$$\begin{aligned} (x + 1)^2 &= x^2 + 2x + 1 \\ &= x^2 + 2x + 1 \\ &= (x + 1)^2 \end{aligned}$$

## 分段函数
$$f(x) = \begin{cases} x^2 & \text{if } x \geq 0 \\ -x^2 & \text{if } x < 0 \end{cases}$$

## 复杂数学表达式

### 连分数
$$e = 2 + \cfrac{1}{1 + \cfrac{1}{2 + \cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{4 + \cdots}}}}}$$

### 求和与积分
$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

$$\int_0^{\pi} \sin(x) dx = 2$$

### 极限
$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$

## 向量运算

### 叉积
$$\vec{a} \times \vec{b} = \begin{vmatrix} \vec{i} & \vec{j} & \vec{k} \\ a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \end{vmatrix}$$

### 点积
$$\vec{a} \cdot \vec{b} = |\vec{a}||\vec{b}|\cos\theta$$

## 特殊数学符号

### 希腊字母
$$\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \lambda, \mu, \pi, \sigma, \phi, \omega$$

### 大写希腊字母
$$\Gamma, \Delta, \Theta, \Lambda, \Xi, \Pi, \Sigma, \Phi, \Psi, \Omega$$

### 数学字体
$$\mathbb{R}, \mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{C}$$

$$\mathcal{A}, \mathcal{B}, \mathcal{L}$$

## 复杂物理公式

### 薛定谔方程
$$i\hbar\frac{\partial}{\partial t}|\psi\rangle = \hat{H}|\psi\rangle$$

### 爱因斯坦场方程
$$G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}$$

### 量子力学波函数
$$\psi(x,t) = A e^{i(kx - \omega t)}$$

## 线性代数

### 特征值方程
$$A\vec{v} = \lambda\vec{v}$$

### 矩阵分解
$$A = QR$$

其中 $Q$ 是正交矩阵，$R$ 是上三角矩阵。

### 线性变换
$$\begin{pmatrix} x' \\ y' \end{pmatrix} = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix}$$

## 微积分

### 基本积分
$$\int x^n dx = \frac{x^{n+1}}{n+1} + C \quad (n \neq -1)$$

### 分部积分
$$\int u dv = uv - \int v du$$

### 基本导数
$$\frac{d}{dx}[x^n] = nx^{n-1}$$

## 概率统计

### 正态分布
$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$$

### 贝叶斯定理
$$P(A|B) = \frac{P(B|A)P(A)}{P(B)}$$

## 验证清单

如果所有公式都正确显示：

✅ **行内公式正常** - 基础的 $$ 和 $ 分隔符工作正常  
✅ **块级公式正常** - 简单的块级公式正确渲染  
✅ **矩阵完美显示** - 无背景框干扰，大小矩阵都正常  
✅ **多行公式成功** - aligned 环境正确工作  
✅ **复杂公式支持** - 分段函数、积分、求和都正常  
✅ **无代码块错误** - 多行公式不再显示为代码  

## 关键修复要点

1. **严格格式要求**：
   - `$$` 必须在行首，前面不能有空格
   - 多行公式内部不能有空行
   - 使用 `aligned` 而不是 `align`

2. **样式优化**：
   - 移除了蓝色背景框
   - 矩阵和大型公式无边框干扰
   - 保持数学内容的纯净外观

3. **配置修复**：
   - 优化了 rehype-katex 配置
   - 修复了 Markdown 解析器干扰
   - 确保正确的 KaTeX 版本兼容性

如果仍有问题，检查：
- KaTeX CSS 是否正确加载
- 浏览器控制台是否有错误
- Markdown 文件编码是否为 UTF-8