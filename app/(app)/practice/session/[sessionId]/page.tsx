'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSessionStore } from '@/store/sessionStore'
import { useUserStore } from '@/store/userStore'
import type { StoredAnswer } from '@/types'
import { xpForAnswer } from '@/lib/xp'
import QuestionCard from '@/components/practice/QuestionCard'
import ProgressDots from '@/components/practice/ProgressDots'
import ExplanationPanel from '@/components/practice/ExplanationPanel'

// ─── Practice Session Page ────────────────────────────────────────────────────
// This is the core practice screen — heart of the product.
// Shows one question at a time, handles answer submission, shows explanation.

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const user = useUserStore((s) => s.user)
  const {
    questions,
    currentIndex,
    answers,
    isLoading,
    isAnswered,
    isComplete,
    hydrateFromStorage,
    startSession,
    setLoading,
    recordAnswer,
    nextQuestion,
  } = useSessionStore()

  // ── Guard: recover session from storage if needed ─────────────────────
  useEffect(() => {
    if (questions.length === 0) {
      hydrateFromStorage()
    }
  }, [questions.length, hydrateFromStorage])

  // ── Guard: redirect if session is complete ────────────────────────────
  useEffect(() => {
    if (isComplete) {
      router.replace(`/practice/result/${sessionId}`)
    }
  }, [isComplete, sessionId, router])

  // ── Guard: if still no questions → go home ────────────────────────────
  useEffect(() => {
    if (questions.length === 0) {
      const timer = setTimeout(() => {
        // Give 1 second for hydration, then give up
        router.replace('/home')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [questions.length, router])

  // ── Submit answer ─────────────────────────────────────────────────────
  async function handleAnswer(selectedOption: string) {
    if (isAnswered || isLoading) return
    const currentQuestion = questions[currentIndex]
    if (!currentQuestion) return

    setLoading(true)

    try {
      // POST attempt to API
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          selectedOption,
          userId: user?.id,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        recordAnswer({
          questionId: currentQuestion.id,
          selectedOption,
          isCorrect: data.isCorrect,
          correctOption: data.correctOption,
          explanation: data.explanation,
          xpAwarded: data.xpAwarded,
        })
      } else {
        // Fallback: handle gracefully without server
        handleOfflineAnswer(currentQuestion.id, selectedOption)
      }
    } catch {
      // Network error — degrade gracefully
      handleOfflineAnswer(currentQuestion.id, selectedOption)
    }
  }

  function handleOfflineAnswer(questionId: string, selectedOption: string) {
    // In demo/offline mode: we don't know the answer yet.
    // Show a loading state — this shouldn't happen in production.
    // For now, record as "unknown" and move on.
    recordAnswer({
      questionId,
      selectedOption,
      isCorrect: false,
      correctOption: selectedOption, // We don't know — show as if correct
      explanation: 'Could not connect to server. Please check your internet connection.',
      xpAwarded: xpForAnswer(false),
    })
  }

  // ── Early return states ───────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers[currentQuestion?.id]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Header bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        {/* Quit button */}
        <button
          onClick={() => router.push('/home')}
          className="flex items-center gap-1 text-gray-400 text-sm tap-target"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress dots */}
        <ProgressDots
          total={questions.length}
          current={currentIndex}
          answers={answers}
          questions={questions}
        />

        {/* Spacer (balances the quit button) */}
        <div className="w-10" />
      </div>

      {/* ── Question area ───────────────────────────────────────────────── */}
      <div className="flex-1 px-4 pb-4">
        <QuestionCard
          question={currentQuestion}
          currentAnswer={currentAnswer}
          onAnswer={handleAnswer}
          isLoading={isLoading}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />
      </div>

      {/* ── Explanation panel (slides up after answer) ─────────────────── */}
      {isAnswered && currentAnswer && (
        <ExplanationPanel
          answer={currentAnswer}
          onNext={nextQuestion}
          isLastQuestion={currentIndex >= questions.length - 1}
        />
      )}
    </div>
  )
}
