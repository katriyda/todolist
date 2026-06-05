import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodos, todoReducer, createInitialState } from './useTodos'
import type { Todo, TodoState } from '../types/todo'

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: crypto.randomUUID(),
    text: '测试任务',
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  }
}

describe('todoReducer', () => {
  describe('ADD', () => {
    it('should add a todo to empty state', () => {
      const state = createInitialState()
      const todo = makeTodo({ text: '买菜' })

      const next = todoReducer(state, { type: 'ADD', payload: todo })

      expect(next.todos).toHaveLength(1)
      expect(next.todos[0].text).toBe('买菜')
    })

    it('should append new todo at the end', () => {
      const existing = makeTodo({ text: '已有任务' })
      const state: TodoState = {
        todos: [existing],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }
      const newTodo = makeTodo({ text: '新任务' })

      const next = todoReducer(state, { type: 'ADD', payload: newTodo })

      expect(next.todos).toHaveLength(2)
      expect(next.todos[1].text).toBe('新任务')
    })

    it('should not mutate original state', () => {
      const state = createInitialState()
      const todo = makeTodo()

      const next = todoReducer(state, { type: 'ADD', payload: todo })

      expect(state.todos).toHaveLength(0)
      expect(next.todos).toHaveLength(1)
    })
  })

  describe('DELETE', () => {
    it('should remove a todo by id', () => {
      const todo = makeTodo({ text: '要删除的' })
      const state: TodoState = {
        todos: [todo],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }

      const next = todoReducer(state, { type: 'DELETE', payload: { id: todo.id } })

      expect(next.todos).toHaveLength(0)
    })

    it('should not affect other todos', () => {
      const keep = makeTodo({ text: '保留' })
      const remove = makeTodo({ text: '删除' })
      const state: TodoState = {
        todos: [keep, remove],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }

      const next = todoReducer(state, { type: 'DELETE', payload: { id: remove.id } })

      expect(next.todos).toHaveLength(1)
      expect(next.todos[0].text).toBe('保留')
    })

    it('should handle deleting non-existent id gracefully', () => {
      const state = createInitialState()

      const next = todoReducer(state, { type: 'DELETE', payload: { id: 'nonexistent' } })

      expect(next.todos).toHaveLength(0)
    })
  })

  describe('TOGGLE', () => {
    it('should toggle completed to true', () => {
      const todo = makeTodo({ completed: false })
      const state: TodoState = {
        todos: [todo],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }

      const next = todoReducer(state, { type: 'TOGGLE', payload: { id: todo.id } })

      expect(next.todos[0].completed).toBe(true)
    })

    it('should toggle completed back to false', () => {
      const todo = makeTodo({ completed: true })
      const state: TodoState = {
        todos: [todo],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }

      const next = todoReducer(state, { type: 'TOGGLE', payload: { id: todo.id } })

      expect(next.todos[0].completed).toBe(false)
    })

    it('should update updatedAt on toggle', () => {
      const todo = makeTodo({ updatedAt: 1000 })
      const state: TodoState = {
        todos: [todo],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }

      const next = todoReducer(state, { type: 'TOGGLE', payload: { id: todo.id } })

      expect(next.todos[0].updatedAt).toBeGreaterThan(1000)
    })
  })

  describe('EDIT', () => {
    it('should update todo text', () => {
      const todo = makeTodo({ text: '旧文本' })
      const state: TodoState = {
        todos: [todo],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }

      const next = todoReducer(state, {
        type: 'EDIT',
        payload: { id: todo.id, text: '新文本' },
      })

      expect(next.todos[0].text).toBe('新文本')
    })

    it('should update updatedAt on edit', () => {
      const todo = makeTodo({ updatedAt: 1000 })
      const state: TodoState = {
        todos: [todo],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }

      const next = todoReducer(state, {
        type: 'EDIT',
        payload: { id: todo.id, text: '更新' },
      })

      expect(next.todos[0].updatedAt).toBeGreaterThan(1000)
    })

    it('should not affect other todos', () => {
      const a = makeTodo({ text: 'A' })
      const b = makeTodo({ text: 'B' })
      const state: TodoState = {
        todos: [a, b],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }

      const next = todoReducer(state, {
        type: 'EDIT',
        payload: { id: b.id, text: 'B改' },
      })

      expect(next.todos[0].text).toBe('A')
      expect(next.todos[1].text).toBe('B改')
    })
  })

  describe('SET_FILTER', () => {
    it('should change filter status', () => {
      const state = createInitialState()

      const next = todoReducer(state, { type: 'SET_FILTER', payload: 'active' })

      expect(next.filter).toBe('active')
    })

    it('should support all filter values', () => {
      let state = createInitialState()

      state = todoReducer(state, { type: 'SET_FILTER', payload: 'completed' })
      expect(state.filter).toBe('completed')

      state = todoReducer(state, { type: 'SET_FILTER', payload: 'all' })
      expect(state.filter).toBe('all')
    })
  })

  describe('CLEAR_COMPLETED', () => {
    it('should remove all completed todos', () => {
      const active = makeTodo({ text: '活跃', completed: false })
      const done = makeTodo({ text: '完成', completed: true })
      const state: TodoState = {
        todos: [active, done],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }

      const next = todoReducer(state, { type: 'CLEAR_COMPLETED' })

      expect(next.todos).toHaveLength(1)
      expect(next.todos[0].text).toBe('活跃')
    })

    it('should keep all todos when none completed', () => {
      const a = makeTodo({ completed: false })
      const b = makeTodo({ completed: false })
      const state: TodoState = {
        todos: [a, b],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }

      const next = todoReducer(state, { type: 'CLEAR_COMPLETED' })

      expect(next.todos).toHaveLength(2)
    })
  })

  describe('UNDO', () => {
    it('should undo ADD by removing the added todo', () => {
      const todo = makeTodo({ text: '要撤销的' })
      const state: TodoState = {
        todos: [todo],
        filter: 'all',
        editingId: null,
        undoStack: [{ type: 'ADD', payload: todo }],
      }

      const next = todoReducer(state, { type: 'UNDO' })

      expect(next.todos).toHaveLength(0)
      expect(next.undoStack).toHaveLength(0)
    })

    it('should undo DELETE by re-adding the deleted todo', () => {
      const todo = makeTodo({ text: '被删除的' })
      const state: TodoState = {
        todos: [],
        filter: 'all',
        editingId: null,
        undoStack: [{ type: 'DELETE', payload: todo }],
      }

      const next = todoReducer(state, { type: 'UNDO' })

      expect(next.todos).toHaveLength(1)
      expect(next.todos[0].text).toBe('被删除的')
    })

    it('should undo TOGGLE by toggling back', () => {
      const todo = makeTodo({ text: '任务', completed: true })
      const state: TodoState = {
        todos: [todo],
        filter: 'all',
        editingId: null,
        undoStack: [{ type: 'TOGGLE', payload: { id: todo.id } }],
      }

      const next = todoReducer(state, { type: 'UNDO' })

      expect(next.todos[0].completed).toBe(false)
    })

    it('should undo EDIT by restoring previous text', () => {
      const todo = makeTodo({ text: '新文本' })
      const state: TodoState = {
        todos: [todo],
        filter: 'all',
        editingId: null,
        undoStack: [
          { type: 'EDIT', payload: { id: todo.id, text: '旧文本' } },
        ],
      }

      const next = todoReducer(state, { type: 'UNDO' })

      expect(next.todos[0].text).toBe('旧文本')
    })

    it('should do nothing when undoStack is empty', () => {
      const todo = makeTodo()
      const state: TodoState = {
        todos: [todo],
        filter: 'all',
        editingId: null,
        undoStack: [],
      }

      const next = todoReducer(state, { type: 'UNDO' })

      expect(next.todos).toHaveLength(1)
      expect(next.undoStack).toHaveLength(0)
    })

    it('should support multiple undos in LIFO order', () => {
      const a = makeTodo({ text: 'A' })
      const b = makeTodo({ text: 'B' })
      const state: TodoState = {
        todos: [a, b],
        filter: 'all',
        editingId: null,
        undoStack: [
          { type: 'ADD', payload: b },
          { type: 'ADD', payload: a },
        ],
      }

      let next = todoReducer(state, { type: 'UNDO' })
      expect(next.todos).toHaveLength(1)
      expect(next.todos[0].text).toBe('B')

      next = todoReducer(next, { type: 'UNDO' })
      expect(next.todos).toHaveLength(0)
    })

    it('should limit undoStack to 10 entries', () => {
      // Build a state with 10 undo entries
      const undoStack = Array.from({ length: 10 }, (_, i) => ({
        type: 'ADD' as const,
        payload: makeTodo({ text: `任务${i}` }),
      }))
      const newTodo = makeTodo({ text: '第11个' })
      const state: TodoState = {
        todos: [newTodo],
        filter: 'all',
        editingId: null,
        undoStack,
      }

      // ADD should push to stack, but stack stays at max 10
      const next = todoReducer(state, { type: 'ADD', payload: makeTodo({ text: '新的' }) })

      expect(next.undoStack).toHaveLength(10)
    })
  })
})

describe('useTodos hook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useTodos())

    expect(result.current.state.todos).toHaveLength(0)
    expect(result.current.state.filter).toBe('all')
    expect(result.current.filteredTodos).toHaveLength(0)
    expect(result.current.activeCount).toBe(0)
    expect(result.current.completedCount).toBe(0)
  })

  it('should add a todo via dispatch', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.dispatch({
        type: 'ADD',
        payload: makeTodo({ text: '新任务' }),
      })
    })

    expect(result.current.state.todos).toHaveLength(1)
    expect(result.current.filteredTodos).toHaveLength(1)
    expect(result.current.activeCount).toBe(1)
    expect(result.current.completedCount).toBe(0)
  })

  it('should filter active todos', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.dispatch({
        type: 'ADD',
        payload: makeTodo({ text: '活跃', completed: false }),
      })
      result.current.dispatch({
        type: 'ADD',
        payload: makeTodo({ text: '完成', completed: true }),
      })
      result.current.dispatch({ type: 'SET_FILTER', payload: 'active' })
    })

    expect(result.current.filteredTodos).toHaveLength(1)
    expect(result.current.filteredTodos[0].text).toBe('活跃')
  })

  it('should filter completed todos', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.dispatch({
        type: 'ADD',
        payload: makeTodo({ text: '活跃', completed: false }),
      })
      result.current.dispatch({
        type: 'ADD',
        payload: makeTodo({ text: '完成', completed: true }),
      })
      result.current.dispatch({ type: 'SET_FILTER', payload: 'completed' })
    })

    expect(result.current.filteredTodos).toHaveLength(1)
    expect(result.current.filteredTodos[0].text).toBe('完成')
  })

  it('should count active and completed correctly', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.dispatch({
        type: 'ADD',
        payload: makeTodo({ text: 'A', completed: false }),
      })
      result.current.dispatch({
        type: 'ADD',
        payload: makeTodo({ text: 'B', completed: false }),
      })
      result.current.dispatch({
        type: 'ADD',
        payload: makeTodo({ text: 'C', completed: true }),
      })
    })

    expect(result.current.activeCount).toBe(2)
    expect(result.current.completedCount).toBe(1)
  })

  it('should update counts after toggle', () => {
    const todo = makeTodo({ text: '任务', completed: false })
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.dispatch({ type: 'ADD', payload: todo })
    })
    expect(result.current.activeCount).toBe(1)
    expect(result.current.completedCount).toBe(0)

    act(() => {
      result.current.dispatch({ type: 'TOGGLE', payload: { id: todo.id } })
    })
    expect(result.current.activeCount).toBe(0)
    expect(result.current.completedCount).toBe(1)
  })
})
