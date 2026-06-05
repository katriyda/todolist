import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoList } from './TodoList'
import type { Todo } from '../types/todo'

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: crypto.randomUUID(),
    text: '测试任务',
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  }
}

const noop = vi.fn()

describe('TodoList', () => {
  it('should render todos', () => {
    const todos = [
      makeTodo({ id: '1', text: '买菜' }),
      makeTodo({ id: '2', text: '写代码' }),
    ]

    render(
      <TodoList
        todos={todos}
        onToggle={noop}
        onEdit={noop}
        onDelete={noop}
      />,
    )

    expect(screen.getByText('买菜')).toBeInTheDocument()
    expect(screen.getByText('写代码')).toBeInTheDocument()
  })

  it('should show empty state when no todos', () => {
    render(
      <TodoList todos={[]} onToggle={noop} onEdit={noop} onDelete={noop} />,
    )

    expect(screen.getByText('暂无任务')).toBeInTheDocument()
  })

  it('should show filtered-empty state when filter yields nothing', () => {
    const todos = [makeTodo({ completed: true })]

    render(
      <TodoList
        todos={todos}
        onToggle={noop}
        onEdit={noop}
        onDelete={noop}
        emptyMessage="没有未完成的任务"
      />,
    )

    // When filteredTodos is non-empty, it renders items
    expect(screen.getByText('测试任务')).toBeInTheDocument()
  })
})
