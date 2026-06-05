import { useState, type KeyboardEvent } from 'react'

interface TodoInputProps {
  onAdd: (text: string) => void
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState('')

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return

    const trimmed = value.trim()
    if (trimmed) {
      onAdd(trimmed)
      setValue('')
    }
  }

  function handleAdd() {
    const trimmed = value.trim()
    if (trimmed) {
      onAdd(trimmed)
      setValue('')
    }
  }

  return (
    <div className="todo-input-wrapper">
      <svg className="todo-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      <input
        type="text"
        placeholder="添加新任务..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" className="add-btn" onClick={handleAdd}>
        添加
      </button>
    </div>
  )
}
