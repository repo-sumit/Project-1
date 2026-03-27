import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { MOCK_QUESTIONS } from '@/lib/mock-data'
import type { Question } from '@/types'

// GET /api/chapter-questions?chapterId=...&userId=...&count=10
// Returns questions for a specific chapter (for chapter practice flow).
// Like /api/daily-set, correct answers are NOT included.

export async function GET(req: NextRequest) {
  const chapterId = req.nextUrl.searchParams.get('chapterId')
  const userId    = req.nextUrl.searchParams.get('userId')
  const count     = parseInt(req.nextUrl.searchParams.get('count') ?? '10')

  if (!chapterId) {
    return NextResponse.json({ error: 'chapterId is required' }, { status: 400 })
  }

  // ── Demo mode ─────────────────────────────────────────────────────────────
  if (!isSupabaseConfigured) {
    const pool     = MOCK_QUESTIONS.filter((q) => q.chapterId === chapterId)
    const fallback = pool.length >= 3 ? pool : MOCK_QUESTIONS
    const shuffled = [...fallback].sort(() => Math.random() - 0.5).slice(0, count)
    return NextResponse.json({
      chapterId,
      questions:     shuffled,
      questionCount: shuffled.length,
    })
  }

  // ── Supabase mode ─────────────────────────────────────────────────────────
  try {
    const supabase = createServerClient()!

    // Get questions for this chapter, avoiding already seen ones
    let seenIds = new Set<string>()
    if (userId) {
      const { data: seen } = await supabase
        .from('attempts')
        .select('question_id')
        .eq('user_id', userId)
        .limit(500)
      seenIds = new Set((seen ?? []).map((a: { question_id: string }) => a.question_id))
    }

    const { data: rows } = await supabase
      .from('questions')
      .select('id, chapter_id, subject_id, question_text, option_a, option_b, option_c, option_d, year_tag, difficulty')
      .eq('chapter_id', chapterId)
      .eq('is_active', true)
      .limit(100)

    if (!rows || rows.length === 0) {
      // Chapter exists but has no questions yet
      return NextResponse.json({ chapterId, questions: [], questionCount: 0 })
    }

    const unseen   = rows.filter((q) => !seenIds.has(q.id))
    const pool     = unseen.length >= 3 ? unseen : rows
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const questions: Question[] = shuffled.map((r: any) => ({
      id:           r.id,
      chapterId:    r.chapter_id,
      subjectId:    r.subject_id,
      questionText: r.question_text,
      optionA:      r.option_a,
      optionB:      r.option_b,
      optionC:      r.option_c,
      optionD:      r.option_d,
      yearTag:      r.year_tag,
      difficulty:   r.difficulty,
    }))

    return NextResponse.json({ chapterId, questions, questionCount: questions.length })
  } catch (err) {
    console.error('[chapter-questions] Error:', err)
    // Fallback to mock on any DB error
    const pool     = MOCK_QUESTIONS.filter((q) => q.chapterId === chapterId)
    const fallback = pool.length >= 3 ? pool : MOCK_QUESTIONS.slice(0, count)
    return NextResponse.json({ chapterId, questions: fallback, questionCount: fallback.length })
  }
}
