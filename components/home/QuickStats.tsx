interface QuickStatsProps {
  totalQuestions: number
  accuracy: number
}

export default function QuickStats({ totalQuestions, accuracy }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
        <span className="text-xl">📝</span>
        <div>
          <div className="font-bold text-gray-900 text-lg leading-none">{totalQuestions.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-0.5">Questions solved</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
        <span className="text-xl">🎯</span>
        <div>
          <div className={`font-bold text-lg leading-none ${accuracy >= 70 ? 'text-green-600' : accuracy >= 50 ? 'text-amber-600' : 'text-gray-900'}`}>
            {accuracy}%
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Accuracy</div>
        </div>
      </div>
    </div>
  )
}
