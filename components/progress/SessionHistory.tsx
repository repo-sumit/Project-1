import type { RecentSession } from '@/types'

interface SessionHistoryProps {
  session: RecentSession
}

export default function SessionHistory({ session }: SessionHistoryProps) {
  const dateStr = new Date(session.date + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })

  const accuracyColor =
    session.accuracyPct >= 70 ? 'text-green-600' :
    session.accuracyPct >= 50 ? 'text-amber-600' :
    'text-red-500'

  return (
    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between">
      {/* Left: date + subject */}
      <div>
        <div className="text-sm font-medium text-gray-800">
          {session.subjectName}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">{dateStr}</div>
      </div>

      {/* Right: score + accuracy */}
      <div className="text-right">
        <div className="font-bold text-gray-900">
          {session.score}<span className="text-gray-400 font-normal">/{session.total}</span>
        </div>
        <div className={`text-xs font-medium ${accuracyColor}`}>
          {session.accuracyPct}%
        </div>
      </div>
    </div>
  )
}
