import { useReducer, useMemo } from 'react'
import type { TodoState, TodoAction, FilterStatus, Todo } from '../types/todo'

const MAX_UNDO_STACK = 10

function pushUndo(state: TodoState, action: TodoAction): TodoState {
  return {
    ...state,
    undoStack: [...state.undoStack, action].slice(-MAX_UNDO_STACK),
  }
}

export function createInitialState(): TodoState {
  return {
    todos: [],
    filter: 'all',
    editingId: null,
    undoStack: [],
  }
}

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        ...pushUndo(state, { type: 'ADD', payload: action.payload }),
        todos: [...state.todos, action.payload],
      }
    case 'DELETE': {
      const deleted = state.todos.find((t) => t.id === action.payload.id)
      if (!deleted) return state
      return {
        ...pushUndo(state, { type: 'DELETE', payload: deleted }),
        todos: state.todos.filter((t) => t.id !== action.payload.id),
      }
    }
    case 'TOGGLE': {
      const target = state.todos.find((t) => t.id === action.payload.id)
      if (!target) return state
      return {
        ...pushUndo(state, { type: 'TOGGLE', payload: { id: action.payload.id } }),
        todos: state.todos.map((t) =>
          t.id === action.payload.id
            ? { ...t, completed: !t.completed, updatedAt: Date.now() }
            : t,
        ),
      }
    }
    case 'EDIT': {
      const target = state.todos.find((t) => t.id === action.payload.id)
      if (!target) return state
      return {
        ...pushUndo(state, {
          type: 'EDIT',
          payload: { id: action.payload.id, text: target.text },
        }),
        todos: state.todos.map((t) =>
          t.id === action.payload.id
            ? { ...t, text: action.payload.text, updatedAt: Date.now() }
            : t,
        ),
      }
    }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter((t) => !t.completed),
      }
    case 'UNDO': {
      if (state.undoStack.length === 0) return state
      const last = state.undoStack[state.undoStack.length - 1]!
      const rest = state.undoStack.slice(0, -1)
      const base: TodoState = { ...state, undoStack: rest }

      switch (last.type) {
        case 'ADD':
          return {
            ...base,
            todos: base.todos.filter((t) => t.id !== last.payload.id),
          }
        case 'DELETE':
          return {
            ...base,
            todos: [...base.todos, last.payload as Todo],
          }
        case 'TOGGLE':
          return {
            ...base,
            todos: base.todos.map((t) =>
              t.id === last.payload.id
                ? { ...t, completed: !t.completed }
                : t,
            ),
          }
        case 'EDIT':
          return {
            ...base,
            todos: base.todos.map((t) =>
              t.id === last.payload.id
                ? { ...t, text: last.payload.text }
                : t,
            ),
          }
        default:
          return base
      }
    }
    default:
      return state
  }
}

function filterTodos(todos: Todo[], filter: FilterStatus): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter((t) => !t.completed)
    case 'completed':
      return todos.filter((t) => t.completed)
    default:
      return todos
  }
}

export function useTodos() {
  const [state, dispatch] = useReducer(todoReducer, undefined, createInitialState)

  const filteredTodos = useMemo(
    () => filterTodos(state.todos, state.filter),
    [state.todos, state.filter],
  )

  const activeCount = useMemo(
    () => state.todos.filter((t) => !t.completed).length,
    [state.todos],
  )

  const completedCount = useMemo(
    () => state.todos.filter((t) => t.completed).length,
    [state.todos],
  )

  return { state, dispatch, filteredTodos, activeCount, completedCount }
}
