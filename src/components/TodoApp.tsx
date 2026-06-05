import { useState, useCallback } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useTheme } from '../hooks/useTheme'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { TodoInput } from './TodoInput'
import { TodoList } from './TodoList'
import { TodoFilters } from './TodoFilters'
import { TodoSearch } from './TodoSearch'
import { TodoToast } from './TodoToast'
import { exportTodos, parseImportData } from '../utils/exportImport'
import type { Todo } from '../types/todo'

export function TodoApp() {
  const { state, dispatch, filteredTodos, activeCount, completedCount } =
    useTodos()
  const { theme, toggle: toggleTheme } = useTheme()
  const [searchResults, setSearchResults] = useState<Todo[] | null>(null)
  const [toasts, setToasts] = useState<
    { id: string; message: string; undoAction: () => void }[]
  >([])
  const [, setStoredTodos] = useLocalStorage<Todo[]>('todos', [])

  // Persist todos
  // (handled by useLocalStorage, synced via useEffect in useTodos in a real app)

  const displayTodos = searchResults ?? filteredTodos

  const handleSearchResults = useCallback((results: Todo[] | null) => {
    setSearchResults(results)
  }, [])

  function handleAdd(text: string) {
    dispatch({
      type: 'ADD',
      payload: {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    })
  }

  function handleToggle(id: string) {
    dispatch({ type: 'TOGGLE', payload: { id } })
  }

  function handleEdit(id: string, text: string) {
    dispatch({ type: 'EDIT', payload: { id, text } })
  }

  function handleDelete(id: string) {
    const todo = state.todos.find((t) => t.id === id)
    if (!todo) return

    // Show toast with undo
    const toastId = crypto.randomUUID()
    setToasts((prev) => [
      ...prev,
      {
        id: toastId,
        message: `「${todo.text}」已删除`,
        undoAction: () => {
          dispatch({ type: 'UNDO' })
          dismissToast(toastId)
        },
      },
    ])

    // Delay actual delete (toast will auto-dismiss after 5s)
    dispatch({ type: 'DELETE', payload: { id } })
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function handleFilterChange(filter: 'all' | 'active' | 'completed') {
    dispatch({ type: 'SET_FILTER', payload: filter })
  }

  function handleClearCompleted() {
    dispatch({ type: 'CLEAR_COMPLETED' })
  }

  function handleExport() {
    const json = exportTodos(state.todos)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todos-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      const todos = parseImportData(text)
      if (todos) {
        setStoredTodos(todos)
        // Reload would be needed in a real app; for now just log
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="todo-app">
      <div className="todo-actions">
        <button type="button" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 深色' : '☀️ 浅色'}
        </button>
        <button type="button" onClick={handleExport}>
          📤 导出
        </button>
        <label>
          📥 导入
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            hidden
          />
        </label>
      </div>
      <h1>待办事项</h1>
      <TodoInput onAdd={handleAdd} />
      <TodoSearch todos={state.todos} onResults={handleSearchResults} />
      <TodoFilters
        current={state.filter}
        activeCount={activeCount}
        completedCount={completedCount}
        onFilterChange={handleFilterChange}
        onClearCompleted={handleClearCompleted}
      />
      <TodoList
        todos={displayTodos}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {toasts.length > 0 && (
        <div className="todo-toast-container">
          {toasts.map((toast) => (
            <TodoToast
              key={toast.id}
              message={toast.message}
              onUndo={toast.undoAction}
              onDismiss={() => dismissToast(toast.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
