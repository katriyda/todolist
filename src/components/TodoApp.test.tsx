import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoApp } from './TodoApp'

describe('TodoApp', () => {
  it('should render the app title', () => {
    render(<TodoApp />)

    expect(screen.getByText('待办事项')).toBeInTheDocument()
  })

  it('should render input and filters', () => {
    render(<TodoApp />)

    expect(screen.getByPlaceholderText('添加新任务...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '全部' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '未完成' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '已完成' })).toBeInTheDocument()
  })

  it('should show empty state when no todos', () => {
    render(<TodoApp />)

    expect(screen.getByText('暂无任务')).toBeInTheDocument()
  })

  it('should add a todo via input', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('添加新任务...')
    await user.type(input, '买菜{Enter}')

    expect(screen.getByText('买菜')).toBeInTheDocument()
    expect(screen.queryByText('暂无任务')).not.toBeInTheDocument()
  })

  it('should toggle a todo', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByPlaceholderText('添加新任务...'), '买菜{Enter}')
    await user.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('should filter active todos', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('添加新任务...')
    await user.type(input, '活跃{Enter}')
    await user.type(input, '完成{Enter}')
    // Toggle the second one
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[1])

    await user.click(screen.getByRole('button', { name: '未完成' }))

    expect(screen.getByText('活跃')).toBeInTheDocument()
    expect(screen.queryByText('完成')).not.toBeInTheDocument()
  })

  it('should clear completed todos', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('添加新任务...')
    await user.type(input, '任务1{Enter}')
    await user.type(input, '任务2{Enter}')
    // Toggle first one
    await user.click(screen.getAllByRole('checkbox')[0])

    await user.click(screen.getByRole('button', { name: '清除已完成' }))

    expect(screen.queryByText('任务1')).not.toBeInTheDocument()
    expect(screen.getByText('任务2')).toBeInTheDocument()
  })

  it('should delete a todo', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByPlaceholderText('添加新任务...'), '要删除的{Enter}')
    await user.click(screen.getByRole('button', { name: '删除' }))

    expect(screen.queryByText('要删除的')).not.toBeInTheDocument()
    expect(screen.getByText('暂无任务')).toBeInTheDocument()
  })

  it('should edit a todo via double click', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByPlaceholderText('添加新任务...'), '旧文本{Enter}')
    await user.dblClick(screen.getByText('旧文本'))

    const editInput = screen.getByDisplayValue('旧文本')
    await user.clear(editInput)
    await user.type(editInput, '新文本{Enter}')

    expect(screen.getByText('新文本')).toBeInTheDocument()
    expect(screen.queryByText('旧文本')).not.toBeInTheDocument()
  })

  it('should show correct active count', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('添加新任务...')
    await user.type(input, 'A{Enter}')
    await user.type(input, 'B{Enter}')
    await user.type(input, 'C{Enter}')

    expect(screen.getByText('3 项未完成')).toBeInTheDocument()

    await user.click(screen.getAllByRole('checkbox')[0])

    expect(screen.getByText('2 项未完成')).toBeInTheDocument()
  })
})
