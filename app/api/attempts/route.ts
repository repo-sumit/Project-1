import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { MOCK_ANSWERS } from '@/lib/mock-data'
import { xpForAnswer } from '@/lib/xp'

// POST /api/attempts
// Accepts one answer, returns whether it was correct + the explanation.
// This is the most called endpoint — keep it fast.
//
// SECURITY: correct_option is NEVER sent to client before this call.
// The answer only exists on the server (DB or mock data).

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, questionId, selectedOption, userId } = body

    // Validate
    if (!sessionId || !questionId || !selectedOption) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, questionId, selectedOption' },
        { status: 400 }
      )
    }
    if (!['A', 'B', 'C', 'D'].includes(selectedOption)) {
      return NextResponse.json({ error: 'selectedOption must be A, B, C, or D' }, { status: 400 })
    }

    // ── Demo mode ─────────────────────────────────────────────────────────
    if (!isSupabaseConfigured) {
      const answerData = MOCK_ANSWERS[questionId]
      if (!answerData) {
        // Unknown question — return a generic response
        return NextResponse.json({
          isCorrect: true,
          correctOption: selectedOption,
          explanation: 'Demo mode: explanation not available for this question.',
          xpAwarded: xpForAnswer(true),
        })
      }
      const isCorrect = selectedOption === answerData.correctOption
      return NextResponse.json({
        isCorrect,
        correctOption: answerData.correctOption,
        explanation: answerData.explanation,
        xpAwarded: xpForAnswer(isCorrect),
      })
    }

    // ── Supabase mode ─────────────────────────────────────────────────────
    const supabase = createServerClient()!

    // Check for duplicate submission (409 on same question + session)
    if (sessionId && !sessionId.startsWith('local-')) {
      const { data: existing } = await supabase
        .from('attempts')
        .select('id, is_correct')
        .eq('session_id', sessionId)
        .eq('question_id', questionId)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'Already answered this question in this session' }, { status: 409 })
      }
    }

    // Fetch the correct answer from DB
    const { data: question, error: qError } = await supabase
      .from('questions')
      .select('correct_option, explanation')
      .eq('id', questionId)
      .single()

    if (qError || !question) {
      // Question not in DB — check mock data as fallback
      const mockAnswer = MOCK_ANSWERS[questionId]
      if (mockAnswer) {
        const isCorrect = selectedOption === mockAnswer.correctOption
        return NextResponse.json({
          isCorrect,
          correctOption: mockAnswer.correctOption,
          explanation: mockAnswer.explanation,
          xpAwarded: xpForAnswer(isCorrect),
        })
      }
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const isCorrect = selectedOption === question.correct_option
    const xpAwarded = xpForAnswer(isCorrect)

    // Save attempt to DB (non-blocking — don't await if in a rush)
    supabase.from('attempts').insert({
      session_id: sessionId.startsWith('local-') ? null : sessionId,
      user_id: userId ?? null,
      question_id: questionId,
      selected_option: selectedOption,
      is_correct: isCorrect,
      answered_at: new Date().toISOString(),
    }).then(({ error }) => {
      if (error) console.error('[attempts] Insert error:', error.message)
    })

    return NextResponse.json({
      isCorrect,
      correctOption: question.correct_option,
      explanation: question.explanation,
      xpAwarded,
    })
  } catch (e) {
    console.error('[attempts POST] Error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
