## 核心组件

**Status:** ready-for-agent

### 描述

实现 Todo 应用的四个核心组件：TodoInput、TodoItem、TodoList、TodoFilters。

### 任务

1. 创建 `src/components/TodoInput.tsx`
   - 输入框 + Enter 键/按钮提交
   - 输入验证（非空、去除首尾空格）
   - 提交后清空输入框

2. 创建 `src/components/TodoItem.tsx`
   - 复选框切换完成状态
   - 双击进入内联编辑模式
   - 编辑：Enter 保存，Escape 取消，blur 保存
   - 空文本时删除 todo
   - 删除按钮（触发 toast，不直接删除）
   - 显示截止日期（逾期红色高亮）
   - 显示标签（chips 形式）
   - 使用 `React.memo` 优化

3. 创建 `src/components/TodoList.tsx`
   - 渲染 TodoItem 列表
   - 处理空列表状态
   - 处理筛选后无结果状态

4. 创建 `src/components/TodoFilters.tsx`
   - 三个筛选按钮（All/Active/Completed）
   - 高亮当前筛选状态
   - 显示数量统计
   - 清除已完成按钮

### 验收标准

- [ ] TodoInput 正确添加 todo
- [ ] TodoItem 完成状态切换正常
- [ ] TodoItem 内联编辑正常（双击、Enter、Escape、blur）
- [ ] TodoItem 删除触发 toast（不直接删除）
- [ ] TodoItem 截止日期逾期显示红色
- [ ] TodoItem 标签显示为 chips
- [ ] TodoList 空状态显示正确
- [ ] TodoFilters 筛选功能正常
- [ ] 组件测试通过
