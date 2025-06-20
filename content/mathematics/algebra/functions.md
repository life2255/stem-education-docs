---
title: 函数关系图
description: 用图表展示函数的类型和关系
subject: mathematics  
category: algebra
difficulty: beginner
---

# 函数关系图

## 函数分类

```mermaid
graph TD
    A[函数] --> B[一元函数]
    A --> C[多元函数]
    
    B --> D[线性函数]
    B --> E[二次函数]
    B --> F[指数函数]
    B --> G[对数函数]
    B --> H[三角函数]
    
    D --> I[y = ax + b]
    E --> J[y = ax² + bx + c]
    F --> K[y = aˣ]
    G --> L[y = log_a(x)]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#f3e5f5

    flowchart LR
    A[原函数 f(x)] --> B[平移变换]
    B --> C[伸缩变换]
    C --> D[反射变换]
    D --> E[最终函数]
    
    B --> F[f(x-h) + k]
    C --> G[af(bx)]
    D --> H[-f(x) 或 f(-x)]
    
    style A fill:#ffcdd2
    style E fill:#c8e6c9