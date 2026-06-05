## 增强功能

**Status:** ready-for-agent

### 描述

实现搜索、Toast 撤销、截止日期选择、标签管理、导出导入功能。

### 任务

1. 创建 `src/components/TodoSearch.tsx`
   - 实时搜索（useMemo 过滤）
   - 搜索范围：todo 文本 + tags
   - 搜索结果高亮匹配文本

2. 创建 `src/components/TodoToast.tsx`
   - toast 显示（5 秒自动消失）
   - 撤销按钮
   - 5 秒后自动删除
   - 支持多个 toast 同时显示（队列）
   - 淡入淡出动画

3. 创建 `src/components/TodoDatePicker.tsx`
   - 使用 `<input type="date">`
   - 逾期显示红色高亮 + "已逾期" 标签

4. 创建 `src/components/TodoTagInput.tsx`
   - 输入框 + Enter 添加标签
   - chips 显示，点击 × 删除
   - 预设常用标签（工作、个人、购物等）

5. 实现导出/导入功能
   - JSON 格式导出（`todos-backup-{timestamp}.json`）
   - JSON 文件导入

### 验收标准

- [ ] 搜索实时响应，范围包含文本和 tags
- [ ] Toast 5 秒后自动消失，撤销功能正常
- [ ] 截止日期选择正常，逾期显示正确
- [ ] 标签输入/删除正常，预设标签可用
- [ ] 导出文件格式正确，导入数据完整
- [ ] 组件测试通过
