## 项目初始化

**Status:** ready-for-agent

### 描述

初始化 Todo List 项目的目录结构、类型定义和基础样式。

### 任务

1. 清理 `src/App.tsx` 中的脚手架代码
2. 创建目录结构：
   - `src/components/` — React 组件
   - `src/types/` — TypeScript 类型定义
   - `src/hooks/` — 自定义 hooks
3. 创建 `src/types/todo.ts` 定义 Todo 相关类型
4. 更新 `src/index.css` 中的 CSS 变量（浅色/深色主题）
5. 创建 `src/components/TodoApp.tsx` 基础布局

### 类型定义

```typescript
interface Todo {
  id: string;           // crypto.randomUUID()
  text: string;
  completed: boolean;
  createdAt: number;    // Unix timestamp (ms)
  updatedAt: number;    // Unix timestamp (ms)
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: string;     // ISO date string (YYYY-MM-DD)
}

type FilterStatus = 'all' | 'active' | 'completed';
```

### CSS 变量

```css
:root {
  --todo-bg: #ffffff;
  --todo-text: #1a1a1a;
  --todo-text-secondary: #6b7280;
  --todo-border: #e5e7eb;
  --todo-accent: #3b82f6;
  --todo-danger: #ef4444;
  --todo-success: #10b981;
  --todo-warning: #f59e0b;
  --todo-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### 验收标准

- [ ] 目录结构符合模块划分
- [ ] TypeScript 类型定义完整
- [ ] CSS 变量支持浅色/深色主题
- [ ] TodoApp 基础布局正确
- [ ] `pnpm build` 编译通过
- [ ] `pnpm lint` 检查通过
