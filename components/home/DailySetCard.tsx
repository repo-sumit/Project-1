import type { DailySet, SetMix } from '@/types'

interface DailySetCardProps {
  dailySet:   DailySet
  onStart:    () => void
  isStarting: boolean
}

export default function DailySetCard({ dailySet, onStart, isStarting }: DailySetCardProps) {
  if (dailySet.isCompleted) {
    return <CompletedCard dailySet={dailySet} />
  }

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-5 shadow-md">
      {/* Label row */}
      <div className="flex items-center gap-1.5 mb-4">
        <span className="text-orange-200 text-xs font-semibold uppercase tracking-widest">
          Today&apos;s Set
        </span>
        <span className="text-orange-300 text-xs">·</span>
        <span className="text-orange-200 text-xs">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long' })}
        </span>
      </div>

      {/* Subject chips */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {dailySet.subjects.map((subject) => (
          <span
            key={subject}
            className="bg-orange-400/40 text-white text-xs font-medium px-2.5 py-1 rounded-full"
          >
            {subject}
          </span>
        ))}
      </div>

      {/* Mix chips — only shown when the smart-selection mix is available */}
      {dailySet.mix && <MixChips mix={dailySet.mix} />}

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1.5 text-white/90 text-sm">
          <span>📝</span>
          <span><strong>{dailySet.questionCount}</strong> questions</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/90 text-sm">
          <span>⏱</span>
          <span>~<strong>{dailySet.estimatedMinutes}</strong> min</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        disabled={isStarting}
        className="
          w-full py-3.5 bg-white text-orange-600 font-bold rounded-2xl
          active:bg-orange-50 transition-colors duration-100
          disabled:opacity-70
          flex items-center justify-center gap-2 text-base
        "
      >
        {isStarting ? (
          <>
            <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            Starting...
          </>
        ) : (
          'Start Practice 🚀'
        )}
      </button>
    </div>
  )
}

// ─── MixChips ─────────────────────────────────────────────────────────────────
// Shows a compact breakdown of how the set was personalised.
// Only chips with count > 0 are rendered, so a brand-new student
// (exploration: 10, focus: 0, reinforcement: 0) only sees "✨ 10 New".

function MixChips({ mix }: { mix: SetMix }) {
  const chips = [
    { label: 'Weak',   count: mix.focus,        icon: '🎯', show: mix.focus         > 0 },
    { label: 'Recent', count: mix.reinforcement, icon: '🔄', show: mix.reinforcement > 0 },
    { label: 'New',    count: mix.exploration,   icon: '✨', show: mix.exploration   > 0 },
  ].filter((c) => c.show)

  if (chips.length === 0) return null

  return (
    <div className="flex gap-1.5 mb-4 flex-wrap">
      {chips.map((chip) => (
        <span
          key={chip.label}
          className="flex items-center gap-1 bg-white/15 text-white/90 text-[11px] font-medium px-2 py-0.5 rounded-full"
        >
          <span>{chip.icon}</span>
          <span>{chip.count} {chip.label}</span>
        </span>
      ))}
    </div>
  )
}

// ─── CompletedCard ────────────────────────────────────────────────────────────

function CompletedCard({ dailySet }: { dailySet: DailySet }) {
  return (
    <div className="bg-green-50 border border-green-100 rounded-3xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">✅</span>
        <div>
          <div className="font-semibold text-green-800">Today&apos;s set done!</div>
          <div className="text-sm text-green-600">
            {dailySet.questionCount} questions · {dailySet.subjects.join(', ')}
          </div>
        </div>
      </div>
      {/* Show mix summary in completed state if available */}
      {dailySet.mix && (
        <p className="text-xs text-green-600 mb-3">
          {[
            dailySet.mix.focus         > 0 && `🎯 ${dailySet.mix.focus} weak spots`,
            dailySet.mix.reinforcement > 0 && `🔄 ${dailySet.mix.reinforcement} reinforced`,
            dailySet.mix.exploration   > 0 && `✨ ${dailySet.mix.exploration} new`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}
      <p className="text-sm text-green-700">
        Come back tomorrow for a new set. Keep your streak going! 🔥
      </p>
    </div>
  )
}
