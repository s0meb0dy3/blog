# 极简静态博客生成器

一个简单、快速的静态博客生成器，基于 Node.js 和 Markdown。专注于内容创作，无需复杂配置。

## 功能特点

- ✅ Markdown 解析和 HTML 生成
- ✅ 支持 Front Matter 元数据
- ✅ 自动生成文章列表页
- ✅ 响应式设计，移动端友好
- ✅ 支持中文文件名和路径
- ✅ 零配置，开箱即用
- ✅ 纯静态生成，部署简单

## 项目结构

```
├── posts/           # Markdown 文章
├── dist/           # 生成的 HTML 文件
├── build.js        # 构建脚本
├── server.js       # 开发服务器
├── package.json    # 项目配置
└── README.md       # 使用说明
```

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 添加新文章
在 `posts/` 目录下创建 `.md` 文件，添加 Front Matter：

```markdown
---
title: 文章标题
date: 2025-09-26
---

# 文章内容

这里是你的文章内容...
```

### 3. 构建博客
```bash
npm run build
```

### 4. 本地预览
```bash
npm run serve
```

然后访问 http://localhost:8000

## 示例文章

项目包含示例文章：
- **关于我** - 个人介绍和技术栈
- **我的第一篇博客文章** - 项目介绍和理念

## 部署指南

### GitHub Pages
1. 将 `dist/` 目录推送到 `gh-pages` 分支
2. 在仓库设置中启用 GitHub Pages

### Netlify
1. 连接你的 GitHub 仓库
2. 设置构建命令：`npm run build`
3. 设置发布目录：`dist`

### Vercel
1. 导入项目
2. 构建命令：`npm run build`
3. 输出目录：`dist`

## 自定义配置

### 修改样式
编辑 `build.js` 中的 CSS 样式部分，可以自定义：
- 颜色主题
- 字体设置
- 布局间距
- 代码高亮

### 添加页面
在 `posts/` 目录下创建新的 Markdown 文件即可，支持：
- 中文文件名
- 标准 Markdown 语法
- Front Matter 元数据

### 扩展功能
可以轻松添加：
- 文章分类
- 标签系统
- 搜索功能
- 评论系统

## 技术栈

- **Node.js** - 运行环境
- **markdown-it** - Markdown 解析器
- **原生 HTTP 服务器** - 开发预览

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！