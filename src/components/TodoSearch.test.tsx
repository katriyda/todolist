import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoSearch } from './TodoSearch'
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

describe('TodoSearch', () => {
  it('should render search input', () => {
    render(<TodoSearch todos={[]} onResults={vi.fn()} />)

    expect(screen.getByPlaceholderText('搜索任务...')).toBeInTheDocument()
  })

  it('should call onResults with matching todos', async () => {
    const user = userEvent.setup()
    const onResults = vi.fn()
    const todos = [
      makeTodo({ text: '买菜' }),
      makeTodo({ text: '写代码' }),
      makeTodo({ text: '买水果' }),
    ]

    render(<TodoSearch todos={todos} onResults={onResults} />)
    await user.type(screen.getByPlaceholderText('搜索任务...'), '买')

    // onResults should have been called with filtered results
    const lastCall = onResults.mock.calls[onResults.mock.calls.length - 1]
    expect(lastCall[0]).toHaveLength(2)
    expect(lastCall[0].map((t: Todo) => t.text)).toEqual(['买菜', '买水果'])
  })

  it('should search in tags', async () => {
    const user = userEvent.setup()
    const onResults = vi.fn()
    const todos = [
      makeTodo({ text: '任务A', tags: ['工作'] }),
      makeTodo({ text: '任务B', tags: ['个人'] }),
    ]

    render(<TodoSearch todos={todos} onResults={onResults} />)
    await user.type(screen.getByPlaceholderText('搜索任务...'), '工作')

    const lastCall = onResults.mock.calls[onResults.mock.calls.length - 1]
    expect(lastCall[0]).toHaveLength(1)
    expect(lastCall[0][0].text).toBe('任务A')
  })

  it('should return null when search is empty (no active search)', async () => {
    const user = userEvent.setup()
    const onResults = vi.fn()
    const todos = [makeTodo({ text: 'A' }), makeTodo({ text: 'B' })]

    render(<TodoSearch todos={todos} onResults={onResults} />)
    await user.type(screen.getByPlaceholderText('搜索任务...'), 'A')
    await user.clear(screen.getByPlaceholderText('搜索任务...'))

    const lastCall = onResults.mock.calls[onResults.mock.calls.length - 1]
    expect(lastCall[0]).toBeNull()
  })

  it('should be case insensitive', async () => {
    const user = userEvent.setup()
    const onResults = vi.fn()
    const todos = [makeTodo({ text: 'Buy Groceries' })]

    render(<TodoSearch todos={todos} onResults={onResults} />)
    await user.type(screen.getByPlaceholderText('搜索任务...'), 'buy')

    const lastCall = onResults.mock.calls[onResults.mock.calls.length - 1]
    expect(lastCall[0]).toHaveLength(1)
  })
})
