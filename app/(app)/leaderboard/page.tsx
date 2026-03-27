'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

interface LeaderboardEntry {
  rank:        number
  name:        string
  xp:          number
  streak:      number
  isCurrentUser: boolean
  avatar:      string  // first letter of name
}

interface LeaderboardData {
  league:           string
  leagueIcon:       string
  weekStart:        string
  userRank:         number
  userXp:           number
  promotionCutoff:  number
  relegationCutoff: number
  entries:          LeaderboardEntry[]
}

const LEAGUE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  bronze:   { label: 'Bronze',   color: 'text-amber-700',   bg: 'bg-amber-50',   icon: '🥉' },
  silver:   { label: 'Silver',   color: 'text-gray-600',    bg: 'bg-gray-50',    icon: '🥈' },
  gold:     { label: 'Gold',     color: 'text-yellow-600',  bg: 'bg-yellow-50',  icon: '🥇' },
  platinum: { label: 'Platinum', color: 'text-cyan-700',    bg: 'bg-cyan-50',    icon: '💎' },
  diamond:  { label: 'Diamond',  color: 'text-blue-700',    bg: 'bg-blue-50',    icon: '💠' },
}

export default function LeaderboardPage() {
  const router = useRouter()
  const user   = useUserStore((s) => s.user)

  const [data,      setData]      = useState<LeaderboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadLeaderboard()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  async function loadLeaderboard() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/leaderboard?userId=${user!.id}`)
      if (!res.ok) throw new Error('Failed')
      setData(await res.json())
    } catch {
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const leagueConfig = data ? (LEAGUE_CONFIG[data.league] ?? LEAGUE_CONFIG.bronze) : LEAGUE_CONFIG.bronze

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className={`${leagueConfig.bg} px-4 pt-12 pb-6`}>
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => router.back()} className="tap-target">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Leaderboard</h1>
        </div>

        {data && (
          <div className="flex items-center justify-between mt-4">
            {/* League badge */}
            <div className="flex items-center gap-2">
              <span className="text-3xl">{leagueConfig.icon}</span>
              <div>
                <div className={`font-bold text-base ${leagueConfig.color}`}>
                  {leagueConfig.label} League
                </div>
                <div className="text-xs text-gray-500">
                  Week of {new Date(data.weekStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>
            {/* User rank summary */}
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">#{data.userRank}</div>
              <div className="text-xs text-gray-500">{data.userXp} XP this week</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Promotion / relegation notice ──────────────────────────────── */}
      {data && (
        <div className="px-4 py-2 flex gap-2 text-xs">
          <span className="flex items-center gap-1 text-green-600">
            ↑ Top {data.promotionCutoff} promote
          </span>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-1 text-red-500">
            ↓ Bottom 5 relegate
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400">Resets Monday</span>
        </div>
      )}

      {/* ── Rankings list ───────────────────────────────────────────────── */}
      <div className="px-4 pb-8 mt-2">
        {isLoading ? (
          <LeaderboardSkeleton />
        ) : !data ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-2">
            {data.entries.map((entry, i) => (
              <LeaderboardRow
                key={entry.rank}
                entry={entry}
                isPromotion={entry.rank <= data.promotionCutoff}
                isRelegation={entry.rank > data.relegationCutoff}
                showDivider={entry.rank === data.promotionCutoff}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Weekly reset reminder ───────────────────────────────────────── */}
      {!isLoading && data && (
        <div className="px-4 pb-8 text-center">
          <p className="text-xs text-gray-400">
            Earn XP by completing Daily Sets and Chapter Practice.
            More practice = higher rank 🚀
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Row component ────────────────────────────────────────────────────────────
function LeaderboardRow({
  entry,
  isPromotion,
  isRelegation,
  showDivider,
}: {
  entry:        LeaderboardEntry
  isPromotion:  boolean
  isRelegation: boolean
  showDivider:  boolean
}) {
  const rankColors = ['', 'text-yellow-500', 'text-gray-400', 'text-amber-600']
  const rankIcons  = ['', '🥇', '🥈', '🥉']

  const isTop3 = entry.rank <= 3

  return (
    <>
      {showDivider && (
        <div className="flex items-center gap-2 py-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">Relegation zone below</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      )}
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-2xl
          ${entry.isCurrentUser
            ? 'bg-orange-50 border-2 border-orange-200'
            : 'bg-white border border-gray-100'
          }
          ${isPromotion && !entry.isCurrentUser ? 'border-l-4 border-l-green-400' : ''}
          ${isRelegation && !entry.isCurrentUser ? 'border-l-4 border-l-red-300' : ''}
        `}
      >
        {/* Rank */}
        <div className={`w-8 text-center font-bold text-sm ${isTop3 ? rankColors[entry.rank] : 'text-gray-500'}`}>
          {isTop3 ? rankIcons[entry.rank] : `#${entry.rank}`}
        </div>

        {/* Avatar */}
        <div className={`
          w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm
          ${entry.isCurrentUser ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}
        `}>
          {entry.avatar}
        </div>

        {/* Name */}
        <div className="flex-1">
          <div className={`text-sm font-semibold ${entry.isCurrentUser ? 'text-orange-700' : 'text-gray-800'}`}>
            {entry.name}
            {entry.isCurrentUser && ' (You)'}
          </div>
          {entry.streak > 0 && (
            <div className="text-xs text-gray-400">🔥 {entry.streak} day streak</div>
          )}
        </div>

        {/* XP */}
        <div className="text-right">
          <div className="text-sm font-bold text-purple-600">{entry.xp.toLocaleString()}</div>
          <div className="text-xs text-gray-400">XP</div>
        </div>
      </div>
    </>
  )
}

function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-2xl h-16 animate-pulse" />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-3">🏆</div>
      <p className="text-gray-500 text-sm">Leaderboard loading...</p>
    </div>
  )
}
