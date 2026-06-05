import { useState, useMemo, useEffect } from 'react'
import type { Todo } from '../types/todo'

interface TodoSearchProps {
  todos: Todo[]
  onResults: (results: Todo[] | null) => void
}

export function TodoSearch({ todos, onResults }: TodoSearchProps) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return null
    const lower = query.toLowerCase()
    return todos.filter(
      (t) =>
        t.text.toLowerCase().includes(lower) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(lower)),
    )
  }, [todos, query])

  useEffect(() => {
    onResults(results)
  }, [results, onResults])

  return (
    <div className="todo-search">
      <div className="todo-search-inner">
        <svg className="todo-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          placeholder="搜索任务..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {results && (
          <span className="search-count">{results.length} 项</span>
        )}
      </div>
    </div>
  )
}
