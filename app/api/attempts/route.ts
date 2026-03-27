import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { MOCK_ANSWERS } from '@/lib/mock-data'
import { xpForAnswer } from '@/lib/xp'

// POST /api/attempts
// Accepts one answer → returns correctness + explanation.
// SECURITY: correct_option is stored only in DB, never sent with questions.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, questionId, selectedOption, userId } = body

    // Validate inputs
    if (!sessionId || !questionId || !selectedOption) {
      return NextResponse.json(
        { error: 'Missing: sessionId, questionId, selectedOption' },
        { status: 400 }
      )
    }
    const opt = String(selectedOption).toUpperCase()
    if (!['A', 'B', 'C', 'D'].includes(opt)) {
      return NextResponse.json(
        { error: 'selectedOption must be A, B, C, or D' },
        { status: 400 }
      )
    }

    // ── Demo mode ─────────────────────────────────────────────────────────
    if (!isSupabaseConfigured) {
      const ans = MOCK_ANSWERS[questionId]
      if (!ans) {
        // Unknown question in demo — treat as correct so UX doesn't break
        return NextResponse.json({
          isCorrect:     true,
          correctOption: opt,
          explanation:   'Demo mode: this question has no answer key. In production, all answers are verified.',
          xpAwarded:     xpForAnswer(true),
        })
      }
      const isCorrect = opt === ans.correctOption
      return NextResponse.json({
        isCorrect,
        correctOption: ans.correctOption,
        explanation:   ans.explanation,
        xpAwarded:     xpForAnswer(isCorrect),
      })
    }

    // ── Supabase mode ─────────────────────────────────────────────────────
    const supabase = createServerClient()!

    // Prevent double submission for the same question in the same session
    const isLocalSession = !sessionId || sessionId.startsWith('local-') || sessionId.startsWith('demo-')

    if (!isLocalSession) {
      const { data: existing } = await supabase
        .from('attempts')
        .select('id, is_correct')
        .eq('session_id', sessionId)
        .eq('question_id', questionId)
        .maybeSingle()

      if (existing) {
        // Already answered — return the stored result (idempotent)
        const ans = MOCK_ANSWERS[questionId]
        return NextResponse.json({
          isCorrect:     existing.is_correct,
          correctOption: existing.is_correct ? opt : (ans?.correctOption ?? opt),
          explanation:   ans?.explanation ?? 'You already answered this question.',
          xpAwarded:     0,
        })
      }
    }

    // Fetch correct answer from DB
    const { data: question, error: qErr } = await supabase
      .from('questions')
      .select('correct_option, explanation')
      .eq('id', questionId)
      .single()

    if (qErr || !question) {
      // Fall back to mock answer data
      const mockAns = MOCK_ANSWERS[questionId]
      if (mockAns) {
        const isCorrect = opt === mockAns.correctOption
        return NextResponse.json({
          isCorrect,
          correctOption: mockAns.correctOption,
          explanation:   mockAns.explanation,
          xpAwarded:     xpForAnswer(isCorrect),
        })
      }
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const isCorrect = opt === question.correct_option
    const xpAwarded = xpForAnswer(isCorrect)

    // Write attempt to DB asynchronously (don't block response)
    if (!isLocalSession && userId) {
      supabase.from('attempts').insert({
        session_id:      sessionId,
        user_id:         userId,
        question_id:     questionId,
        selected_option: opt,
        is_correct:      isCorrect,
        answered_at:     new Date().toISOString(),
      }).then(({ error }) => {
        if (error) console.error('[attempts] Insert error:', error.message)
      })
    }

    return NextResponse.json({
      isCorrect,
      correctOption: question.correct_option,
      explanation:   question.explanation,
      xpAwarded,
    })
  } catch (err) {
    console.error('[attempts] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
