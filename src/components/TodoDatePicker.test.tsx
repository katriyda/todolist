import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoDatePicker } from './TodoDatePicker'

describe('TodoDatePicker', () => {
  it('should render date input', () => {
    render(<TodoDatePicker value={null} onChange={vi.fn()} />)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should display current value', () => {
    render(<TodoDatePicker value="2026-06-15" onChange={vi.fn()} />)

    expect(screen.getByRole('textbox')).toHaveValue('2026-06-15')
  })

  it('should call onChange when date selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TodoDatePicker value={null} onChange={onChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, '2026-06-15')

    expect(onChange).toHaveBeenCalledWith('2026-06-15')
  })

  it('should show overdue indicator for past dates', () => {
    const pastDate = '2020-01-01'
    render(<TodoDatePicker value={pastDate} onChange={vi.fn()} />)

    expect(screen.getByText('已逾期')).toBeInTheDocument()
  })

  it('should not show overdue for future dates', () => {
    const futureDate = '2099-12-31'
    render(<TodoDatePicker value={futureDate} onChange={vi.fn()} />)

    expect(screen.queryByText('已逾期')).not.toBeInTheDocument()
  })

  it('should not show overdue when no date set', () => {
    render(<TodoDatePicker value={null} onChange={vi.fn()} />)

    expect(screen.queryByText('已逾期')).not.toBeInTheDocument()
  })
})
