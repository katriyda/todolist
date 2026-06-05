import { useMemo } from 'react'

interface TodoDatePickerProps {
  value: string | null
  onChange: (date: string) => void
}

export function TodoDatePicker({ value, onChange }: TodoDatePickerProps) {
  const isOverdue = useMemo(() => {
    if (!value) return false
    return value < new Date().toISOString().slice(0, 10)
  }, [value])

  return (
    <span className="todo-date-picker">
      <input
        type="date"
        role="textbox"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
      {isOverdue && <span className="overdue">已逾期</span>}
    </span>
  )
}
