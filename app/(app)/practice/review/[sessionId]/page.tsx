'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSessionStore } from '@/store/sessionStore'
import { useUserStore } from '@/store/userStore'
import { trackEvent, EVENTS } from '@/lib/analytics'
import type { MistakeItem } from '@/types'

// ─── Mistake Review Page ───────────────────────────────────────────────────────
// Route: /practice/review/[sessionId]
// Shows every question the student got wrong in the session, with the correct
// answer highlighted in green and their wrong pick in red.
// Opened from the result screen — never from the main nav.

export default function ReviewPage() {
  const params    = useParams()
  const router    = useRouter()
  const sessionId = params.sessionId as string

  const resetSession = useSessionStore((s) => s.resetSession)
  const user         = useUserStore((s) => s.user)

  const [mistakes,   setMistakes]   = useState<MistakeItem[] | null>(null)
  const [isLoading,  setIsLoading]  = useState(true)

  useEffect(() => {
    fetchMistakes()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchMistakes() {
    setIsLoading(true)
    try {
      const res  = await fetch(`/api/session-mistakes?sessionId=${sessionId}`)
      const data = res.ok ? (await res.json()) as MistakeItem[] : []
      setMistakes(data)
      // Track after fetch so we include the accurate mistake count
      trackEvent(user?.id, EVENTS.MISTAKE_REVIEW_OPENED, {
        sessionId,
        mistakeCount: data.length,
      })
    } catch {
      setMistakes([])
    } finally {
      setIsLoading(false)
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="px-4 pt-12 pb-8 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gray-100 rounded-full" />
          <div className="h-6 bg-gray-100 rounded w-40" />
        </div>
        {/* Card skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-48 mb-4" />
        ))}
      </div>
    )
  }

  // ── Empty: all correct ─────────────────────────────────────────────────────
  if (!mistakes || mistakes.length === 0) {
    return (
      <div className="flex flex-col items-center text-center px-4 pt-24 pb-8">
        <div className="text-6xl mb-4">🌟</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Perfect session!</h2>
        <p className="text-sm text-gray-500 mb-8">You got every question right. Nothing to review.</p>
        <button
          onClick={() => { resetSession(); router.replace('/home') }}
          className="px-8 py-3.5 bg-orange-500 text-white font-semibold rounded-2xl active:bg-orange-600"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 active:bg-gray-200 tap-target"
            aria-label="Go back"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Mistake Review</h1>
            <p className="text-xs text-gray-500">
              {mistakes.length} question{mistakes.length > 1 ? 's' : ''} to learn from
            </p>
          </div>
        </div>
      </div>

      {/* ── Mistake cards ─────────────────────────────────────────────────── */}
      <div className="px-4 py-5 flex flex-col gap-5">
        {mistakes.map((item, index) => (
          <MistakeCard key={item.questionId} item={item} index={index} total={mistakes.length} />
        ))}
      </div>

      {/* ── Footer CTA ────────────────────────────────────────────────────── */}
      <div className="px-4 pt-2 pb-8 mt-auto">
        <button
          onClick={() => { resetSession(); router.replace('/home') }}
          className="w-full py-4 bg-orange-500 text-white font-semibold rounded-2xl active:bg-orange-600 transition-colors"
        >
          Done — Back to Home
        </button>
      </div>

    </div>
  )
}

// ─── MistakeCard ───────────────────────────────────────────────────────────────
// One question per card.
// Wrong answer → red background.  Correct answer → green background.
// Explanation always visible below the options.

function MistakeCard({
  item,
  index,
  total,
}: {
  item:  MistakeItem
  index: number
  total: number
}) {
  const OPTIONS: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D']

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Card header: chapter + question number */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <span className="text-xs font-medium text-gray-500 truncate pr-2">
          📖 {item.chapterName}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {item.yearTag && (
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {item.yearTag}
            </span>
          )}
          <span className="text-xs font-semibold text-gray-400">
            {index + 1}/{total}
          </span>
        </div>
      </div>

      {/* Question text */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-sm font-semibold text-gray-900 leading-relaxed">
          {item.questionText}
        </p>
      </div>

      {/* Options */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {OPTIONS.map((opt) => {
          const isSelected = item.selectedOption === opt
          const isCorrect  = item.correctOption  === opt

          // Colour logic:
          // Correct answer → green  (always shown green, even if student didn't choose it)
          // Student's wrong pick → red
          // Everything else → plain gray
          const style = isCorrect
            ? 'bg-green-50 border-green-300 text-green-800'
            : isSelected
            ? 'bg-red-50 border-red-300 text-red-800'
            : 'bg-gray-50 border-gray-200 text-gray-700'

          const labelStyle = isCorrect
            ? 'bg-green-200 text-green-800'
            : isSelected
            ? 'bg-red-200 text-red-800'
            : 'bg-gray-200 text-gray-600'

          return (
            <div
              key={opt}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border ${style}`}
            >
              {/* Option letter */}
              <span className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${labelStyle}`}>
                {opt}
              </span>
              <span className="text-sm leading-snug pt-0.5 flex-1">
                {item.options[opt]}
              </span>
              {/* Tail icon */}
              {isCorrect && (
                <span className="flex-shrink-0 text-green-500 text-base">✓</span>
              )}
              {isSelected && !isCorrect && (
                <span className="flex-shrink-0 text-red-400 text-base">✗</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      <div className="mx-4 mb-4 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3">
        <p className="text-xs font-semibold text-amber-700 mb-1">💡 Explanation</p>
        <p className="text-xs text-amber-900 leading-relaxed">{item.explanation}</p>
      </div>

    </div>
  )
}
