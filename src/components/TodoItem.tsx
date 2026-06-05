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
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={saveEdit}
        />
      </li>
    )
  }

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span onDoubleClick={handleDoubleClick}>{todo.text}</span>
      <button type="button" onClick={() => onDelete(todo.id)}>
        删除
      </button>
    </li>
  )
})
