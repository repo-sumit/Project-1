import type { Question, StoredAnswer } from '@/types'

interface ProgressDotsProps {
  total: number
  current: number
  answers: Record<string, StoredAnswer>
  questions: Question[]
}

// Shows a row of dots — one per question.
// Green = correct, red = wrong, orange = current, gray = upcoming.

export default function ProgressDots({
  total,
  current,
  answers,
  questions,
}: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const question = questions[i]
        const answer = question ? answers[question.id] : undefined

        let color = 'bg-gray-200'          // upcoming
        if (i === current) {
          color = 'bg-orange-400'          // current
        } else if (answer) {
          color = answer.isCorrect ? 'bg-green-400' : 'bg-red-400' // answered
        }

        // Current dot is slightly larger
        const size = i === current ? 'w-2.5 h-2.5' : 'w-2 h-2'

        return (
          <div
            key={i}
            className={`${size} ${color} rounded-full transition-all duration-200`}
          />
        )
      })}
    </div>
  )
}
