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
    // Persist full initial state for refresh recovery
    setLocal(STORAGE_KEYS.LAST_SESSION, {
      sessionId,
      questions,
      dailySetId,
      currentIndex: 0,
      answers: {},
    })
    set(state)
  },

  setLoading: (loading) => set({ isLoading: loading }),

  recordAnswer: (answer) => {
    const { answers, questions, currentIndex, sessionId, dailySetId } = get()
    const updated = { ...answers, [answer.questionId]: answer }
    const allAnswered = Object.keys(updated).length >= questions.length
    // Persist answers + current index so a refresh mid-session restores progress
    setLocal(STORAGE_KEYS.LAST_SESSION, {
      sessionId,
      questions,
      dailySetId,
      currentIndex,
      answers: updated,
    })
    set({
      answers: updated,
      isAnswered: true,
      isLoading: false,
      isComplete: currentIndex >= questions.length - 1 && allAnswered,
    })
  },

  nextQuestion: () => {
    const { currentIndex, questions, sessionId, dailySetId, answers } = get()
    const next = currentIndex + 1
    if (next >= questions.length) {
      set({ isComplete: true })
    } else {
      // Persist the new index so a refresh lands on the correct question
      setLocal(STORAGE_KEYS.LAST_SESSION, {
        sessionId,
        questions,
        dailySetId,
        currentIndex: next,
        answers,
      })
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
      currentIndex?: number
      answers?: Record<string, StoredAnswer>
    }>(STORAGE_KEYS.LAST_SESSION)

    if (saved && get().sessionId === null) {
      const restoredIndex   = saved.currentIndex ?? 0
      const restoredAnswers = saved.answers       ?? {}
      // If the current question was already answered before the refresh,
      // restore isAnswered=true so the explanation panel reappears.
      const currentQuestion = saved.questions[restoredIndex]
      const isAnswered = Boolean(currentQuestion && restoredAnswers[currentQuestion.id])
      set({
        sessionId:    saved.sessionId,
        questions:    saved.questions,
        dailySetId:   saved.dailySetId ?? null,
        currentIndex: restoredIndex,
        answers:      restoredAnswers,
        isLoading:    false,
        isAnswered,
        isComplete:   false,
      })
    }
  },
}))
