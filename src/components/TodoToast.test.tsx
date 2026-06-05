import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoToast } from './TodoToast'

describe('TodoToast', () => {
  it('should render toast message', () => {
    render(
      <TodoToast
        message="任务已删除"
        onUndo={vi.fn()}
        onDismiss={vi.fn()}
      />,
    )

    expect(screen.getByText('任务已删除')).toBeInTheDocument()
  })

  it('should render undo button', () => {
    render(
      <TodoToast
        message="任务已删除"
        onUndo={vi.fn()}
        onDismiss={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '撤销' })).toBeInTheDocument()
  })

  it('should call onUndo when undo clicked', async () => {
    const user = userEvent.setup()
    const onUndo = vi.fn()
    render(
      <TodoToast message="任务已删除" onUndo={onUndo} onDismiss={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: '撤销' }))

    expect(onUndo).toHaveBeenCalledTimes(1)
  })

  it('should call onDismiss after 5 seconds', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(
      <TodoToast
        message="任务已删除"
        onUndo={vi.fn()}
        onDismiss={onDismiss}
      />,
    )

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(onDismiss).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('should not dismiss before 5 seconds', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(
      <TodoToast
        message="任务已删除"
        onUndo={vi.fn()}
        onDismiss={onDismiss}
      />,
    )

    act(() => {
      vi.advanceTimersByTime(4999)
    })

    expect(onDismiss).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('should clear timer on unmount', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    const { unmount } = render(
      <TodoToast
        message="任务已删除"
        onUndo={vi.fn()}
        onDismiss={onDismiss}
      />,
    )

    unmount()
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(onDismiss).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
