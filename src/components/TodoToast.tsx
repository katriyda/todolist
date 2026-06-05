import { useEffect } from 'react'

interface TodoToastProps {
  message: string
  onUndo: () => void
  onDismiss: () => void
}

export function TodoToast({ message, onUndo, onDismiss }: TodoToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="todo-toast" role="alert">
      <span>{message}</span>
      <button type="button" onClick={onUndo}>
        撤销
      </button>
    </div>
  )
}
