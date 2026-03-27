'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore }    from '@/store/userStore'
import { useSessionStore } from '@/store/sessionStore'
import { getSubjectById }  from '@/lib/constants'
import { trackEvent, EVENTS } from '@/lib/analytics'
import type { Subject }    from '@/types'

interface ChapterWithProgress {
  id:          string
  name:        string
  orderIndex:  number
  totalQ:      number
  attempted:   number
  accuracy:    number
}

interface SubjectData {
  subject:  Subject
  chapters: ChapterWithProgress[]
}

export default function PracticePage() {
  const router       = useRouter()
  const user         = useUserStore((s) => s.user)
  const startSession = useSessionStore((s) => s.startSession)

  const [subjectData,  setSubjectData]  = useState<SubjectData[]>([])
  const [expandedSub,  setExpandedSub]  = useState<string | null>(null)
  const [isLoading,    setIsLoading]    = useState(true)
  const [startingChap, setStartingChap] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    loadChapters()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  async function loadChapters() {
    if (!user) return
    setIsLoading(true)

    const results: SubjectData[] = []

    for (const subjectId of user.subjectIds) {
      const subject = getSubjectById(subjectId)
      if (!subject) continue

      try {
        const res = await fetch(
          `/api/chapters?subjectId=${subjectId}&userId=${user.id}`
        )
        const data = res.ok ? await res.json() : { chapters: [] }
        results.push({ subject, chapters: data.chapters ?? [] })
      } catch {
        results.push({ subject, chapters: [] })
      }
    }

    setSubjectData(results)
    // Auto-expand the first subject
    if (results.length > 0) setExpandedSub(results[0].subject.id)
    setIsLoading(false)
  }

  async function handleStartChapter(chapterId: string, chapterName: string) {
    if (!user || startingChap) return
    setStartingChap(chapterId)

    try {
      // Fetch questions for this chapter
      const qRes = await fetch(
        `/api/chapter-questions?chapterId=${chapterId}&userId=${user.id}&count=10`
      )
      const qData = qRes.ok ? await qRes.json() : null

      if (!qData || qData.questions?.length === 0) {
        alert('No questions available for this chapter yet.')
        setStartingChap(null)
        return
      }

      // Create session
      const sRes = await fetch('/api/sessions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId: user.id, chapterId }),
      })
      const sessionId = sRes.ok
        ? (await sRes.json()).sessionId
        : `local-${Date.now()}`

      // Track before navigation (keepalive carries the request through route change)
      trackEvent(user.id, EVENTS.CHAPTER_PRACTICE_STARTED, {
        sessionId,
        chapterId,
        chapterName,
        source: 'chapter_practice',
      })

      startSession(sessionId, qData.questions)
      router.push(`/practice/session/${sessionId}`)
    } catch {
      setStartingChap(null)
    }
  }

  if (isLoading) return <PracticeSkeleton />

  if (user?.subjectIds.length === 0) {
    return (
      <NoSubjectsState onSetup={() => router.push('/onboarding/subjects')} />
    )
  }

  return (
    <div className="px-4 pt-12 pb-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chapter Practice</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pick any chapter and start practising
        </p>
      </div>

      {/* Subject accordion */}
      <div className="flex flex-col gap-3">
        {subjectData.map(({ subject, chapters }) => {
          const isOpen = expandedSub === subject.id

          return (
            <div key={subject.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              {/* Subject header */}
              <button
                onClick={() => setExpandedSub(isOpen ? null : subject.id)}
                className="w-full flex items-center justify-between px-4 py-4 tap-target"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{subject.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 text-sm">{subject.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {chapters.length > 0
                        ? `${chapters.length} chapters`
                        : 'No chapters yet'}
                    </div>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Chapter list */}
              {isOpen && (
                <div className="border-t border-gray-50">
                  {chapters.length === 0 ? (
                    <div className="px-4 py-5 text-center">
                      <p className="text-sm text-gray-400">
                        Chapters coming soon for this subject 🚧
                      </p>
                    </div>
                  ) : (
                    chapters.map((ch, i) => (
                      <div
                        key={ch.id}
                        className={`px-4 py-3.5 flex items-center justify-between ${
                          i < chapters.length - 1 ? 'border-b border-gray-50' : ''
                        }`}
                      >
                        <div className="flex-1 mr-3">
                          <div className="text-sm font-medium text-gray-800 leading-snug">
                            Ch. {ch.orderIndex} · {ch.name}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            {/* Progress bar */}
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-400 rounded-full transition-all duration-500"
                                style={{
                                  width: ch.totalQ > 0
                                    ? `${Math.min(100, (ch.attempted / ch.totalQ) * 100)}%`
                                    : '0%'
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {ch.attempted}/{ch.totalQ}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartChapter(ch.id, ch.name)}
                          disabled={startingChap === ch.id}
                          className="flex-shrink-0 px-3 py-2 bg-orange-500 text-white text-xs font-semibold rounded-xl active:bg-orange-600 disabled:opacity-60 tap-target"
                        >
                          {startingChap === ch.id ? (
                            <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin inline-block" />
                          ) : (
                            'Practice'
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Coming soon notice */}
      <p className="text-center text-xs text-gray-400 mt-6">
        More chapters being added every week 📚
      </p>
    </div>
  )
}

function NoSubjectsState({ onSetup }: { onSetup: () => void }) {
  return (
    <div className="flex flex-col items-center text-center pt-20 px-6">
      <div className="text-5xl mb-4">📚</div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">No subjects selected</h2>
      <p className="text-sm text-gray-500 mb-8">Pick your subjects to see chapters here.</p>
      <button
        onClick={onSetup}
        className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-2xl"
      >
        Select Subjects
      </button>
    </div>
  )
}

function PracticeSkeleton() {
  return (
    <div className="px-4 pt-12 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-48 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-64 mb-6" />
      {[1, 2].map((i) => (
        <div key={i} className="bg-gray-100 rounded-2xl h-20 mb-3" />
      ))}
    </div>
  )
}
