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

export default function HomePage() {
  const router = useRouter()
  const user = useUserStore((s) => s.user)
  const streak = useUserStore((s) => s.streak)
  const setStreak = useUserStore((s) => s.setStreak)
  const startSession = useSessionStore((s) => s.startSession)

  const [dailySet, setDailySet] = useState<DailySet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Fetch daily set ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    loadDailySet()
    loadStreak()
  }, [user])

  async function loadDailySet() {
    setIsLoading(true)
    setError(null)

    // Check localStorage cache first (valid for today)
    const cachedDate = getLocal<string>(STORAGE_KEYS.DAILY_SET_DATE)
    const cachedSet = getLocal<DailySet>(STORAGE_KEYS.DAILY_SET)
    const today = todayString()

    if (cachedDate === today && cachedSet) {
      setDailySet(cachedSet)
      setIsLoading(false)
      return
    }

    // Fetch from API
    try {
      const res = await fetch(`/api/daily-set?userId=${user!.id}`)
      if (!res.ok) throw new Error('Failed to load daily set')
      const data: DailySet = await res.json()

      // Cache it
      setLocal(STORAGE_KEYS.DAILY_SET, data)
      setLocal(STORAGE_KEYS.DAILY_SET_DATE, today)
      setDailySet(data)
    } catch {
      setError('Could not load today\'s set. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  async function loadStreak() {
    if (!user) return
    try {
      const res = await fetch(`/api/progress?userId=${user.id}&streakOnly=true`)
      if (!res.ok) return
      const data = await res.json()
      setStreak({
        currentStreak: data.currentStreak ?? 0,
        longestStreak: data.longestStreak ?? 0,
        lastCompletedDate: data.lastCompletedDate ?? null,
      })
    } catch {
      // Non-critical — streak shows 0 if fetch fails
    }
  }

  // ── Start session ───────────────────────────────────────────────────────
  async function handleStartSession() {
    if (!user || !dailySet || isStarting) return
    setIsStarting(true)

    try {
      // Create a session on the backend
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          dailySetId: dailySet.dailySetId,
        }),
      })

      let sessionId: string
      if (res.ok) {
        const data = await res.json()
        sessionId = data.sessionId
      } else {
        // Fallback: generate local session ID (demo mode)
        sessionId = `local-${Date.now()}`
      }

      // Initialize the Zustand session store
      startSession(sessionId, dailySet.questions, dailySet.dailySetId)

      // Navigate to practice
      router.push(`/practice/session/${sessionId}`)
    } catch {
      // Fallback: still let user practice with local session
      const sessionId = `local-${Date.now()}`
      startSession(sessionId, dailySet!.questions, dailySet!.dailySetId)
      router.push(`/practice/session/${sessionId}`)
    }
  }

  const today = new Date()
  const greeting = today.getHours() < 12 ? 'Good morning' :
    today.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="px-4 pt-12 pb-4">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">{greeting} 👋</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-0.5">
          {user?.name ?? 'Preparing...'}
        </h1>
      </div>

      {/* Streak card */}
      <div className="mb-4">
        <StreakCard
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
        />
      </div>

      {/* Daily Set card */}
      <div className="mb-6">
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

      {/* Motivational nudge */}
      {!isLoading && !error && streak.currentStreak === 0 && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Start your first session to build your streak 🔥
        </p>
      )}
      {!isLoading && !error && streak.currentStreak > 0 && (
        <p className="text-center text-sm text-gray-500 mt-4">
          You&apos;re on a <span className="font-semibold text-orange-500">{streak.currentStreak}-day streak</span>. Keep it going!
        </p>
      )}
    </div>
  )
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function DailySetCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-24 mb-3" />
      <div className="h-6 bg-gray-100 rounded w-40 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-32 mb-6" />
      <div className="h-12 bg-gray-100 rounded-2xl" />
    </div>
  )
}

// ─── Error card ───────────────────────────────────────────────────────────────
function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-3xl p-5 text-center">
      <p className="text-red-600 text-sm mb-3">{message}</p>
      <button
        onClick={onRetry}
        className="text-sm font-semibold text-red-600 underline"
      >
        Try again
      </button>
    </div>
  )
}
