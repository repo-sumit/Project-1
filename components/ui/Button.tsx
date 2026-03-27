import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  isLoading?: boolean
  fullWidth?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const base = 'font-semibold rounded-2xl transition-all duration-100 tap-target flex items-center justify-center gap-2'

  const variants = {
    primary: 'bg-orange-500 text-white active:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-400',
    secondary: 'bg-gray-100 text-gray-800 active:bg-gray-200 disabled:opacity-50',
    ghost: 'text-orange-500 active:text-orange-600 disabled:opacity-50',
  }

  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-5 py-3.5 text-base',
    lg: 'px-6 py-4 text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
