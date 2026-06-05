import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default'),
    )

    expect(result.current[0]).toBe('default')
  })

  it('should read existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'))

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default'),
    )

    expect(result.current[0]).toBe('stored')
  })

  it('should save to localStorage after debounce', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial'),
    )

    act(() => {
      result.current[1]('updated')
    })

    // Not saved yet (within debounce window)
    expect(localStorage.getItem('test-key')).toBeNull()

    // Advance past debounce
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('updated')
  })

  it('should debounce multiple rapid updates', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial'),
    )

    act(() => {
      result.current[1]('a')
      vi.advanceTimersByTime(100)
      result.current[1]('b')
      vi.advanceTimersByTime(100)
      result.current[1]('c')
    })

    // Only 200ms passed, not saved yet
    expect(localStorage.getItem('test-key')).toBeNull()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Only the last value should be saved
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('c')
  })

  it('should handle localStorage read errors gracefully', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback'),
    )

    expect(result.current[0]).toBe('fallback')
    spy.mockRestore()
  })

  it('should handle localStorage write errors gracefully', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial'),
    )

    // Should not throw
    act(() => {
      result.current[1]('updated')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Value should still update in memory
    expect(result.current[0]).toBe('updated')
    spy.mockRestore()
  })

  it('should handle invalid JSON in localStorage', () => {
    localStorage.setItem('test-key', 'not-valid-json{{{')

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback'),
    )

    expect(result.current[0]).toBe('fallback')
  })
})
