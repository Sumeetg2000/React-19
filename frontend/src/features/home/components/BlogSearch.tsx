import type { ReactElement } from 'react'

interface BlogSearchProps {
  value: string
  onChange: (value: string) => void
}

export function BlogSearch({ value, onChange }: BlogSearchProps): ReactElement {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search blogs..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  )
}
