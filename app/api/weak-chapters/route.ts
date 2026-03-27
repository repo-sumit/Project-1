import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { getSubjectById } from '@/lib/constants'
import type { WeakChapter } from '@/types'

// ─── Thresholds ───────────────────────────────────────────────────────────────
// A chapter is "weak" when the student has tried enough questions (MIN_ATTEMPTS)
// but still isn't getting most of them right (< WEAK_THRESHOLD accuracy).
const MIN_ATTEMPTS    = 5    // ignore chapters with too few data points
const WEAK_THRESHOLD  = 0.60 // below 60% accuracy = needs focus

// ─── Demo data ────────────────────────────────────────────────────────────────
// Shown when Supabase is not connected so the UI is always visible.
const DEMO_WEAK_CHAPTERS: WeakChapter[] = [
  {
    chapterId:   'c-m10-04',
    chapterName: 'Quadratic Equations',
    subjectId:   'maths-10',
    subject:     'Mathematics',
    attempted:   8,
    correct:     3,
    accuracyPct: 38,
  },
  {
    chapterId:   'c-s10-12',
    chapterName: 'Electricity',
    subjectId:   'science-10',
    subject:     'Science',
    attempted:   7,
    correct:     3,
    accuracyPct: 43,
  },
  {
    chapterId:   'c-m10-05',
    chapterName: 'Arithmetic Progressions',
    subjectId:   'maths-10',
    subject:     'Mathematics',
    attempted:   6,
    correct:     3,
    accuracyPct: 50,
  },
]

// GET /api/weak-chapters?userId=...
// Returns chapters where accuracy < 60% with ≥ 5 attempts.
// Sorted worst-first so the most urgent chapter is always first.
// Returns [] (not an error) when there's no weak data — never crashes.

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  // ── Demo mode ─────────────────────────────────────────────────────────────
  if (!isSupabaseConfigured) {
    return NextResponse.json(DEMO_WEAK_CHAPTERS)
  }

  // ── Supabase mode ──────────────────────────────────────────────────────────
  try {
    const supabase = createServerClient()!

    // Fetch every attempt for this user, joining to the question's chapter + subject.
    // We aggregate in JS — simpler than a raw SQL RPC for an MVP, and the
    // total attempt count per user stays small enough that this is fast.
    const { data: attempts, error } = await supabase
      .from('attempts')
      .select('is_correct, questions(chapter_id, subject_id)')
      .eq('user_id', userId)

    if (error || !attempts || attempts.length === 0) {
      return NextResponse.json([])
    }

    // ── Step 1: aggregate per chapter ───────────────────────────────────────
    const stats: Record<string, {
      attempted:  number
      correct:    number
      subjectId:  string
    }> = {}

    for (const attempt of attempts) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q         = attempt.questions as any
      const chapId    = q?.chapter_id  as string | undefined
      const subjectId = q?.subject_id  as string | undefined
      if (!chapId) continue  // question has no chapter (shouldn't happen, but be safe)

      if (!stats[chapId]) {
        stats[chapId] = { attempted: 0, correct: 0, subjectId: subjectId ?? '' }
      }
      stats[chapId].attempted++
      if (attempt.is_correct) stats[chapId].correct++
    }

    // ── Step 2: filter to weak chapters ─────────────────────────────────────
    const weakChapterIds = Object.entries(stats)
      .filter(([, s]) =>
        s.attempted >= MIN_ATTEMPTS &&
        s.correct / s.attempted < WEAK_THRESHOLD
      )
      .map(([id]) => id)

    if (weakChapterIds.length === 0) {
      return NextResponse.json([]) // student is doing well — nothing to flag
    }

    // ── Step 3: look up chapter names ────────────────────────────────────────
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id, name, subject_id')
      .in('id', weakChapterIds)

    const chapterMap: Record<string, { name: string; subjectId: string }> = {}
    for (const ch of chapters ?? []) {
      chapterMap[ch.id] = { name: ch.name, subjectId: ch.subject_id }
    }

    // ── Step 4: build response, sort worst-first ──────────────────────────────
    const result: WeakChapter[] = weakChapterIds
      .map((chapId) => {
        const s         = stats[chapId]
        const ch        = chapterMap[chapId]
        const subjectId = ch?.subjectId ?? s.subjectId
        const subject   = getSubjectById(subjectId)
        return {
          chapterId:   chapId,
          chapterName: ch?.name ?? 'Unknown Chapter',
          subjectId,
          subject:     subject?.name ?? subjectId,
          attempted:   s.attempted,
          correct:     s.correct,
          accuracyPct: Math.round((s.correct / s.attempted) * 100),
        }
      })
      .sort((a, b) => a.accuracyPct - b.accuracyPct) // lowest accuracy first

    return NextResponse.json(result)
  } catch (err) {
    console.error('[weak-chapters] Error:', err)
    return NextResponse.json([]) // always return something — never crash the progress page
  }
}
