import { useState, type KeyboardEvent } from 'react'

interface TodoTagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

const PRESET_TAGS = ['工作', '个人', '购物', '学习', '健康']

export function TodoTagInput({ tags, onChange }: TodoTagInputProps) {
  const [value, setValue] = useState('')

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (!trimmed || tags.includes(trimmed)) return
    onChange([...tags, trimmed])
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    addTag(value)
    setValue('')
  }

  const availablePresets = PRESET_TAGS.filter((p) => !tags.includes(p))

  return (
    <div className="todo-tag-input">
      <div className="tag-chips">
        {tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
            <button
              type="button"
              aria-label={`删除 ${tag}`}
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder="添加标签..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {availablePresets.length > 0 && (
        <div className="preset-tags">
          {availablePresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => addTag(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
