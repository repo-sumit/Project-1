import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import type { MistakeItem } from '@/types'

// ─── Demo data ─────────────────────────────────────────────────────────────────
// Shown when Supabase is not configured so the review screen always has
// something educational to display.
const DEMO_MISTAKES: MistakeItem[] = [
  {
    questionId:    'demo-mistake-1',
    questionText:  'What is the HCF of 26 and 91?',
    options:       { A: '13', B: '7', C: '26', D: '91' },
    selectedOption: 'B',
    correctOption:  'A',
    explanation:   "Using Euclid's algorithm: 91 = 3 × 26 + 13, then 26 = 2 × 13 + 0. So HCF(26, 91) = 13.",
    chapterName:   'Real Numbers',
    yearTag:       2022,
  },
  {
    questionId:    'demo-mistake-2',
    questionText:  'Which of the following is the chemical formula of baking soda?',
    options:       { A: 'Na₂CO₃', B: 'NaOH', C: 'NaHCO₃', D: 'Na₂SO₄' },
    selectedOption: 'A',
    correctOption:  'C',
    explanation:   'Baking soda is sodium bicarbonate (NaHCO₃). Na₂CO₃ is washing soda, not baking soda.',
    chapterName:   'Acids, Bases and Salts',
    yearTag:       2023,
  },
  {
    questionId:    'demo-mistake-3',
    questionText:  'Which organelle is known as the powerhouse of the cell?',
    options:       { A: 'Nucleus', B: 'Ribosome', C: 'Golgi Apparatus', D: 'Mitochondria' },
    selectedOption: 'A',
    correctOption:  'D',
    explanation:   'Mitochondria produce ATP through cellular respiration, supplying energy to the cell — hence "powerhouse of the cell".',
    chapterName:   'Life Processes',
    yearTag:       2021,
  },
]

// GET /api/session-mistakes?sessionId=...
// Returns the list of questions the student answered incorrectly in a session,
// enriched with the correct answer, explanation, and chapter name.
// Returns [] if the session has no mistakes (perfect score) — never errors.

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  // ── Demo mode ──────────────────────────────────────────────────────────────
  if (!isSupabaseConfigured) {
    return NextResponse.json(DEMO_MISTAKES)
  }

  // ── Supabase mode ──────────────────────────────────────────────────────────
  try {
    const supabase = createServerClient()!

    // Fetch all wrong attempts for this session, joining to questions for
    // the full question data we need to display the review card.
    const { data: attempts, error } = await supabase
      .from('attempts')
      .select(`
        question_id,
        selected_option,
        questions (
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option,
          explanation,
          year_tag,
          chapter_id
        )
      `)
      .eq('session_id', sessionId)
      .eq('is_correct', false)

    if (error || !attempts || attempts.length === 0) {
      return NextResponse.json([])
    }

    // Collect unique chapter IDs so we can look up display names in one query
    const chapterIds = [
      ...new Set(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        attempts.map((a) => (a.questions as any)?.chapter_id).filter(Boolean) as string[]
      ),
    ]

    const { data: chapters } = await supabase
      .from('chapters')
      .select('id, name')
      .in('id', chapterIds)

    const chapterMap: Record<string, string> = {}
    for (const ch of chapters ?? []) {
      chapterMap[ch.id] = ch.name
    }

    // Build the response
    const result: MistakeItem[] = attempts.map((attempt) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q = attempt.questions as any
      return {
        questionId:    attempt.question_id,
        questionText:  q?.question_text ?? '',
        options: {
          A: q?.option_a ?? '',
          B: q?.option_b ?? '',
          C: q?.option_c ?? '',
          D: q?.option_d ?? '',
        },
        selectedOption: attempt.selected_option,
        correctOption:  q?.correct_option ?? '',
        explanation:    q?.explanation ?? '',
        chapterName:    chapterMap[q?.chapter_id] ?? 'Unknown Chapter',
        yearTag:        q?.year_tag ?? null,
      }
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('[session-mistakes] Error:', err)
    return NextResponse.json([]) // always return something — never crash the review page
  }
}
