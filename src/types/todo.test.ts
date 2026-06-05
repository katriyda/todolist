import { describe, it, expect } from 'vitest'
import type { Todo, FilterStatus } from './todo'

describe('Todo type', () => {
  it('should create a todo with required fields', () => {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: '买菜',
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    expect(todo.id).toBeTypeOf('string')
    expect(todo.text).toBe('买菜')
    expect(todo.completed).toBe(false)
    expect(todo.createdAt).toBeTypeOf('number')
    expect(todo.updatedAt).toBeTypeOf('number')
  })

  it('should allow optional fields', () => {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: '写报告',
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      priority: 'high',
      tags: ['工作', '重要'],
      dueDate: '2026-06-15',
    }

    expect(todo.priority).toBe('high')
    expect(todo.tags).toEqual(['工作', '重要'])
    expect(todo.dueDate).toBe('2026-06-15')
  })
})

describe('FilterStatus type', () => {
  it('should accept valid filter values', () => {
    const filters: FilterStatus[] = ['all', 'active', 'completed']

    expect(filters).toHaveLength(3)
    expect(filters).toContain('all')
    expect(filters).toContain('active')
    expect(filters).toContain('completed')
  })
})
