'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLocal, setLocal } from '@/lib/cache'
import { getSubjectsForClass, STORAGE_KEYS } from '@/lib/constants'
import type { User, Subject } from '@/types'

export default function SubjectsPage() {
  const router = useRouter()
  const [classLevel, setClassLevel] = useState<number>(10)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    const saved = getLocal<Partial<User>>(STORAGE_KEYS.USER)
    const level = saved?.classLevel ?? 10
    setClassLevel(level)
    setSubjects(getSubjectsForClass(level))
    // Pre-select any previously chosen subjects
    setSelected(saved?.subjectIds ?? [])
  }, [])

  function toggleSubject(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  function handleContinue() {
    if (selected.length < 1) return
    const existing = getLocal<Partial<User>>(STORAGE_KEYS.USER) ?? {}
    setLocal(STORAGE_KEYS.USER, { ...existing, subjectIds: selected })
    router.push('/onboarding/name')
  }

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          Select your subjects
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Class {classLevel} · Choose at least one
        </p>
      </div>

      {/* Subject grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {subjects.map((subject) => {
          const isSelected = selected.includes(subject.id)
          return (
            <button
              key={subject.id}
              onClick={() => toggleSubject(subject.id)}
              className={`
                flex flex-col items-start p-4 rounded-2xl border-2
                transition-all duration-100 tap-target text-left
                ${isSelected
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white'
                }
              `}
            >
              <span className="text-2xl mb-2">{subject.icon}</span>
              <span className={`font-semibold text-sm ${isSelected ? 'text-orange-700' : 'text-gray-800'}`}>
                {subject.name}
              </span>
              {isSelected && (
                <span className="mt-1.5 text-xs text-orange-500 font-medium">✓ Selected</span>
              )}
            </button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="mt-auto">
        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className={`
            w-full py-4 rounded-2xl font-semibold text-base
            transition-all duration-100
            ${selected.length > 0
              ? 'bg-orange-500 text-white active:bg-orange-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Continue
          {selected.length > 0 && ` · ${selected.length} subject${selected.length > 1 ? 's' : ''}`}
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1.5 mt-6 justify-center">
        <div className="h-1.5 w-2 rounded-full bg-gray-200" />
        <div className="h-1.5 w-8 rounded-full bg-orange-500" />
        <div className="h-1.5 w-2 rounded-full bg-gray-200" />
      </div>
    </div>
  )
}
