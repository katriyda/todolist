# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"ret" — 跨平台 Todo List 应用（桌面端 + 移动端），响应式设计。当前处于脚手架阶段，基于 Vite 模板初始化。

## Tech Stack

- **框架**: React 19 + TypeScript 6
- **构建工具**: Vite 8（`@vitejs/plugin-react` 使用 Oxc）
- **包管理器**: pnpm
- **样式**: 原生 CSS + CSS 自定义属性（变量定义在 `src/index.css`）
- **响应式断点**: `@media (max-width: 1024px)` 作为桌面/移动端分界
- **Lint**: ESLint 10 + typescript-eslint + react-hooks + react-refresh
- **设计技能**: `.agents/skills/` 下有多个 UI/设计相关的 skill 可用

## 常用命令

```bash
pnpm dev          # 启动开发服务器（HMR）
pnpm build        # TypeScript 编译 + Vite 生产构建
pnpm lint         # ESLint 检查
pnpm preview      # 预览生产构建产物
```

## 项目结构

```
src/
  main.tsx        # 应用入口，StrictMode 挂载
  App.tsx         # 根组件
  App.css         # 组件级样式
  index.css       # 全局样式 + CSS 变量 + 响应式基础规则
  assets/         # 静态资源（图片等）
public/
  favicon.svg
  icons.svg       # SVG sprite（通过 <use href> 引用）
```

## TypeScript 配置

- 双 tsconfig 架构：`tsconfig.app.json`（src 代码）+ `tsconfig.node.json`（vite.config.ts）
- 严格 lint 规则：`noUnusedLocals`、`noUnusedParameters`、`erasableSyntaxOnly`
- 模块模式：bundler + verbatimModuleSyntax

## 样式约定

- CSS 变量在 `:root` 中定义，暗色模式通过 `@media (prefers-color-scheme: dark)` 覆盖
- 响应式设计采用 `@media` 查询，非 utility-class 方案
- 嵌套 CSS 语法（原生 CSS nesting，非 Sass）

## 设计系统（.agents/skills）

项目配置了多个设计 skill，适用于不同 UI 风格：
- `minimalist-ui` — 极简风格
- `industrial-brutalist-ui` — 工业粗野主义
- `high-end-visual-design` — 高端视觉
- `design-taste-frontend` — 前端设计品味
- `imagegen-frontend-web` / `imagegen-frontend-mobile` — Web/移动端 UI 生成

开发 UI 时可参考这些 skill 的 SKILL.md 获取设计指导。

## Agent skills

### Issue tracker

Issues live as markdown files in `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses five canonical labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout with `CONTEXT.md` at the repo root and `docs/adr/` for architectural decisions. See `docs/agents/domain.md`.
