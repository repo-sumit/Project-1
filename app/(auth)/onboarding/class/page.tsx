'use client'

import { useRouter } from 'next/navigation'
import { getLocal, setLocal } from '@/lib/cache'
import { STORAGE_KEYS } from '@/lib/constants'
import type { User } from '@/types'

const CLASS_OPTIONS = [
  { level: 9,  label: 'Class 9',  desc: 'CBSE · Foundation year' },
  { level: 10, label: 'Class 10', desc: 'CBSE · Board exam year ⭐' },
  { level: 11, label: 'Class 11', desc: 'CBSE · Junior year' },
  { level: 12, label: 'Class 12', desc: 'CBSE · Board exam year ⭐' },
]

export default function ClassPage() {
  const router = useRouter()

  function handleSelect(level: number) {
    // Load existing partial user data or create a skeleton
    const existing = getLocal<Partial<User>>(STORAGE_KEYS.USER) ?? {}
    setLocal(STORAGE_KEYS.USER, { ...existing, classLevel: level })
    router.push('/onboarding/subjects')
  }

  return (
    <div className="flex flex-col min-h-screen px-5 pt-16 pb-8">
      {/* Header */}
      <div className="mb-10">
        <div className="text-4xl mb-4">🔥</div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          Which class are you in?
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          We&apos;ll personalise your questions and chapters.
        </p>
      </div>

      {/* Class cards */}
      <div className="flex flex-col gap-3">
        {CLASS_OPTIONS.map(({ level, label, desc }) => (
          <button
            key={level}
            onClick={() => handleSelect(level)}
            className="
              w-full flex items-center justify-between
              bg-white border-2 border-gray-200
              rounded-2xl px-5 py-4
              active:border-orange-500 active:bg-orange-50
              transition-all duration-100
              tap-target
            "
          >
            <div className="text-left">
              <div className="font-semibold text-gray-900 text-base">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </div>
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      {/* Step indicator */}
      <div className="flex gap-1.5 mt-auto pt-8 justify-center">
        <div className="h-1.5 w-8 rounded-full bg-orange-500" />
        <div className="h-1.5 w-2 rounded-full bg-gray-200" />
        <div className="h-1.5 w-2 rounded-full bg-gray-200" />
      </div>
    </div>
  )
}
