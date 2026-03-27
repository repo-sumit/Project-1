'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { useSessionStore } from '@/store/sessionStore'
import type { DailySet } from '@/types'
import { getLocal, setLocal, todayString } from '@/lib/cache'
import { STORAGE_KEYS } from '@/lib/constants'
import DailySetCard from '@/components/home/DailySetCard'
import StreakCard from '@/components/home/StreakCard'
import QuickStats from '@/components/home/QuickStats'

export default function HomePage() {
  const router      = useRouter()
  const user        = useUserStore((s) => s.user)
  const streak      = useUserStore((s) => s.streak)
  const setStreak   = useUserStore((s) => s.setStreak)
  const startSession = useSessionStore((s) => s.startSession)

  const [dailySet,  setDailySet]  = useState<DailySet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting,setIsStarting]= useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [stats,     setStats]     = useState({ totalQ: 0, accuracy: 0 })

  useEffect(() => {
    if (!user) return
    loadDailySet()
    loadStreakAndStats()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // ── Load daily set ─────────────────────────────────────────────────────────
  async function loadDailySet() {
    setIsLoading(true)
    setError(null)

    // Try localStorage cache first (avoids network on repeat opens today)
    const cachedDate = getLocal<string>(STORAGE_KEYS.DAILY_SET_DATE)
    const cachedSet  = getLocal<DailySet>(STORAGE_KEYS.DAILY_SET)
    const today      = todayString()

    if (cachedDate === today && cachedSet) {
      setDailySet(cachedSet)
      setIsLoading(false)
      return
    }

    try {
      // Pass subjectIds + classLevel so server can build the set
      // even if the user isn't in the DB yet
      const params = new URLSearchParams({
        userId:     user!.id,
        classLevel: String(user!.classLevel ?? 10),
        subjectIds: (user!.subjectIds ?? []).join(','),
      })
      const res = await fetch(`/api/daily-set?${params}`)

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? `HTTP ${res.status}`)
      }

      const data: DailySet = await res.json()
      setLocal(STORAGE_KEYS.DAILY_SET, data)
      setLocal(STORAGE_KEYS.DAILY_SET_DATE, today)
      setDailySet(data)
    } catch (err) {
      console.error('[Home] daily-set fetch error:', err)
      setError('Could not load today\'s set.')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Load streak + quick stats ──────────────────────────────────────────────
  async function loadStreakAndStats() {
    if (!user) return
    try {
      const res = await fetch(`/api/progress?userId=${user.id}`)
      if (!res.ok) return
      const data = await res.json()
      setStreak({
        currentStreak:    data.currentStreak    ?? 0,
        longestStreak:    data.longestStreak    ?? 0,
        lastCompletedDate: data.lastCompletedDate ?? null,
      })
      setStats({
        totalQ:   data.totalQuestions ?? 0,
        accuracy: data.accuracyPct    ?? 0,
      })
    } catch {
      // Non-critical — silently show 0 values
    }
  }

  // ── Start a practice session ───────────────────────────────────────────────
  async function handleStartSession() {
    if (!user || !dailySet || isStarting) return
    setIsStarting(true)

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, dailySetId: dailySet.dailySetId }),
      })

      const sessionId = res.ok
        ? (await res.json()).sessionId
        : `local-${Date.now()}`

      startSession(sessionId, dailySet.questions, dailySet.dailySetId)
      router.push(`/practice/session/${sessionId}`)
    } catch {
      const sessionId = `local-${Date.now()}`
      startSession(sessionId, dailySet!.questions, dailySet!.dailySetId)
      router.push(`/practice/session/${sessionId}`)
    }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="px-4 pt-12 pb-4">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">{greeting} 👋</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">
            {user?.name ?? 'Loading...'}
          </h1>
        </div>
        {/* Leaderboard shortcut */}
        <button
          onClick={() => router.push('/leaderboard')}
          className="flex flex-col items-center gap-0.5 tap-target"
        >
          <span className="text-2xl">🏆</span>
          <span className="text-[10px] text-gray-400 font-medium">Ranks</span>
        </button>
      </div>

      {/* ── Streak ─────────────────────────────────────────────────────── */}
      <div className="mb-4">
        <StreakCard
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
        />
      </div>

      {/* ── Quick Stats Row ─────────────────────────────────────────────── */}
      {stats.totalQ > 0 && (
        <div className="mb-4">
          <QuickStats totalQuestions={stats.totalQ} accuracy={stats.accuracy} />
        </div>
      )}

      {/* ── Daily Set Card ──────────────────────────────────────────────── */}
      <div className="mb-5">
        {isLoading ? (
          <DailySetCardSkeleton />
        ) : error ? (
          <ErrorCard message={error} onRetry={loadDailySet} />
        ) : dailySet ? (
          <DailySetCard
            dailySet={dailySet}
            onStart={handleStartSession}
            isStarting={isStarting}
          />
        ) : null}
      </div>

      {/* ── Chapter Practice shortcut ───────────────────────────────────── */}
      {!isLoading && !error && (
        <button
          onClick={() => router.push('/practice')}
          className="w-full flex items-center justify-between bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📖</span>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-800">Chapter Practice</div>
              <div className="text-xs text-gray-400">Pick a subject and chapter</div>
            </div>
          </div>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* ── Motivational nudge ──────────────────────────────────────────── */}
      {!isLoading && !error && streak.currentStreak === 0 && (
        <p className="text-center text-xs text-gray-400 mt-5">
          Complete today&apos;s set to start your streak 🔥
        </p>
      )}
      {!isLoading && !error && streak.currentStreak > 0 && (
        <p className="text-center text-xs text-gray-400 mt-5">
          🔥 <span className="font-medium text-orange-500">{streak.currentStreak}-day streak</span> — don&apos;t break it!
        </p>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function DailySetCardSkeleton() {
  return (
    <div className="bg-orange-100 rounded-3xl p-5 animate-pulse">
      <div className="h-3 bg-orange-200 rounded w-20 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-orange-200 rounded-full w-20" />
        <div className="h-6 bg-orange-200 rounded-full w-24" />
      </div>
      <div className="h-4 bg-orange-200 rounded w-32 mb-6" />
      <div className="h-12 bg-orange-200 rounded-2xl" />
    </div>
  )
}

// ─── Error card ───────────────────────────────────────────────────────────────
function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-3xl p-5 text-center">
      <div className="text-3xl mb-2">😕</div>
      <p className="text-red-600 text-sm font-medium mb-1">{message}</p>
      <p className="text-red-400 text-xs mb-4">Check your internet or Supabase setup</p>
      <button
        onClick={onRetry}
        className="px-5 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl active:bg-red-600"
      >
        Try Again
      </button>
    </div>
  )
}
