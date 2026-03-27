type OptionState = 'default' | 'selected' | 'correct' | 'wrong' | 'disabled'

interface OptionButtonProps {
  option: string     // 'A' | 'B' | 'C' | 'D'
  text: string
  state: OptionState
  onTap: () => void
}

export default function OptionButton({ option, text, state, onTap }: OptionButtonProps) {
  // Visual styles per state
  const styles: Record<OptionState, string> = {
    default: `
      border-2 border-gray-200 bg-white text-gray-800
      active:border-orange-400 active:bg-orange-50
      cursor-pointer
    `,
    selected: `
      border-2 border-orange-400 bg-orange-50 text-orange-800
    `,
    correct: `
      border-2 border-green-500 bg-green-50 text-green-800
      animate-fade-in
    `,
    wrong: `
      border-2 border-red-400 bg-red-50 text-red-800
      animate-fade-in
    `,
    disabled: `
      border-2 border-gray-100 bg-gray-50 text-gray-400
      cursor-not-allowed
    `,
  }

  // Option letter badge styles
  const badgeStyles: Record<OptionState, string> = {
    default:  'bg-gray-100 text-gray-500',
    selected: 'bg-orange-200 text-orange-700',
    correct:  'bg-green-200 text-green-700',
    wrong:    'bg-red-200 text-red-700',
    disabled: 'bg-gray-100 text-gray-300',
  }

  // Icons for correct/wrong
  const trailingIcon =
    state === 'correct' ? '✓' :
    state === 'wrong'   ? '✗' :
    null

  return (
    <button
      onClick={state === 'default' ? onTap : undefined}
      disabled={state === 'disabled' || state === 'correct' || state === 'wrong'}
      className={`
        w-full flex items-center gap-3 p-4 rounded-2xl text-left
        transition-all duration-100 tap-target
        ${styles[state]}
      `}
    >
      {/* Option letter */}
      <span className={`
        flex-shrink-0 w-8 h-8 rounded-xl font-bold text-sm
        flex items-center justify-center
        ${badgeStyles[state]}
      `}>
        {option}
      </span>

      {/* Option text */}
      <span className="flex-1 text-sm leading-snug">{text}</span>

      {/* Trailing icon */}
      {trailingIcon && (
        <span className={`
          flex-shrink-0 font-bold text-base
          ${state === 'correct' ? 'text-green-600' : 'text-red-500'}
        `}>
          {trailingIcon}
        </span>
      )}
    </button>
  )
}
