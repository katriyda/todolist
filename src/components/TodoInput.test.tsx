import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoInput } from './TodoInput'

describe('TodoInput', () => {
  it('should call onAdd with trimmed text on Enter', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('添加新任务...')
    await user.type(input, '  买菜  {Enter}')

    expect(onAdd).toHaveBeenCalledWith('买菜')
  })

  it('should clear input after submit', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('添加新任务...')
    await user.type(input, '任务{Enter}')

    expect(input).toHaveValue('')
  })

  it('should not submit empty text', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('添加新任务...')
    await user.type(input, '   {Enter}')

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('should not submit whitespace-only text', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('添加新任务...')
    await user.type(input, '  \t  {Enter}')

    expect(onAdd).not.toHaveBeenCalled()
  })
})
