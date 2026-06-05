import { describe, it, expect } from 'vitest'
import { exportTodos, parseImportData } from './exportImport'
import type { Todo } from '../types/todo'

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: 'test-1',
    text: '测试任务',
    completed: false,
    createdAt: 1000,
    updatedAt: 1000,
    ...overrides,
  }
}

describe('exportTodos', () => {
  it('should return valid JSON string', () => {
    const todos = [makeTodo({ text: '买菜' })]

    const json = exportTodos(todos)
    const parsed = JSON.parse(json)

    expect(parsed).toHaveLength(1)
    expect(parsed[0].text).toBe('买菜')
  })

  it('should preserve all todo fields', () => {
    const todo = makeTodo({
      text: '完整任务',
      completed: true,
      priority: 'high',
      tags: ['工作'],
      dueDate: '2026-06-15',
    })

    const json = exportTodos([todo])
    const parsed = JSON.parse(json) as Todo[]

    expect(parsed[0].text).toBe('完整任务')
    expect(parsed[0].completed).toBe(true)
    expect(parsed[0].priority).toBe('high')
    expect(parsed[0].tags).toEqual(['工作'])
    expect(parsed[0].dueDate).toBe('2026-06-15')
  })

  it('should handle empty array', () => {
    const json = exportTodos([])

    expect(JSON.parse(json)).toEqual([])
  })
})

describe('parseImportData', () => {
  it('should parse valid JSON array', () => {
    const todos = [makeTodo()]
    const json = JSON.stringify(todos)

    const result = parseImportData(json)

    expect(result).toHaveLength(1)
    expect(result![0].id).toBe('test-1')
  })

  it('should return null for invalid JSON', () => {
    const result = parseImportData('not json')

    expect(result).toBeNull()
  })

  it('should return null for non-array JSON', () => {
    const result = parseImportData('{"foo": "bar"}')

    expect(result).toBeNull()
  })

  it('should validate required fields', () => {
    const invalid = [{ id: '1', text: '缺少字段' }] // missing completed, createdAt, updatedAt

    const result = parseImportData(JSON.stringify(invalid))

    expect(result).toBeNull()
  })

  it('should accept valid todos with all required fields', () => {
    const valid = [
      {
        id: '1',
        text: '有效任务',
        completed: false,
        createdAt: 1000,
        updatedAt: 1000,
      },
    ]

    const result = parseImportData(JSON.stringify(valid))

    expect(result).toHaveLength(1)
    expect(result![0].text).toBe('有效任务')
  })
})
