import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('should default to system preference', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBeDefined()
    expect(['light', 'dark']).toContain(result.current.theme)
  })

  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme())

    const initial = result.current.theme
    act(() => {
      result.current.toggle()
    })

    expect(result.current.theme).toBe(initial === 'light' ? 'dark' : 'light')
  })

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggle()
    })

    expect(localStorage.getItem('todo-theme')).toBe(result.current.theme)
  })

  it('should read saved theme from localStorage', () => {
    localStorage.setItem('todo-theme', 'dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
  })

  it('should set data-theme attribute on document', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggle()
    })

    expect(document.documentElement.getAttribute('data-theme')).toBe(
      result.current.theme,
    )
  })
})
