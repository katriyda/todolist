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
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="todo-app">
      <div className="todo-actions">
        <button type="button" onClick={toggleTheme}>
          {theme === 'light' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          )}
          {theme === 'light' ? '深色' : '浅色'}
        </button>
        <button type="button" onClick={handleExport}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          导出
        </button>
        <label>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          导入
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            hidden
          />
        </label>
      </div>

      <div className="todo-header">
        <div className="todo-eyebrow">Task Manager</div>
        <h1>待办事项</h1>
        <p className="todo-subtitle">
          {activeCount > 0
            ? `${activeCount} 项任务等待完成`
            : '所有任务已完成'}
        </p>
      </div>

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
