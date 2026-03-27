import { create } from 'zustand'
import type { Question, StoredAnswer, SessionResult } from '@/types'
import { setLocal, getLocal } from '@/lib/cache'
import { STORAGE_KEYS } from '@/lib/constants'

// ─── Active Session Store ─────────────────────────────────────────────────────
// Manages the state of the currently active practice session.
//
// Lifecycle:
//   startSession() → submitAnswer() × N → completeSession() → resetSession()
//
// State persists to localStorage so a page refresh mid-session recovers.

interface SessionStore {
  // Session identity
  sessionId: string | null
  dailySetId: string | null

  // Questions
  questions: Question[]
  currentIndex: number

  // Answers keyed by questionId
  answers: Record<string, StoredAnswer>

  // Flags
  isLoading: boolean          // true while waiting for attempt API response
  isAnswered: boolean         // true when current question has been answered
  isComplete: boolean         // true when all questions are done

  // Final result (set after PATCH complete)
  result: SessionResult | null

  // Actions
  startSession: (sessionId: string, questions: Question[], dailySetId?: string) => void
  setLoading: (loading: boolean) => void
  recordAnswer: (answer: StoredAnswer) => void
  nextQuestion: () => void
  setResult: (result: SessionResult) => void
  resetSession: () => void
  hydrateFromStorage: () => void
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessionId: null,
  dailySetId: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  isLoading: false,
  isAnswered: false,
  isComplete: false,
  result: null,

  startSession: (sessionId, questions, dailySetId) => {
    const state = {
      sessionId,
      dailySetId: dailySetId ?? null,
      questions,
      currentIndex: 0,
      answers: {},
      isLoading: false,
      isAnswered: false,
      isComplete: false,
      result: null,
    }
    // Persist to localStorage for refresh recovery
    setLocal(STORAGE_KEYS.LAST_SESSION, { sessionId, questions, dailySetId })
    set(state)
  },

  setLoading: (loading) => set({ isLoading: loading }),

  recordAnswer: (answer) => {
    const { answers, questions, currentIndex } = get()
    const updated = { ...answers, [answer.questionId]: answer }
    const allAnswered = Object.keys(updated).length >= questions.length
    set({
      answers: updated,
      isAnswered: true,
      isLoading: false,
      isComplete: currentIndex >= questions.length - 1 && allAnswered,
    })
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get()
    const next = currentIndex + 1
    if (next >= questions.length) {
      set({ isComplete: true })
    } else {
      set({ currentIndex: next, isAnswered: false })
    }
  },

  setResult: (result) => set({ result }),

  resetSession: () => {
    set({
      sessionId: null,
      dailySetId: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      isLoading: false,
      isAnswered: false,
      isComplete: false,
      result: null,
    })
  },

  hydrateFromStorage: () => {
    const saved = getLocal<{
      sessionId: string
      questions: Question[]
      dailySetId?: string
    }>(STORAGE_KEYS.LAST_SESSION)

    if (saved && get().sessionId === null) {
      set({
        sessionId: saved.sessionId,
        questions: saved.questions,
        dailySetId: saved.dailySetId ?? null,
        currentIndex: 0,
        answers: {},
        isLoading: false,
        isAnswered: false,
        isComplete: false,
      })
    }
  },
}))
