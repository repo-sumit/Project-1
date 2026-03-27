'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLocal, setLocal, generateUUID, todayString } from '@/lib/cache'
import { STORAGE_KEYS } from '@/lib/constants'
import { useUserStore } from '@/store/userStore'
import { trackEvent, EVENTS } from '@/lib/analytics'
import type { User } from '@/types'

export default function NamePage() {
  const router = useRouter()
  const setUser = useUserStore((s) => s.setUser)
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus the input on mount
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  async function handleStart() {
    const trimmed = name.trim()
    if (!trimmed) return

    setIsLoading(true)

    // Build the complete user object
    const partial = getLocal<Partial<User>>(STORAGE_KEYS.USER) ?? {}
    const newUser: User = {
      id: partial.id ?? generateUUID(),
      name: trimmed,
      classLevel: partial.classLevel ?? 10,
      subjectIds: partial.subjectIds ?? [],
      onboardingComplete: true,
      createdAt: todayString(),
    }

    // Save locally first (instant)
    setUser(newUser)

    // Track onboarding completion (fire-and-forget)
    trackEvent(newUser.id, EVENTS.ONBOARDING_COMPLETED, {
      classLevel:   newUser.classLevel,
      subjectIds:   newUser.subjectIds,
      subjectCount: newUser.subjectIds.length,
    })

    // Save to backend (fire-and-forget — don't block navigation)
    fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: newUser.id,
        name: newUser.name,
        classLevel: newUser.classLevel,
        subjectIds: newUser.subjectIds,
      }),
    }).catch(() => {
      // Backend save failure is non-fatal in V1
      // User can still use the app with localStorage data
    })

    router.replace('/home')
  }

  const isValid = name.trim().length >= 2

  return (
    <div className="flex flex-col min-h-screen px-5 pt-14 pb-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-gray-500 text-sm mb-8 tap-target"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          What should we call you?
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Your first name is enough.
        </p>
      </div>

      {/* Name input */}
      <div className="mb-6">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && isValid && handleStart()}
          placeholder="e.g. Arjun"
          maxLength={30}
          autoComplete="given-name"
          className="
            w-full text-2xl font-semibold text-gray-900
            border-b-2 border-gray-200 focus:border-orange-500
            bg-transparent outline-none pb-3
            transition-colors duration-150
            placeholder:text-gray-300 placeholder:font-normal
          "
        />
      </div>

      {/* Preview */}
      {name.trim().length >= 2 && (
        <p className="text-sm text-gray-500 animate-fade-in">
          Welcome, <span className="font-semibold text-orange-500">{name.trim()}</span>! 🔥 Let&apos;s start your prep.
        </p>
      )}

      {/* CTA */}
      <div className="mt-auto">
        <button
          onClick={handleStart}
          disabled={!isValid || isLoading}
          className={`
            w-full py-4 rounded-2xl font-semibold text-base
            transition-all duration-100
            ${isValid && !isLoading
              ? 'bg-orange-500 text-white active:bg-orange-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Setting up...
            </span>
          ) : (
            'Start Preparing 🚀'
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Your name is only used to personalise your experience.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1.5 mt-6 justify-center">
        <div className="h-1.5 w-2 rounded-full bg-gray-200" />
        <div className="h-1.5 w-2 rounded-full bg-gray-200" />
        <div className="h-1.5 w-8 rounded-full bg-orange-500" />
      </div>
    </div>
  )
}
