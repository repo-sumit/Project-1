'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import type { Progress, WeakChapter } from '@/types'
import SubjectProgress from '@/components/progress/SubjectProgress'
import SessionHistory from '@/components/progress/SessionHistory'
import WeakChapters, { WeakChaptersSkeleton } from '@/components/progress/WeakChapters'

export default function ProgressPage() {
  const router = useRouter()
  const user   = useUserStore((s) => s.user)

  const [progress,         setProgress]         = useState<Progress | null>(null)
  const [weakChapters,     setWeakChapters]     = useState<WeakChapter[] | null>(null)
  const [isLoading,        setIsLoading]        = useState(true)
  const [isLoadingWeak,    setIsLoadingWeak]    = useState(true)

  useEffect(() => {
    if (!user) return
    // Fire both fetches in parallel — weak chapters doesn't block the main stats
    fetchProgress()
    fetchWeakChapters()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchProgress() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/progress?userId=${user!.id}`)
      if (!res.ok) throw new Error('Failed')
      const data: Progress = await res.json()
      setProgress(data)
    } catch {
      setProgress(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchWeakChapters() {
    setIsLoadingWeak(true)
    try {
      const res = await fetch(`/api/weak-chapters?userId=${user!.id}`)
      const data: WeakChapter[] = res.ok ? await res.json() : []
      setWeakChapters(data)
    } catch {
      setWeakChapters([]) // never block the page
    } finally {
      setIsLoadingWeak(false)
    }
  }

  if (isLoading) {
    return <ProgressSkeleton />
  }

  const hasData = (progress?.totalQuestions ?? 0) > 0

  return (
    <div className="px-4 pt-12 pb-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
        <p className="text-sm text-gray-500 mt-1">Track your improvement over time</p>
      </div>

      {!hasData ? (
        <EmptyProgressState onPractice={() => router.push('/home')} />
      ) : (
        <>
          {/* Top stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard
              label="Questions"
              value={progress!.totalQuestions.toLocaleString()}
              icon="📝"
            />
            <StatCard
              label="Accuracy"
              value={`${progress!.accuracyPct}%`}
              icon="🎯"
              highlight={progress!.accuracyPct >= 70}
            />
            <StatCard
              label="Streak"
              value={`${progress!.currentStreak}d`}
              icon="🔥"
              highlight={progress!.currentStreak >= 3}
            />
          </div>

          {/* Streak detail */}
          {progress!.longestStreak > 0 && (
            <div className="bg-orange-50 rounded-2xl px-4 py-3 mb-5 flex items-center justify-between">
              <span className="text-sm text-orange-700">
                🏆 Longest streak: <strong>{progress!.longestStreak} days</strong>
              </span>
              {progress!.currentStreak > 0 && (
                <span className="text-xs font-medium text-orange-500 bg-orange-100 px-2 py-1 rounded-full">
                  Active 🔥
                </span>
              )}
            </div>
          )}

          {/* ── Focus Areas (Weak Chapters) ──────────────────────────── */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-800">Focus Areas</h2>
              {/* Badge: only show count when there are weak chapters */}
              {!isLoadingWeak && (weakChapters?.length ?? 0) > 0 && (
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  {weakChapters!.length} chapter{weakChapters!.length > 1 ? 's' : ''} need work
                </span>
              )}
            </div>
            {isLoadingWeak ? (
              <WeakChaptersSkeleton />
            ) : (
              <WeakChapters
                chapters={weakChapters ?? []}
                userId={user!.id}
                hasData={hasData}
              />
            )}
          </section>

          {/* Subject progress */}
          {progress!.subjectProgress.length > 0 && (
            <section className="mb-6">
              <h2 className="text-base font-semibold text-gray-800 mb-3">By Subject</h2>
              <div className="flex flex-col gap-3">
                {progress!.subjectProgress.map((sp) => (
                  <SubjectProgress key={sp.subjectId} data={sp} />
                ))}
              </div>
            </section>
          )}

          {/* Recent sessions */}
          {progress!.recentSessions.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-3">Recent Sessions</h2>
              <div className="flex flex-col gap-2">
                {progress!.recentSessions.map((s) => (
                  <SessionHistory key={s.id} session={s} />
                ))}
              </div>
            </section>
          )}

          {/* Practice again CTA */}
          <div className="mt-8">
            <button
              onClick={() => router.push('/home')}
              className="w-full py-4 bg-orange-500 text-white font-semibold rounded-2xl active:bg-orange-600 transition-colors"
            >
              Practice Again 🚀
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string
  value: string
  icon: string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-2xl p-4 text-center ${highlight ? 'bg-orange-50' : 'bg-white'} shadow-sm`}>
      <div className="text-xl mb-1">{icon}</div>
      <div className={`text-lg font-bold ${highlight ? 'text-orange-600' : 'text-gray-900'}`}>
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

function EmptyProgressState({ onPractice }: { onPractice: () => void }) {
  return (
    <div className="flex flex-col items-center text-center pt-16 pb-8">
      <div className="text-6xl mb-4">📊</div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">No data yet</h2>
      <p className="text-sm text-gray-500 mb-8 max-w-xs">
        Complete your first Daily Set to start seeing your progress here.
      </p>
      <button
        onClick={onPractice}
        className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-2xl active:bg-orange-600"
      >
        Start Practising
      </button>
    </div>
  )
}

function ProgressSkeleton() {
  return (
    <div className="px-4 pt-12 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-40 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-56 mb-6" />
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-20" />
        ))}
      </div>
      <div className="h-24 bg-gray-100 rounded-2xl mb-4" />
      <div className="h-24 bg-gray-100 rounded-2xl" />
    </div>
  )
}
