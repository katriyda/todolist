import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from './TodoItem'
import type { Todo } from '../types/todo'

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: 'test-1',
    text: '测试任务',
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  }
}

describe('TodoItem', () => {
  describe('toggle', () => {
    it('should call onToggle when checkbox clicked', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      const todo = makeTodo({ text: '买菜' })
      render(
        <TodoItem todo={todo} onToggle={onToggle} onEdit={vi.fn()} onDelete={vi.fn()} />,
      )

      await user.click(screen.getByRole('checkbox'))

      expect(onToggle).toHaveBeenCalledWith('test-1')
    })

    it('should show checked state', () => {
      const todo = makeTodo({ completed: true })
      render(
        <TodoItem todo={todo} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />,
      )

      expect(screen.getByRole('checkbox')).toBeChecked()
    })
  })

  describe('edit', () => {
    it('should enter edit mode on double click', async () => {
      const user = userEvent.setup()
      const todo = makeTodo({ text: '原始文本' })
      render(
        <TodoItem todo={todo} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />,
      )

      await user.dblClick(screen.getByText('原始文本'))

      expect(screen.getByDisplayValue('原始文本')).toBeInTheDocument()
    })

    it('should call onEdit with new text on Enter', async () => {
      const user = userEvent.setup()
      const onEdit = vi.fn()
      const todo = makeTodo({ text: '旧文本' })
      render(
        <TodoItem todo={todo} onToggle={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />,
      )

      await user.dblClick(screen.getByText('旧文本'))
      const input = screen.getByDisplayValue('旧文本')
      await user.clear(input)
      await user.type(input, '新文本{Enter}')

      expect(onEdit).toHaveBeenCalledWith('test-1', '新文本')
    })

    it('should cancel edit on Escape', async () => {
      const user = userEvent.setup()
      const onEdit = vi.fn()
      const todo = makeTodo({ text: '原始文本' })
      render(
        <TodoItem todo={todo} onToggle={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />,
      )

      await user.dblClick(screen.getByText('原始文本'))
      const input = screen.getByDisplayValue('原始文本')
      await user.clear(input)
      await user.type(input, '修改了{Escape}')

      expect(onEdit).not.toHaveBeenCalled()
      expect(screen.getByText('原始文本')).toBeInTheDocument()
    })

    it('should save on blur', async () => {
      const user = userEvent.setup()
      const onEdit = vi.fn()
      const todo = makeTodo({ text: '旧文本' })
      render(
        <TodoItem todo={todo} onToggle={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />,
      )

      await user.dblClick(screen.getByText('旧文本'))
      const input = screen.getByDisplayValue('旧文本')
      await user.clear(input)
      await user.type(input, '新文本')
      // Tab away to trigger blur
      await user.tab()

      expect(onEdit).toHaveBeenCalledWith('test-1', '新文本')
    })

    it('should delete when edited text is empty', async () => {
      const user = userEvent.setup()
      const onDelete = vi.fn()
      const todo = makeTodo({ text: '要删除的' })
      render(
        <TodoItem todo={todo} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={onDelete} />,
      )

      await user.dblClick(screen.getByText('要删除的'))
      const input = screen.getByDisplayValue('要删除的')
      await user.clear(input)
      await user.type(input, '{Enter}')

      expect(onDelete).toHaveBeenCalledWith('test-1')
    })
  })

  describe('delete', () => {
    it('should call onDelete when delete button clicked', async () => {
      const user = userEvent.setup()
      const onDelete = vi.fn()
      const todo = makeTodo({ text: '要删除的' })
      render(
        <TodoItem todo={todo} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={onDelete} />,
      )

      await user.click(screen.getByRole('button', { name: '删除' }))

      expect(onDelete).toHaveBeenCalledWith('test-1')
    })
  })
})
