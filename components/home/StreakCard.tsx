interface StreakCardProps {
  currentStreak: number
  longestStreak: number
}

export default function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  const isActive = currentStreak > 0

  return (
    <div className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
      isActive ? 'bg-orange-50' : 'bg-gray-50'
    }`}>
      {/* Left: streak flame */}
      <div className="flex items-center gap-3">
        <span className={`text-2xl ${isActive ? 'animate-pulse-once' : 'grayscale opacity-50'}`}>
          🔥
        </span>
        <div>
          <div className="font-bold text-gray-900 text-base leading-tight">
            {currentStreak === 0 ? 'No streak yet' : `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`}
          </div>
          <div className="text-xs text-gray-500">
            {currentStreak === 0
              ? 'Complete today\'s set to start'
              : 'Current streak'}
          </div>
        </div>
      </div>

      {/* Right: longest streak badge */}
      {longestStreak > 0 && (
        <div className="text-right">
          <div className="text-xs text-gray-400">Best</div>
          <div className="text-sm font-semibold text-orange-500">{longestStreak}d 🏆</div>
        </div>
      )}
    </div>
  )
}
