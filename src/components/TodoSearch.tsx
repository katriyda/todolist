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
    <input
      type="text"
      placeholder="搜索任务..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}
