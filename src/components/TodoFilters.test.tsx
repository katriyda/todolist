import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoFilters } from './TodoFilters'
import type { FilterStatus } from '../types/todo'

describe('TodoFilters', () => {
  it('should render three filter buttons', () => {
    render(
      <TodoFilters
        current="all"
        activeCount={0}
        completedCount={0}
        onFilterChange={vi.fn()}
        onClearCompleted={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '全部' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '未完成' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '已完成' })).toBeInTheDocument()
  })

  it('should highlight current filter', () => {
    render(
      <TodoFilters
        current="active"
        activeCount={3}
        completedCount={2}
        onFilterChange={vi.fn()}
        onClearCompleted={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '未完成' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: '全部' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('should call onFilterChange when clicking a filter', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    render(
      <TodoFilters
        current="all"
        activeCount={5}
        completedCount={3}
        onFilterChange={onFilterChange}
        onClearCompleted={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: '已完成' }))

    expect(onFilterChange).toHaveBeenCalledWith('completed' as FilterStatus)
  })

  it('should display active count', () => {
    render(
      <TodoFilters
        current="all"
        activeCount={5}
        completedCount={3}
        onFilterChange={vi.fn()}
        onClearCompleted={vi.fn()}
      />,
    )

    expect(screen.getByText('5 项未完成')).toBeInTheDocument()
  })

  it('should call onClearCompleted when clicking clear button', async () => {
    const user = userEvent.setup()
    const onClearCompleted = vi.fn()
    render(
      <TodoFilters
        current="all"
        activeCount={2}
        completedCount={3}
        onFilterChange={vi.fn()}
        onClearCompleted={onClearCompleted}
      />,
    )

    await user.click(screen.getByRole('button', { name: '清除已完成' }))

    expect(onClearCompleted).toHaveBeenCalledTimes(1)
  })

  it('should hide clear button when no completed todos', () => {
    render(
      <TodoFilters
        current="all"
        activeCount={5}
        completedCount={0}
        onFilterChange={vi.fn()}
        onClearCompleted={vi.fn()}
      />,
    )

    expect(screen.queryByRole('button', { name: '清除已完成' })).not.toBeInTheDocument()
  })
})
