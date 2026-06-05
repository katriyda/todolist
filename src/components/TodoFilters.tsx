import type { FilterStatus } from '../types/todo'

interface TodoFiltersProps {
  current: FilterStatus
  activeCount: number
  completedCount: number
  onFilterChange: (filter: FilterStatus) => void
  onClearCompleted: () => void
}

const filters: { label: string; value: FilterStatus }[] = [
  { label: '全部', value: 'all' },
  { label: '未完成', value: 'active' },
  { label: '已完成', value: 'completed' },
]

export function TodoFilters({
  current,
  activeCount,
  completedCount,
  onFilterChange,
  onClearCompleted,
}: TodoFiltersProps) {
  return (
    <div className="todo-filters">
      <span>{activeCount} 项未完成</span>
      <div className="filter-buttons">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={current === f.value}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {completedCount > 0 && (
        <button type="button" onClick={onClearCompleted}>
          清除已完成
        </button>
      )}
    </div>
  )
}
