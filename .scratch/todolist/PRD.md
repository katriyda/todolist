## Problem Statement

用户需要一个跨平台的 Todo List 应用，能够在桌面端和移动端都能良好使用。当前项目是一个 Vite + React 19 的脚手架，需要从零开始构建完整的 todo 功能。

## Solution

构建一个响应式的 Todo List 应用，支持任务的增删改查、完成状态切换、筛选和持久化存储。应用将使用 React 19 + TypeScript，采用原生 CSS 实现响应式设计，通过 localStorage 实现数据持久化。

## User Stories

1. 作为用户，我想要添加新的待办事项，以便记录需要完成的任务
2. 作为用户，我想要删除不需要的待办事项，以便保持列表整洁
3. 作为用户，我想要标记待办事项为已完成，以便追踪任务进度
4. 作为用户，我想要取消标记已完成的待办事项，以便重新开始处理该任务
5. 作为用户，我想要编辑待办事项的文本内容，以便修正错误或更新任务描述
6. 作为用户，我想要查看所有待办事项，以便了解整体任务情况
7. 作为用户，我想要只查看未完成的待办事项，以便专注于当前需要处理的任务
8. 作为用户，我想要只查看已完成的待办事项，以便回顾已完成的工作
9. 作为用户，我想要清除所有已完成的待办事项，以便清理已完成的任务
10. 作为用户，我想要查看待办事项的总数，以便了解任务规模
11. 作为用户，我想要查看已完成待办事项的数量，以便了解完成进度
12. 作为用户，我想要通过键盘快捷键（Enter）快速添加待办事项，以便提高输入效率
13. 作为用户，我想要通过键盘快捷键（Escape）取消编辑，以便快速退出编辑状态
14. 作为用户，我想要待办事项列表自动保存，以便下次打开时能恢复数据
15. 作为用户，我想要在移动端也能方便地使用所有功能，以便随时随地管理任务
16. 作为用户，我想要在桌面端获得更大的显示空间，以便查看更多任务
17. 作为用户，我想要待办事项有清晰的视觉区分（已完成/未完成），以便快速识别状态
18. 作为用户，我想要待办事项支持拖拽排序，以便按优先级组织任务
19. 作为用户，我想要为待办事项设置截止日期，以便管理时间
20. 作为用户，我想要为待办事项添加标签或分类，以便组织不同类型的任务
21. 作为用户，我想要撤销上一步操作，以便恢复误操作
22. 作为用户，我想要批量选择并操作多个待办事项，以便提高处理效率
23. 作为用户，我想要搜索待办事项，以便快速找到特定任务
24. 作为用户，我想要导出待办事项列表，以便备份或分享
25. 作为用户，我想要导入待办事项列表，以便恢复备份或从其他应用迁移
26. 作为用户，我想要深色模式支持，以便在夜间使用时减少眼睛疲劳
27. 作为用户，我想要应用加载速度快，以便立即开始使用
28. 作为用户，我想要应用有良好的错误提示，以便了解操作失败的原因
29. 作为用户，我想要应用有加载状态指示，以便了解操作正在进行中（纯前端应用，同步读取，无需加载态）

## Implementation Decisions

### 模块划分

1. **TodoApp** — 根组件，管理整体状态和布局
2. **TodoInput** — 输入组件，负责添加新待办事项
3. **TodoList** — 列表组件，负责渲染待办事项列表
4. **TodoItem** — 单个待办事项组件，负责显示和交互
5. **TodoFilters** — 筛选组件，负责切换显示状态
6. **TodoStats** — 统计组件，负责显示任务数量
7. **TodoSearch** — 搜索组件，负责实时搜索
8. **TodoToast** — Toast 提示组件，负责显示撤销提示
9. **TodoDatePicker** — 日期选择组件，负责设置截止日期
10. **TodoTagInput** — 标签输入组件，负责管理标签

### 数据结构

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

### 状态管理

使用 `useReducer` 集中管理所有状态变更，便于测试和实现撤销功能。

```typescript
interface TodoState {
  todos: Todo[];
  filter: FilterStatus;
  editingId: string | null;
  undoStack: TodoAction[];  // 最多保存 10 步
}

type TodoAction =
  | { type: 'ADD'; payload: Todo }
  | { type: 'DELETE'; payload: { id: string } }
  | { type: 'TOGGLE'; payload: { id: string } }
  | { type: 'EDIT'; payload: { id: string; text: string } }
  | { type: 'SET_FILTER'; payload: FilterStatus }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'UNDO' };
```

### 持久化策略

使用 `localStorage` 存储 todo 列表，在组件挂载时加载，状态变更时防抖保存（300ms）。

- 序列化：`JSON.stringify` / `JSON.parse`
- 错误处理：静默降级 + 顶部提示（容量超限、隐私模式）
- 防抖：避免频繁写入，平衡响应性和性能

### 响应式设计

采用移动优先（Mobile First）策略：

- 移动端（默认）：全宽布局，触摸友好的交互区域
- 桌面端（>1024px）：居中布局，最大宽度 640px

### 现代 CSS 特性

- **单位**：使用 `rem` 作为主要单位（相对于根字体大小）
- **布局**：CSS Grid 用于整体布局，Flexbox 用于组件内部
- **选择器**：使用 CSS Nesting（原生支持）
- **变量**：CSS Custom Properties 保持主题一致性
- **颜色**：使用 `oklch()` 现代颜色空间
- **响应式函数**：使用 `clamp()`、`min()`、`max()` 减少媒体查询
- **过渡动画**：使用 `transition` + `@starting-style`（如适用）
- **容器查询**：可选使用 `@container` 实现组件级响应式

### 组件接口

```typescript
// TodoInput
interface TodoInputProps {
  onAdd: (text: string) => void;
}

// TodoItem
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  isEditing: boolean;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
}

// TodoFilters
interface TodoFiltersProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}
```

### 交互设计

- 添加：输入框 + Enter 键或按钮
- 编辑：双击进入内联编辑模式，Enter 保存，Escape 取消，blur 保存，空文本删除
- 删除：点击删除按钮，显示 toast + 撤销按钮（5 秒后自动删除）
- 切换：点击复选框
- 筛选：点击筛选按钮切换状态
- 搜索：输入框实时搜索（文本 + tags）
- 截止日期：`<input type="date">`，逾期显示红色高亮
- 标签：输入框 + Enter 添加，chips 显示，点击 × 删除
- 批量操作：复选框多选（桌面端），长按多选（移动端），底部操作栏
- 深色模式：手动切换 + 跟随系统偏好
- 拖拽排序：使用 @dnd-kit 实现
- 虚拟列表：超过 100 个 todo 时启用

## Testing Decisions

### 测试原则

- 只测试外部行为，不测试实现细节
- 测试用户可见的交互和结果
- 使用 React Testing Library 进行组件测试
- 使用 Jest/Vitest 进行单元测试

### 测试模块

1. **数据层测试**
   - 添加 todo
   - 删除 todo
   - 切换 todo 完成状态
   - 编辑 todo 文本
   - 筛选 todo 列表
   - 清除已完成 todo

2. **持久化层测试**
   - 保存到 localStorage
   - 从 localStorage 加载
   - 处理 localStorage 错误

3. **组件层测试**
   - TodoInput 渲染和提交
   - TodoItem 显示和交互
   - TodoList 筛选逻辑
   - TodoFilters 切换状态

### 测试工具

- **Vitest** 作为测试运行器（与 Vite 生态无缝集成）
- **React Testing Library** 进行组件测试
- **jsdom** 作为测试环境
- **@testing-library/user-event** 模拟用户交互

## Out of Scope

1. 后端 API 集成（纯前端应用）
2. 用户认证和多用户支持
3. 实时同步功能
4. 移动端原生应用（PWA 或 React Native）
5. 高级功能（子任务、依赖关系、时间跟踪）
6. 国际化支持
7. 无障碍访问优化（基础支持，但不作为重点）

## Further Notes

### 开发优先级

1. **P0（核心功能）**
   - 添加、删除、切换完成状态
   - 响应式布局
   - localStorage 持久化

2. **P1（重要功能）**
   - 编辑功能
   - 筛选功能
   - 统计显示

3. **P2（增强功能）**
   - 拖拽排序
   - 截止日期
   - 标签分类
   - 搜索功能

### 性能考虑

- 使用 `React.memo` 优化 TodoItem 渲染
- 使用 `useCallback` 稳定回调函数
- 使用 `useMemo` 缓存筛选结果和搜索结果
- 超过 100 个 todo 时启用虚拟列表（`@tanstack/react-virtual`）
- localStorage 写入使用 300ms 防抖
- 不需要代码分割（应用体积小）

### 可访问性

- 使用语义化 HTML 元素
- 添加适当的 ARIA 属性
- 支持键盘导航
- 提供足够的颜色对比度

---

**Status:** ready-for-agent
