'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSessionStore } from '@/store/sessionStore'
import { useUserStore } from '@/store/userStore'
import type { SessionResult } from '@/types'
import { accuracyPct } from '@/lib/xp'
import { todayIST } from '@/lib/date'

// ─── Result Page ──────────────────────────────────────────────────────────────
// Shows score, XP, streak after completing a session.
// Calls PATCH /api/sessions/[id]/complete to finalise the session.

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const user = useUserStore((s) => s.user)
  const setStreak = useUserStore((s) => s.setStreak)
  const { questions, answers, result, setResult, resetSession } = useSessionStore()

  const [isLoading, setIsLoading] = useState(!result)

  // Ensures finaliseSession() runs at most once, even if React remounts
  // the component (Strict Mode, back-navigation, etc.).
  const hasFinalized = useRef(false)

  // ── Finalise session on mount ──────────────────────────────────────────
  useEffect(() => {
    if (result) return            // already have a result in store
    if (hasFinalized.current) return  // already called this render cycle
    hasFinalized.current = true
    finaliseSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function finaliseSession() {
    setIsLoading(true)

    // Calculate local score from stored answers
    const correctCount = Object.values(answers).filter((a) => a.isCorrect).length
    const total = questions.length

    try {
      const res = await fetch(`/api/sessions/${sessionId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          correctCount,
          totalQuestions: total,
        }),
      })

      if (res.ok) {
        const data: SessionResult = await res.json()
        setResult(data)
        // Update streak in store — use IST date to match what the server stored
        setStreak({
          currentStreak: data.streak.current,
          longestStreak: data.streak.longest,
          lastCompletedDate: todayIST(),
        })
      } else {
        // Fallback: compute result locally
        setLocalResult(correctCount, total)
      }
    } catch {
      setLocalResult(correctCount, total)
    } finally {
      setIsLoading(false)
    }
  }

  function setLocalResult(correctCount: number, total: number) {
    const localResult: SessionResult = {
      sessionId,
      score: correctCount,
      total,
      accuracyPct: accuracyPct(correctCount, total),
      xpEarned: correctCount * 10 + (total - correctCount) * 3 + 20,
      streak: { current: 1, longest: 1, increased: true },
    }
    setResult(localResult)
  }

  function handleGoHome() {
    resetSession()
    router.replace('/home')
  }

  function handleGoProgress() {
    resetSession()
    router.replace('/progress')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="text-3xl animate-bounce-in">🎉</div>
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Saving your results...</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  const accuracy = result.accuracyPct
  const scoreEmoji =
    accuracy >= 80 ? '🌟' :
    accuracy >= 60 ? '👍' :
    accuracy >= 40 ? '💪' : '📚'

  const scoreMessage =
    accuracy >= 80 ? 'Excellent work!' :
    accuracy >= 60 ? 'Good job!' :
    accuracy >= 40 ? 'Keep practising!' :
    'Review the explanations — you\'ll get better!'

  // Count incorrect answers — used to decide which CTA to show
  const incorrectAnswers = Object.values(answers).filter((a) => !a.isCorrect)

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-16 pb-8">
      {/* Big score */}
      <div className="flex flex-col items-center text-center mb-8 animate-bounce-in">
        <div className="text-6xl mb-3">{scoreEmoji}</div>
        <div className="text-5xl font-bold text-gray-900 mb-1">
          {result.score}
          <span className="text-2xl font-normal text-gray-400">/{result.total}</span>
        </div>
        <div className="text-lg font-semibold text-gray-700">{scoreMessage}</div>
        <div className="text-sm text-gray-500 mt-1">{result.accuracyPct}% accuracy</div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <ResultStat icon="⭐" label="XP Earned" value={`+${result.xpEarned}`} color="text-purple-600" bg="bg-purple-50" />
        <ResultStat
          icon="🔥"
          label="Streak"
          value={`${result.streak.current}d`}
          color="text-orange-600"
          bg="bg-orange-50"
          badge={result.streak.increased ? '+1' : undefined}
        />
        <ResultStat icon="🎯" label="Accuracy" value={`${result.accuracyPct}%`} color="text-blue-600" bg="bg-blue-50" />
      </div>

      {/* ── Review mistakes CTA ───────────────────────────────────────────── */}
      <div className="mb-8">
        {incorrectAnswers.length === 0 ? (
          // Perfect score — celebrate, no review needed
          <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl px-4 py-3.5">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Great job — no mistakes to review!</p>
              <p className="text-xs text-green-600 mt-0.5">You answered everything correctly.</p>
            </div>
          </div>
        ) : (
          // Has mistakes — show a clear CTA to the full review screen
          <button
            onClick={() => router.push(`/practice/review/${sessionId}`)}
            className="w-full flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-2xl active:bg-red-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📋</span>
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Review Mistakes
                </p>
                <p className="text-xs text-red-500 mt-0.5">
                  {incorrectAnswers.length} question{incorrectAnswers.length > 1 ? 's' : ''} with explanations
                </p>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-red-400 flex-shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={handleGoHome}
          className="w-full py-4 bg-orange-500 text-white font-semibold rounded-2xl active:bg-orange-600 transition-colors"
        >
          Back to Home
        </button>
        <button
          onClick={handleGoProgress}
          className="w-full py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-2xl active:bg-gray-200 transition-colors"
        >
          View Progress
        </button>
      </div>
    </div>
  )
}

// ─── Result stat card ─────────────────────────────────────────────────────────
function ResultStat({
  icon,
  label,
  value,
  color,
  bg,
  badge,
}: {
  icon: string
  label: string
  value: string
  color: string
  bg: string
  badge?: string
}) {
  return (
    <div className={`${bg} rounded-2xl p-3 text-center relative`}>
      {badge && (
        <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce-in">
          {badge}
        </span>
      )}
      <div className="text-xl mb-1">{icon}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}
