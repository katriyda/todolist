# Domain Glossary

## Todo

一个待办事项，包含以下核心属性：

- **id** — 唯一标识符，使用 `crypto.randomUUID()` 生成
- **text** — 任务描述文本
- **completed** — 完成状态（boolean）
- **createdAt** — 创建时间，Unix timestamp（毫秒）
- **updatedAt** — 最后更新时间，Unix timestamp（毫秒）

### 可选属性

- **priority** — 优先级（可选），取值：`low` | `medium` | `high`
- **tags** — 标签列表（可选），字符串数组
- **dueDate** — 截止日期（可选），ISO date string（YYYY-MM-DD）

## FilterStatus

筛选状态，取值：`all` | `active` | `completed`

- **all** — 显示所有待办事项
- **active** — 只显示未完成的待办事项
- **completed** — 只显示已完成的待办事项

## Toast

临时提示消息，用于显示操作反馈和撤销选项。

- 显示时长：5 秒
- 包含撤销按钮
- 自动消失后执行删除操作

## UndoStack

撤销历史栈，用于支持单步撤销。

- 最大深度：10 步
- 只支持撤销，不支持重做
- 使用命令模式实现

## 现代 CSS 约定

项目使用现代 CSS 特性，不使用预处理器。

- **单位**：`rem` 作为主要单位
- **布局**：CSS Grid（整体）+ Flexbox（组件内部）
- **选择器**：CSS Nesting（原生）
- **颜色**：`oklch()` 颜色空间
- **响应式**：`clamp()`、`min()`、`max()` 优先，媒体查询补充
- **变量**：CSS Custom Properties（主题切换）

## UI 设计风格

极简单列布局，排版驱动层级。

- **布局**：单列 640px 居中，无侧边栏，无多列
- **视觉**：暖灰色调 + 点缀色（标签、逾期）
- **边框**：仅 1px 分隔线，无卡片背景、无阴影
- **排版**：字体大小/粗细/颜色驱动层级
- **动画**：淡入淡出 300ms，按索引延迟 80ms
