import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { getSubjectById } from '@/lib/constants'

// GET /api/progress?userId=...
// Returns full progress summary for the progress page.
// Also supports ?streakOnly=true for faster streak-only fetches from home page.

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const streakOnly = req.nextUrl.searchParams.get('streakOnly') === 'true'

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  // Demo mode
  if (!isSupabaseConfigured) {
    if (streakOnly) {
      return NextResponse.json({ currentStreak: 0, longestStreak: 0, lastCompletedDate: null })
    }
    return NextResponse.json(getEmptyProgress())
  }

  const supabase = createServerClient()!

  // Always fetch streak
  const { data: streakRow } = await supabase
    .from('streaks')
    .select('current_streak, longest_streak, last_completed_date')
    .eq('user_id', userId)
    .single()

  const currentStreak = streakRow?.current_streak ?? 0
  const longestStreak = streakRow?.longest_streak ?? 0
  const lastCompletedDate = streakRow?.last_completed_date ?? null

  if (streakOnly) {
    return NextResponse.json({ currentStreak, longestStreak, lastCompletedDate })
  }

  // Full progress fetch
  const [subjectProgressResult, recentSessionsResult] = await Promise.all([
    supabase
      .from('user_progress')
      .select('subject_id, questions_attempted, questions_correct, accuracy_pct')
      .eq('user_id', userId),
    supabase
      .from('sessions')
      .select('id, started_at, correct_count, total_questions, subject_name, xp_earned')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('started_at', { ascending: false })
      .limit(10),
  ])

  const subjectRows = subjectProgressResult.data ?? []
  const sessionRows = recentSessionsResult.data ?? []

  // Aggregate totals
  const totalQuestions = subjectRows.reduce((sum, r) => sum + (r.questions_attempted ?? 0), 0)
  const totalCorrect = subjectRows.reduce((sum, r) => sum + (r.questions_correct ?? 0), 0)
  const accuracyPctValue = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  // Subject progress with display names
  const subjectProgress = subjectRows.map((r) => {
    const subject = getSubjectById(r.subject_id)
    return {
      subjectId: r.subject_id,
      subject: subject?.name ?? r.subject_id,
      attempted: r.questions_attempted ?? 0,
      correct: r.questions_correct ?? 0,
      accuracyPct: r.accuracy_pct ?? 0,
    }
  })

  // Recent sessions
  const recentSessions = sessionRows.map((s) => ({
    id: s.id,
    date: s.started_at?.slice(0, 10) ?? '',
    score: s.correct_count ?? 0,
    total: s.total_questions ?? 10,
    subjectName: s.subject_name ?? 'Mixed',
    accuracyPct: s.total_questions > 0
      ? Math.round(((s.correct_count ?? 0) / s.total_questions) * 100)
      : 0,
  }))

  return NextResponse.json({
    totalQuestions,
    totalCorrect,
    accuracyPct: accuracyPctValue,
    currentStreak,
    longestStreak,
    lastCompletedDate,
    recentSessions,
    subjectProgress,
  })
}

function getEmptyProgress() {
  return {
    totalQuestions: 0,
    totalCorrect: 0,
    accuracyPct: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    recentSessions: [],
    subjectProgress: [],
  }
}
