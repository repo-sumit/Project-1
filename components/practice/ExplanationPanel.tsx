import type { StoredAnswer } from '@/types'

interface ExplanationPanelProps {
  answer: StoredAnswer
  onNext: () => void
  isLastQuestion: boolean
}

// ─── Explanation Panel ────────────────────────────────────────────────────────
// Slides up from the bottom after an answer is submitted.
// Shows: correct/wrong indicator, explanation, XP earned, Next button.

export default function ExplanationPanel({
  answer,
  onNext,
  isLastQuestion,
}: ExplanationPanelProps) {
  const { isCorrect, explanation, xpAwarded } = answer

  return (
    <div
      className={`
        animate-slide-up
        fixed bottom-0 left-1/2 -translate-x-1/2
        w-full max-w-[430px]
        rounded-t-3xl shadow-2xl
        px-5 pt-5 pb-8
        ${isCorrect ? 'bg-green-50' : 'bg-red-50'}
      `}
    >
      {/* Result indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isCorrect ? '🎉' : '📚'}</span>
          <span className={`font-bold text-lg ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correct!' : 'Not quite'}
          </span>
        </div>

        {/* XP badge */}
        <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
          <span className="text-xs">⭐</span>
          <span className="text-xs font-semibold">+{xpAwarded} XP</span>
        </div>
      </div>

      {/* Explanation text */}
      <p className={`text-sm leading-relaxed mb-5 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
        {explanation}
      </p>

      {/* Next button */}
      <button
        onClick={onNext}
        className={`
          w-full py-4 rounded-2xl font-semibold text-base
          transition-colors duration-100
          ${isCorrect
            ? 'bg-green-600 text-white active:bg-green-700'
            : 'bg-red-500 text-white active:bg-red-600'
          }
        `}
      >
        {isLastQuestion ? 'See Results 🏁' : 'Next Question →'}
      </button>
    </div>
  )
}
