## 状态管理 + 持久化

**Status:** ready-for-agent

### 描述

使用 `useReducer` 集中管理状态，localStorage 持久化（300ms 防抖），支持单步撤销。

### 任务

1. 创建 `src/hooks/useTodos.ts` 自定义 hook
2. 定义 `TodoState` 和 `TodoAction` 类型
3. 实现 reducer 函数，处理所有 action 类型
4. 创建 `src/hooks/useLocalStorage.ts` 自定义 hook
5. 实现 300ms 防抖保存
6. 处理 localStorage 错误（容量限制、隐私模式）
7. 实现撤销功能（单步，最多 10 步）

### 接口定义

```typescript
interface TodoState {
  todos: Todo[];
  filter: FilterStatus;
  editingId: string | null;
  undoStack: TodoAction[];
}

type TodoAction =
  | { type: 'ADD'; payload: Todo }
  | { type: 'DELETE'; payload: { id: string } }
  | { type: 'TOGGLE'; payload: { id: string } }
  | { type: 'EDIT'; payload: { id: string; text: string } }
  | { type: 'SET_FILTER'; payload: FilterStatus }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'UNDO' };

interface UseTodosReturn {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  filteredTodos: Todo[];
  activeCount: number;
  completedCount: number;
}
```

### 验收标准

- [ ] 所有 action 类型正确处理
- [ ] 筛选逻辑正确（all/active/completed）
- [ ] 统计数据准确（activeCount/completedCount）
- [ ] 撤销功能正常工作（单步，最多 10 步）
- [ ] 300ms 防抖保存正常
- [ ] localStorage 错误处理正确
- [ ] 单元测试覆盖所有功能
