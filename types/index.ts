// ─── PrepFire — Shared TypeScript Types ─────────────────────────────────────
// One source of truth for all data shapes used across pages, API routes,
// and the Zustand store.

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string               // UUID stored in localStorage — no auth in V1
  name: string
  classLevel: number       // 9 | 10 | 11 | 12
  subjectIds: string[]     // e.g. ['science-10', 'maths-10']
  onboardingComplete: boolean
  createdAt: string        // ISO date string
}

// ─── Subjects & Chapters ─────────────────────────────────────────────────────

export interface Subject {
  id: string               // e.g. 'science-10', 'maths-10'
  name: string             // e.g. 'Science'
  classLevel: number
  board: string            // 'CBSE'
  color: string            // Tailwind class e.g. 'bg-blue-500'
  textColor: string        // e.g. 'text-blue-500'
  icon: string             // emoji
}

export interface Chapter {
  id: string
  subjectId: string
  name: string
  orderIndex: number
}

// ─── Questions ───────────────────────────────────────────────────────────────

// Sent TO the client — no answer included
export interface Question {
  id: string
  chapterId: string
  subjectId: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  yearTag?: number
  difficulty: 'easy' | 'medium' | 'hard'
}

// Returned FROM POST /api/attempts — includes answer + explanation
export interface AttemptResult {
  isCorrect: boolean
  correctOption: string    // 'A' | 'B' | 'C' | 'D'
  explanation: string
  xpAwarded: number
}

// What we store per answer in the session store
export interface StoredAnswer extends AttemptResult {
  selectedOption: string
  questionId: string
}

// ─── Daily Set ───────────────────────────────────────────────────────────────

export interface DailySet {
  dailySetId: string
  date: string             // 'YYYY-MM-DD'
  questionCount: number
  subjects: string[]       // display names e.g. ['Science', 'Maths']
  estimatedMinutes: number
  questions: Question[]
  isCompleted: boolean
}

// ─── Sessions ────────────────────────────────────────────────────────────────

export interface Session {
  id: string
  userId: string
  dailySetId?: string
  subjectName: string
  startedAt: string
  completedAt?: string
  totalQuestions: number
  correctCount: number
  xpEarned: number
}

export interface SessionResult {
  sessionId: string
  score: number
  total: number
  accuracyPct: number
  xpEarned: number
  streak: {
    current: number
    longest: number
    increased: boolean
  }
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface RecentSession {
  id: string
  date: string
  score: number
  total: number
  subjectName: string
  accuracyPct: number
}

export interface SubjectProgress {
  subjectId: string
  subject: string
  attempted: number
  correct: number
  accuracyPct: number
}

export interface Progress {
  totalQuestions: number
  totalCorrect: number
  accuracyPct: number
  currentStreak: number
  longestStreak: number
  recentSessions: RecentSession[]
  subjectProgress: SubjectProgress[]
}

// ─── Streak ──────────────────────────────────────────────────────────────────

export interface Streak {
  currentStreak: number
  longestStreak: number
  lastCompletedDate: string | null
}

// ─── API Response Wrapper ────────────────────────────────────────────────────

export interface ApiError {
  error: string
  code?: number
}
