import { useState, useRef, useEffect, memo } from 'react'
import type { Todo } from '../types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  function handleDoubleClick() {
    setEditing(true)
    setEditText(todo.text)
  }

  function saveEdit() {
    const trimmed = editText.trim()
    if (trimmed === todo.text) {
      setEditing(false)
      return
    }
    if (trimmed === '') {
      onDelete(todo.id)
      return
    }
    onEdit(todo.id, trimmed)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      setEditText(todo.text)
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <li className="todo-item editing">
        <input
          ref={inputRef}
          type="text"
          className="todo-text-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={saveEdit}
        />
      </li>
    )
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <div className="checkbox-visual">
          <svg viewBox="0 0 12 12">
            <polyline points="2 6 5 9 10 3" />
          </svg>
        </div>
      </div>
      <div className="todo-content">
        <span className="todo-text" onDoubleClick={handleDoubleClick}>
          {todo.text}
        </span>
        {todo.dueDate && (
          <span className={`due-date${new Date(todo.dueDate).getTime() < Date.now() && !todo.completed ? ' overdue' : ''}`}>
            <svg className="due-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {new Date(todo.dueDate).toLocaleDateString('zh-CN')}
          </span>
        )}
        {todo.tags && todo.tags.length > 0 && (
          <div className="tag-chips">
            {todo.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label="删除"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </li>
  )
})
