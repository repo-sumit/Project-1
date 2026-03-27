interface ProgressBarProps {
  value: number        // 0–100
  color?: string       // Tailwind bg class
  height?: string      // Tailwind h class
  showLabel?: boolean
  animated?: boolean
}

export default function ProgressBar({
  value,
  color = 'bg-orange-500',
  height = 'h-2',
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1 text-right">{clamped}%</p>
      )}
    </div>
  )
}
