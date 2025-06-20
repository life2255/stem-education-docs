---
title: 数学公式测试页面
description: 测试 MathJax 3 数学公式渲染效果
subject: mathematics
category: test
difficulty: intermediate
readingTime: 10分钟
tags: [数学公式, MathJax, 测试]
---

# 数学公式测试页面

这个页面用于测试 MathJax 3 数学公式的渲染效果。

## 基础公式测试

### 行内公式

这是一个行内公式 $E = mc^2$，还有另一个 $a^2 + b^2 = c^2$。

更复杂的行内公式：$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$

### 块级公式

简单的块级公式：

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

复杂的积分公式：

$$\int_{-\infty}^{\infty} \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}} dx = 1$$

## 高级数学公式

### 矩阵和向量

矩阵示例：

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

### 多行公式

使用 align 环境：

$$\begin{align}
f(x) &= ax^2 + bx + c \\
f'(x) &= 2ax + b \\
f''(x) &= 2a
\end{align}$$

### 求和与乘积

$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

$$\prod_{i=1}^{n} i = n!$$

### 极限

$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$

$$\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e$$

## 物理公式示例

### 经典力学

牛顿第二定律：
$$\vec{F} = m\vec{a}$$

动能公式：
$$E_k = \frac{1}{2}mv^2$$

### 电磁学

麦克斯韦方程组：

$$\begin{align}
\nabla \cdot \vec{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \vec{B} &= 0 \\
\nabla \times \vec{E} &= -\frac{\partial \vec{B}}{\partial t} \\
\nabla \times \vec{B} &= \mu_0\vec{J} + \mu_0\epsilon_0\frac{\partial \vec{E}}{\partial t}
\end{align}$$

### 量子力学

薛定谔方程：
$$i\hbar\frac{\partial}{\partial t}|\psi\rangle = \hat{H}|\psi\rangle$$

## 化学公式示例

### 化学反应

$$\ce{2H2 + O2 -> 2H2O}$$

### 化学平衡

$$K_c = \frac{[C]^c[D]^d}{[A]^a[B]^b}$$

## 特殊符号测试

### 希腊字母

$\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \iota, \kappa, \lambda, \mu, \nu, \xi, \pi, \rho, \sigma, \tau, \upsilon, \phi, \chi, \psi, \omega$

大写：$\Gamma, \Delta, \Theta, \Lambda, \Xi, \Pi, \Sigma, \Upsilon, \Phi, \Psi, \Omega$

### 运算符号

$\pm, \mp, \times, \div, \cdot, \ast, \star, \circ, \bullet, \diamond, \triangle$

### 关系符号

$=, \neq, \equiv, \approx, \cong, \sim, \propto, <, \leq, \ll, >, \geq, \gg$

### 集合符号

$\in, \notin, \ni, \subset, \subseteq, \supset, \supseteq, \cup, \cap, \setminus, \emptyset, \varnothing$

### 数学字体

$\mathbb{R}, \mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{C}$

$\mathcal{A}, \mathcal{B}, \mathcal{C}, \mathcal{L}, \mathcal{O}$

$\mathfrak{A}, \mathfrak{B}, \mathfrak{C}$

## 复杂公式测试

### 连分数

$$e = 2 + \cfrac{1}{1 + \cfrac{1}{2 + \cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{4 + \cfrac{1}{1 + \cfrac{1}{1 + \cdots}}}}}}}$$

### 大型公式

$$\frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} \equiv 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\cdots} } } }$$

### 多重积分

$$\iiint_V f(x,y,z) \, dx \, dy \, dz$$

$$\oint_C \vec{F} \cdot d\vec{r}$$

## 测试说明

如果您能正确看到上述所有数学公式，说明 MathJax 3 配置成功！

### 功能检查列表

- [ ] 行内公式正常显示
- [ ] 块级公式居中显示
- [ ] 复杂公式结构完整
- [ ] 特殊符号显示正确
- [ ] 暗色模式下公式可见
- [ ] 移动端响应式正常
- [ ] 可访问性支持（屏幕阅读器）

如果有任何公式显示异常，请检查：
1. MathJax 3 脚本是否正确加载
2. 插件配置是否正确
3. 控制台是否有错误信息