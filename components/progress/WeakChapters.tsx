'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionStore } from '@/store/sessionStore'
import { getSubjectById } from '@/lib/constants'
import { trackEvent, EVENTS } from '@/lib/analytics'
import type { WeakChapter } from '@/types'

interface WeakChaptersProps {
  chapters:  WeakChapter[]
  userId:    string
  hasData:   boolean   // true once the user has attempted at least one question
}

// ─── WeakChapters ─────────────────────────────────────────────────────────────
// Shown on the Progress page.
// Lists chapters where accuracy < 60% (min 5 attempts) — worst first.
// The "Practice Now" button launches a session directly from this component
// so students can act immediately without navigating to the Practice tab.

export default function WeakChapters({ chapters, userId, hasData }: WeakChaptersProps) {
  const router       = useRouter()
  const startSession = useSessionStore((s) => s.startSession)
  const [startingId, setStartingId] = useState<string | null>(null)

  // ── Start a chapter session directly ──────────────────────────────────────
  async function handlePractice(chapter: WeakChapter) {
    if (startingId) return
    setStartingId(chapter.chapterId)

    try {
      // 1. Fetch questions for this chapter
      const qRes  = await fetch(
        `/api/chapter-questions?chapterId=${chapter.chapterId}&userId=${userId}&count=10`
      )
      const qData = qRes.ok ? await qRes.json() : null

      if (!qData || !qData.questions?.length) {
        // Chapter exists but no questions yet — go to Practice tab instead
        router.push('/practice')
        return
      }

      // 2. Create a session record
      const sRes = await fetch('/api/sessions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId, chapterId: chapter.chapterId }),
      })
      const sessionId = sRes.ok
        ? (await sRes.json()).sessionId
        : `local-${Date.now()}`

      // 3. Track and navigate (keepalive ensures request survives route change)
      trackEvent(userId, EVENTS.CHAPTER_PRACTICE_STARTED, {
        sessionId,
        chapterId:   chapter.chapterId,
        chapterName: chapter.chapterName,
        source:      'weak_chapters',
        accuracyPct: chapter.accuracyPct,
      })

      startSession(sessionId, qData.questions)
      router.push(`/practice/session/${sessionId}`)
    } catch {
      // Fallback: send to the Practice tab
      router.push('/practice')
    } finally {
      setStartingId(null)
    }
  }

  // ── Empty state: no weak chapters ─────────────────────────────────────────
  if (chapters.length === 0) {
    // Only show if the user has actually practised — no point showing
    // "all caught up!" to a brand-new student with zero data.
    if (!hasData) return null

    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-4 flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="text-sm font-semibold text-green-800">All caught up!</p>
          <p className="text-xs text-green-600 mt-0.5">
            No weak chapters yet. Keep the streak going!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {chapters.map((ch) => {
        const subject       = getSubjectById(ch.subjectId)
        const icon          = subject?.icon ?? '📚'
        const isStarting    = startingId === ch.chapterId
        const accuracyColor =
          ch.accuracyPct < 40 ? 'text-red-600 bg-red-50' :
          ch.accuracyPct < 55 ? 'text-amber-600 bg-amber-50' :
                                'text-yellow-700 bg-yellow-50'

        return (
          <div
            key={ch.chapterId}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            {/* Top row: icon + name + accuracy badge */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-start gap-2.5">
                <span className="text-xl mt-0.5">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">
                    {ch.chapterName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ch.subject} · {ch.attempted} attempted
                  </p>
                </div>
              </div>
              {/* Accuracy pill */}
              <span className={`flex-shrink-0 text-sm font-bold px-2.5 py-1 rounded-full ${accuracyColor}`}>
                {ch.accuracyPct}%
              </span>
            </div>

            {/* Accuracy progress bar */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  ch.accuracyPct < 40 ? 'bg-red-400' :
                  ch.accuracyPct < 55 ? 'bg-amber-400' :
                                        'bg-yellow-400'
                }`}
                style={{ width: `${ch.accuracyPct}%` }}
              />
            </div>

            {/* Bottom row: score tally + CTA */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {ch.correct}/{ch.attempted} correct
              </p>
              <button
                onClick={() => handlePractice(ch)}
                disabled={Boolean(startingId)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 text-white text-xs font-semibold rounded-xl active:bg-orange-600 disabled:opacity-60 transition-colors"
              >
                {isStarting ? (
                  <>
                    <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    <span>Loading…</span>
                  </>
                ) : (
                  <>
                    <span>Practice Now</span>
                    <span className="text-orange-200">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
// Shown while the weak-chapters API call is in flight.
export function WeakChaptersSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="bg-gray-100 rounded-2xl h-24" />
      ))}
    </div>
  )
}
