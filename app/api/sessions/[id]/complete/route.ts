import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { xpForSession, calculateNewStreak, accuracyPct } from '@/lib/xp'

// PATCH /api/sessions/[id]/complete
// Called when a user finishes a session.
// Calculates final score, XP, updates streak, returns summary.

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id
    const body = await req.json()
    const { userId, correctCount, totalQuestions } = body

    if (!userId || correctCount === undefined || !totalQuestions) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, correctCount, totalQuestions' },
        { status: 400 }
      )
    }

    const today = new Date().toISOString().slice(0, 10)
    const accPct = accuracyPct(correctCount, totalQuestions)

    // ── Demo mode ─────────────────────────────────────────────────────────
    if (!isSupabaseConfigured) {
      const xp = xpForSession(correctCount, totalQuestions, true, 1)
      return NextResponse.json({
        sessionId,
        score: correctCount,
        total: totalQuestions,
        accuracyPct: accPct,
        xpEarned: xp,
        streak: { current: 1, longest: 1, increased: true },
      })
    }

    // ── Supabase mode ─────────────────────────────────────────────────────
    const supabase = createServerClient()!

    // Get current streak
    const { data: streakRow } = await supabase
      .from('streaks')
      .select('current_streak, longest_streak, last_completed_date')
      .eq('user_id', userId)
      .single()

    const currentStreak = streakRow?.current_streak ?? 0
    const longestStreak = streakRow?.longest_streak ?? 0
    const lastDate = streakRow?.last_completed_date ?? null

    // Calculate new streak
    const { currentStreak: newCurrent, longestStreak: newLongest } =
      calculateNewStreak(currentStreak, longestStreak, lastDate, today)

    const increased = newCurrent > currentStreak

    // Calculate XP
    const xp = xpForSession(correctCount, totalQuestions, true, newCurrent)

    // Update session record
    await supabase.from('sessions').update({
      correct_count: correctCount,
      xp_earned: xp,
      completed_at: new Date().toISOString(),
    }).eq('id', sessionId)

    // Update streak
    await supabase.from('streaks').upsert({
      user_id: userId,
      current_streak: newCurrent,
      longest_streak: newLongest,
      last_completed_date: today,
    }, { onConflict: 'user_id' })

    // Update user_progress (per subject)
    // First, get the questions from this session's attempts
    const { data: sessionAttempts } = await supabase
      .from('attempts')
      .select('question_id, is_correct, questions(subject_id)')
      .eq('session_id', sessionId)

    if (sessionAttempts && sessionAttempts.length > 0) {
      // Group by subject
      const subjectStats: Record<string, { attempted: number; correct: number }> = {}

      for (const attempt of sessionAttempts) {
        const subjectId = (attempt.questions as { subject_id: string })?.subject_id
        if (!subjectId) continue
        if (!subjectStats[subjectId]) {
          subjectStats[subjectId] = { attempted: 0, correct: 0 }
        }
        subjectStats[subjectId].attempted++
        if (attempt.is_correct) subjectStats[subjectId].correct++
      }

      // Upsert progress rows
      for (const [subjectId, stats] of Object.entries(subjectStats)) {
        const { data: existing } = await supabase
          .from('user_progress')
          .select('questions_attempted, questions_correct')
          .eq('user_id', userId)
          .eq('subject_id', subjectId)
          .single()

        const prevAttempted = existing?.questions_attempted ?? 0
        const prevCorrect = existing?.questions_correct ?? 0

        await supabase.from('user_progress').upsert({
          user_id: userId,
          subject_id: subjectId,
          questions_attempted: prevAttempted + stats.attempted,
          questions_correct: prevCorrect + stats.correct,
          accuracy_pct: accuracyPct(prevCorrect + stats.correct, prevAttempted + stats.attempted),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,subject_id' })
      }
    }

    // Mark daily set as completed
    await supabase
      .from('daily_sets')
      .update({ status: 'completed' })
      .eq('user_id', userId)
      .eq('set_date', today)

    return NextResponse.json({
      sessionId,
      score: correctCount,
      total: totalQuestions,
      accuracyPct: accPct,
      xpEarned: xp,
      streak: {
        current: newCurrent,
        longest: newLongest,
        increased,
      },
    })
  } catch (e) {
    console.error('[sessions/complete] Error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
