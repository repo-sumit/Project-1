import type { Question, StoredAnswer } from '@/types'
import OptionButton from './OptionButton'

interface QuestionCardProps {
  question: Question
  currentAnswer: StoredAnswer | undefined
  onAnswer: (option: string) => void
  isLoading: boolean
  questionNumber: number
  totalQuestions: number
}

const OPTIONS = ['A', 'B', 'C', 'D'] as const

function getOptionText(question: Question, option: string): string {
  const map: Record<string, string> = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
  }
  return map[option] ?? ''
}

export default function QuestionCard({
  question,
  currentAnswer,
  onAnswer,
  isLoading,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Question number + difficulty */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-400">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          question.difficulty === 'easy'   ? 'bg-green-50 text-green-600' :
          question.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' :
                                             'bg-red-50 text-red-600'
        }`}>
          {question.difficulty}
          {question.yearTag && ` · ${question.yearTag}`}
        </span>
      </div>

      {/* Question text */}
      <div className="mb-6">
        <p className="text-gray-900 text-lg font-medium leading-relaxed">
          {question.questionText}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {OPTIONS.map((option) => {
          const text = getOptionText(question, option)
          if (!text) return null

          let state: 'default' | 'selected' | 'correct' | 'wrong' | 'disabled' = 'default'

          if (currentAnswer) {
            if (option === currentAnswer.correctOption) {
              state = 'correct'
            } else if (option === currentAnswer.selectedOption && !currentAnswer.isCorrect) {
              state = 'wrong'
            } else {
              state = 'disabled'
            }
          } else if (isLoading) {
            state = 'disabled'
          }

          return (
            <OptionButton
              key={option}
              option={option}
              text={text}
              state={state}
              onTap={() => onAnswer(option)}
            />
          )
        })}
      </div>

      {/* Loading indicator while waiting for API response */}
      {isLoading && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  )
}
