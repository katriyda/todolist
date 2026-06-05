## 样式 + 响应式

**Status:** done

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

### UI 设计规范

采用**极简单列布局**，排版驱动层级：

**布局：**
- 单列 640px 居中，最大化留白
- 移动端全宽，触摸友好
- 无侧边栏，无多列，无卡片背景

**间距：**
- 区块间距：`32px`
- Todo 项间距：`20px 0`（1px 分隔线）
- 输入框内边距：`14px 16px`
- 标签内边距：`3px 10px`

**颜色（暖灰 + 点缀色）：**
- 主色调：暖灰（非纯黑白）
- 标签：柔和色 pill（浅蓝、浅绿、浅黄、浅红）
- 逾期：`--overdue-bg: #FDEBEC` / `--overdue-text: #9F2F2D`
- 完成：50% 透明度 + 删除线

**排版：**
- 标题：`20px`, `font-weight: 600`
- Todo 文本：`18px`, `line-height: 1.6`
- 标签：`12px`, 大写, `letter-spacing: 0.05em`
- 日期：`13px`, 等宽字体
- 筛选：`14px`, 活跃状态加粗

**边框：**
- 分隔线：`1px solid var(--divider)`
- 输入框：仅底部边框 `2px`
- 复选框：`1.5px` 边框, `3px` 圆角
- 标签：`9999px` 圆角（pill）

**动画：**
- 淡入：`opacity 0→1`, `300ms`, 按索引延迟 `80ms`
- 删除：`opacity 1→0`, `200ms`
- Toast：`translateY(12px→0)`, `300ms`

### 任务

1. 实现浅色主题样式
   - TodoInput 样式（仅底部边框输入框、深色按钮）
   - TodoItem 样式（复选框、文本、删除按钮、截止日期、标签）
   - TodoFilters 样式（文字标签、活跃状态加粗）
   - TodoSearch 样式（搜索图标 + 输入框）
   - TodoToast 样式（底部居中、淡入淡出）
   - 已完成任务删除线样式（50% 透明度）
   - 逾期截止日期红色背景 + 红色文字
   - 交互反馈（hover、focus、active）
   - 标签 pill 样式（柔和色、大写）

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
