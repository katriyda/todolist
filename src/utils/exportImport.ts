import type { Todo } from '../types/todo'

export function exportTodos(todos: Todo[]): string {
  return JSON.stringify(todos, null, 2)
}

function isValidTodo(obj: unknown): obj is Todo {
  if (typeof obj !== 'object' || obj === null) return false
  const t = obj as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.text === 'string' &&
    typeof t.completed === 'boolean' &&
    typeof t.createdAt === 'number' &&
    typeof t.updatedAt === 'number'
  )
}

export function parseImportData(json: string): Todo[] | null {
  try {
    const data: unknown = JSON.parse(json)
    if (!Array.isArray(data)) return null
    if (!data.every(isValidTodo)) return null
    return data as Todo[]
  } catch {
    return null
  }
}
