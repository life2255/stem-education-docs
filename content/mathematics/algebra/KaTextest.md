---
title: KaTeX 数学公式测试（格式修正版）
description: 修正了缺少 $$ 分隔符的格式问题
subject: mathematics
category: test
difficulty: intermediate
readingTime: 5分钟
tags: [KaTeX, 数学公式, 测试]
---

# KaTeX 数学公式完整测试（格式修正版）

## 行内公式测试

这是行内公式 $E = mc^2$，还有勾股定理 $a^2 + b^2 = c^2$。

更复杂的行内公式：$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$

## 简单块级公式

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

$$\int_{-\infty}^{\infty} \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}} dx = 1$$

## 矩阵测试（修正版）

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

## 多行公式测试（修正版）

### 基本对齐（修正）
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

## 线性代数（修正版）

### 特征值方程
$$A\vec{v} = \lambda\vec{v}$$

### 矩阵分解
$$A = QR$$

其中 $Q$ 是正交矩阵，$R$ 是上三角矩阵。

### 线性变换（修正）
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

## 复杂物理公式

### 薛定谔方程
$$i\hbar\frac{\partial}{\partial t}|\psi\rangle = \hat{H}|\psi\rangle$$

### 爱因斯坦场方程
$$G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}$$

### 量子力学波函数
$$\psi(x,t) = A e^{i(kx - \omega t)}$$

## 验证清单

如果所有公式都正确显示：

✅ **行内公式正常** - 基础的 $$ 和 $ 分隔符工作正常  
✅ **块级公式正常** - 简单的块级公式正确渲染  
✅ **矩阵完美显示** - 无背景框干扰，大小矩阵都正常  
✅ **多行公式成功** - aligned 环境正确工作  
✅ **线性变换正常** - 修正了缺少 $$ 的问题  
✅ **复杂公式支持** - 分段函数、积分、求和都正常  

## 格式修正要点

### 🔧 **主要修复**
1. **基本对齐**：添加了缺失的 `$$` 分隔符
2. **线性变换**：添加了缺失的 `$$` 分隔符
3. **确保格式一致**：所有数学公式都正确使用了分隔符

### 📝 **正确格式模板**

```markdown
<!-- 行内公式 -->
这是行内公式 $E = mc^2$

<!-- 块级公式 -->
$$E = mc^2$$

<!-- 多行对齐 -->
$$\begin{aligned} 
f(x) &= ax^2 + bx + c \\ 
f'(x) &= 2ax + b 
\end{aligned}$$

<!-- 矩阵 -->
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$
```

### ⚠️ **常见错误**
1. ❌ 忘记添加 `$$` 分隔符
2. ❌ `$$` 前面有空格或文字
3. ❌ 多行公式中有空行
4. ❌ 使用 `align` 而不是 `aligned`