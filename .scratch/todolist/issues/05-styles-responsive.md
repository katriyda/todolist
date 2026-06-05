## 样式 + 响应式

**Status:** ready-for-agent

### 描述

实现完整的视觉样式，包括浅色/深色主题、移动优先响应式布局，使用现代 CSS 特性。

### 现代 CSS 约束

- **单位**：使用 `rem` 作为主要单位（相对于根字体大小）
- **布局**：CSS Grid 用于整体布局，Flexbox 用于组件内部
- **选择器**：使用 CSS Nesting（原生支持）
- **颜色**：使用 `oklch()` 现代颜色空间
- **响应式函数**：使用 `clamp()`、`min()`、`max()` 减少媒体查询
- **过渡动画**：使用 `transition` + `@starting-style`（如适用）
- **容器查询**：可选使用 `@container` 实现组件级响应式

### 任务

1. 实现浅色主题样式
   - TodoInput 样式（输入框、按钮）
   - TodoItem 样式（复选框、文本、删除按钮、截止日期、标签）
   - TodoFilters 样式（按钮、高亮状态）
   - TodoSearch 样式
   - TodoToast 样式（动画效果）
   - 已完成任务删除线样式
   - 逾期截止日期红色高亮
   - 交互反馈（hover、focus、active）

2. 实现深色主题样式
   - 使用 `@media (prefers-color-scheme: dark)` 自动切换
   - 实现手动切换按钮
   - 保存用户偏好到 localStorage

3. 实现响应式布局（移动优先）
   - 移动端（默认）：全宽布局，触摸友好
   - 桌面端（>1024px）：居中布局，最大宽度 640px
   - 使用 CSS nesting 组织样式

4. 集成所有组件到 TodoApp
   - 深色模式切换按钮
   - 导出/导入按钮
   - 整体布局结构

### CSS 变量

```css
:root {
  --todo-bg: #ffffff;
  --todo-text: #1a1a1a;
  --todo-text-secondary: #6b7280;
  --todo-border: #e5e7eb;
  --todo-accent: #3b82f6;
  --todo-accent-hover: #2563eb;
  --todo-danger: #ef4444;
  --todo-danger-hover: #dc2626;
  --todo-success: #10b981;
  --todo-warning: #f59e0b;
  --todo-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --todo-bg: #1a1a1a;
    --todo-text: #f3f4f6;
    --todo-text-secondary: #9ca3af;
    --todo-border: #374151;
    /* ... 其他深色变量 */
  }
}
```

### 验收标准

- [ ] 浅色主题显示正常
- [ ] 深色主题自动跟随系统
- [ ] 手动切换深色模式正常
- [ ] 所有交互状态有视觉反馈
- [ ] 已完成任务有删除线
- [ ] 逾期截止日期有红色高亮
- [ ] 标签显示为 chips 样式
- [ ] Toast 动画流畅
- [ ] 移动端布局正确（全宽，触摸友好）
- [ ] 桌面端布局正确（居中，最大 640px）
- [ ] 颜色对比度符合可访问性标准
- [ ] `pnpm build` 编译通过
- [ ] `pnpm lint` 检查通过
