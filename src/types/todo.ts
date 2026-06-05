export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  updatedAt: number
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
  dueDate?: string
}

export type FilterStatus = 'all' | 'active' | 'completed'

export interface TodoState {
  todos: Todo[]
  filter: FilterStatus
  editingId: string | null
  undoStack: TodoAction[]
}

export type TodoAction =
  | { type: 'ADD'; payload: Todo }
  | { type: 'DELETE'; payload: { id: string } }
  | { type: 'TOGGLE'; payload: { id: string } }
  | { type: 'EDIT'; payload: { id: string; text: string } }
  | { type: 'SET_FILTER'; payload: FilterStatus }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'UNDO' }
