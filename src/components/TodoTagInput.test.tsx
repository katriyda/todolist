import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoTagInput } from './TodoTagInput'

describe('TodoTagInput', () => {
  it('should render tag input', () => {
    render(<TodoTagInput tags={[]} onChange={vi.fn()} />)

    expect(screen.getByPlaceholderText('添加标签...')).toBeInTheDocument()
  })

  it('should display existing tags', () => {
    render(<TodoTagInput tags={['工作', '重要']} onChange={vi.fn()} />)

    expect(screen.getByText('工作')).toBeInTheDocument()
    expect(screen.getByText('重要')).toBeInTheDocument()
  })

  it('should add tag on Enter', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TodoTagInput tags={[]} onChange={onChange} />)

    await user.type(screen.getByPlaceholderText('添加标签...'), '工作{Enter}')

    expect(onChange).toHaveBeenCalledWith(['工作'])
  })

  it('should trim tag text', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TodoTagInput tags={[]} onChange={onChange} />)

    await user.type(screen.getByPlaceholderText('添加标签...'), '  工作  {Enter}')

    expect(onChange).toHaveBeenCalledWith(['工作'])
  })

  it('should not add empty tag', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TodoTagInput tags={[]} onChange={onChange} />)

    await user.type(screen.getByPlaceholderText('添加标签...'), '   {Enter}')

    expect(onChange).not.toHaveBeenCalled()
  })

  it('should not add duplicate tag', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TodoTagInput tags={['工作']} onChange={onChange} />)

    await user.type(screen.getByPlaceholderText('添加标签...'), '工作{Enter}')

    expect(onChange).not.toHaveBeenCalled()
  })

  it('should remove tag when clicking delete', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TodoTagInput tags={['工作', '个人']} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: '删除 工作' }))

    expect(onChange).toHaveBeenCalledWith(['个人'])
  })

  it('should clear input after adding tag', async () => {
    const user = userEvent.setup()
    render(<TodoTagInput tags={[]} onChange={vi.fn()} />)

    const input = screen.getByPlaceholderText('添加标签...')
    await user.type(input, '工作{Enter}')

    expect(input).toHaveValue('')
  })

  it('should show preset tags', () => {
    render(<TodoTagInput tags={[]} onChange={vi.fn()} />)

    expect(screen.getByText('工作')).toBeInTheDocument()
    expect(screen.getByText('个人')).toBeInTheDocument()
    expect(screen.getByText('购物')).toBeInTheDocument()
  })

  it('should add preset tag on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TodoTagInput tags={[]} onChange={onChange} />)

    // Click the preset "工作" button (not the tag chip)
    const presetButtons = screen.getAllByText('工作')
    // The first one is the preset button, second would be a chip if it existed
    await user.click(presetButtons[0])

    expect(onChange).toHaveBeenCalledWith(['工作'])
  })
})
