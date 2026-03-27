import type { Subject } from '@/types'

// ─── Class levels available in V1 ────────────────────────────────────────────
export const CLASS_LEVELS = [9, 10, 11, 12] as const

// ─── Subjects by class level ─────────────────────────────────────────────────
// V1 launches with Class 10 subjects + Class 12 Science.
// Add more by appending to this array — no code changes needed elsewhere.

export const SUBJECTS: Subject[] = [
  // ── Class 10 ──────────────────────────────────────────────────────────────
  {
    id: 'science-10',
    name: 'Science',
    classLevel: 10,
    board: 'CBSE',
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    icon: '🔬',
  },
  {
    id: 'maths-10',
    name: 'Mathematics',
    classLevel: 10,
    board: 'CBSE',
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    icon: '📐',
  },
  {
    id: 'sst-10',
    name: 'Social Science',
    classLevel: 10,
    board: 'CBSE',
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
    icon: '🌍',
  },
  // ── Class 9 ───────────────────────────────────────────────────────────────
  {
    id: 'science-9',
    name: 'Science',
    classLevel: 9,
    board: 'CBSE',
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    icon: '🔬',
  },
  {
    id: 'maths-9',
    name: 'Mathematics',
    classLevel: 9,
    board: 'CBSE',
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    icon: '📐',
  },
  // ── Class 12 Science ──────────────────────────────────────────────────────
  {
    id: 'physics-12',
    name: 'Physics',
    classLevel: 12,
    board: 'CBSE',
    color: 'bg-sky-500',
    textColor: 'text-sky-600',
    icon: '⚡',
  },
  {
    id: 'chemistry-12',
    name: 'Chemistry',
    classLevel: 12,
    board: 'CBSE',
    color: 'bg-green-500',
    textColor: 'text-green-600',
    icon: '⚗️',
  },
  {
    id: 'biology-12',
    name: 'Biology',
    classLevel: 12,
    board: 'CBSE',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    icon: '🧬',
  },
  {
    id: 'maths-12',
    name: 'Mathematics',
    classLevel: 12,
    board: 'CBSE',
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    icon: '📐',
  },
  // ── Class 11 Science ──────────────────────────────────────────────────────
  {
    id: 'physics-11',
    name: 'Physics',
    classLevel: 11,
    board: 'CBSE',
    color: 'bg-sky-500',
    textColor: 'text-sky-600',
    icon: '⚡',
  },
  {
    id: 'chemistry-11',
    name: 'Chemistry',
    classLevel: 11,
    board: 'CBSE',
    color: 'bg-green-500',
    textColor: 'text-green-600',
    icon: '⚗️',
  },
  {
    id: 'maths-11',
    name: 'Mathematics',
    classLevel: 11,
    board: 'CBSE',
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    icon: '📐',
  },
]

// Helper: get subjects for a specific class level
export function getSubjectsForClass(classLevel: number): Subject[] {
  return SUBJECTS.filter((s) => s.classLevel === classLevel)
}

// Helper: get a subject by ID
export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id)
}

// ─── XP values ────────────────────────────────────────────────────────────────
export const XP = {
  CORRECT_ANSWER: 10,
  WRONG_ATTEMPT: 3,       // reward effort, not just accuracy
  DAILY_SET_COMPLETE: 20, // bonus for finishing the full set
  STREAK_BONUS: 5,        // extra XP per active streak day
} as const

// ─── Daily set config ─────────────────────────────────────────────────────────
export const DAILY_SET_SIZE = 10
export const SESSION_ESTIMATED_MINUTES = 8

// ─── localStorage keys ───────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  USER:            'prepfire_user',
  DAILY_SET:       'prepfire_daily_set',
  DAILY_SET_DATE:  'prepfire_daily_set_date',
  LAST_SESSION:    'prepfire_last_session',
} as const
