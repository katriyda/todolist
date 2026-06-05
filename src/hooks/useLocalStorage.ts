import { useState, useEffect, useRef, useCallback } from 'react'

const DEBOUNCE_MS = 300

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
    } catch {
      // Invalid JSON or localStorage error — use initial
    }
    return initialValue
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setStoredValue = useCallback(
    (newValue: T) => {
      setValue(newValue)

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(newValue))
        } catch {
          // Storage full or private mode — silently fail
        }
        timerRef.current = null
      }, DEBOUNCE_MS)
    },
    [key],
  )

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return [value, setStoredValue] as const
}
