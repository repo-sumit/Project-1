import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { MOCK_QUESTIONS } from '@/lib/mock-data'
import { DAILY_SET_SIZE, SESSION_ESTIMATED_MINUTES, getSubjectById } from '@/lib/constants'
import type { Question } from '@/types'

// GET /api/daily-set?userId=...
// Returns today's daily set. Generates one if it doesn't exist for today.
// Correct options are NEVER included in the response — only returned from /api/attempts.

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const today = new Date().toISOString().slice(0, 10)

  // ── Demo mode ───────────────────────────────────────────────────────────
  if (!isSupabaseConfigured) {
    return NextResponse.json(buildDemoSet(today))
  }

  // ── Supabase mode ────────────────────────────────────────────────────────
  const supabase = createServerClient()!

  // 1. Check if today's set already exists
  const { data: existingSet } = await supabase
    .from('daily_sets')
    .select('*')
    .eq('user_id', userId)
    .eq('set_date', today)
    .single()

  if (existingSet) {
    // Fetch questions for this set
    const questionIds: string[] = existingSet.question_ids
    const questions = await fetchQuestionsById(supabase, questionIds)
    const subjects = getSubjectNames(questions)

    return NextResponse.json({
      dailySetId: existingSet.id,
      date: today,
      questionCount: questions.length,
      subjects,
      estimatedMinutes: SESSION_ESTIMATED_MINUTES,
      questions,
      isCompleted: existingSet.status === 'completed',
    })
  }

  // 2. Generate a new daily set for this user
  const { data: userRow } = await supabase
    .from('users')
    .select('class_level, subject_ids')
    .eq('id', userId)
    .single()

  if (!userRow) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const subjectIds: string[] = userRow.subject_ids ?? []
  const classLevel: number = userRow.class_level ?? 10

  // 3. Get questions the user has already seen (avoid repeats)
  const { data: seenAttempts } = await supabase
    .from('attempts')
    .select('question_id')
    .eq('user_id', userId)
    .limit(500)

  const seenIds = new Set((seenAttempts ?? []).map((a: { question_id: string }) => a.question_id))

  // 4. Pick questions from the user's subjects
  const selectedQuestions = await selectQuestions(supabase, {
    subjectIds,
    classLevel,
    seenIds,
    count: DAILY_SET_SIZE,
  })

  if (selectedQuestions.length === 0) {
    // Fallback: return mock questions if DB has no questions yet
    return NextResponse.json(buildDemoSet(today))
  }

  // 5. Save the daily set
  const questionIds = selectedQuestions.map((q) => q.id)
  const { data: newSet } = await supabase
    .from('daily_sets')
    .insert({
      user_id: userId,
      set_date: today,
      question_ids: questionIds,
      status: 'pending',
    })
    .select('id')
    .single()

  const subjects = getSubjectNames(selectedQuestions)

  return NextResponse.json({
    dailySetId: newSet?.id ?? `local-${Date.now()}`,
    date: today,
    questionCount: selectedQuestions.length,
    subjects,
    estimatedMinutes: SESSION_ESTIMATED_MINUTES,
    questions: selectedQuestions,
    isCompleted: false,
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDemoSet(today: string) {
  // Shuffle the mock questions for variety
  const shuffled = [...MOCK_QUESTIONS].sort(() => Math.random() - 0.5)
  const questions = shuffled.slice(0, DAILY_SET_SIZE)
  return {
    dailySetId: `demo-${today}`,
    date: today,
    questionCount: questions.length,
    subjects: ['Science', 'Mathematics'],
    estimatedMinutes: SESSION_ESTIMATED_MINUTES,
    questions,
    isCompleted: false,
  }
}

async function fetchQuestionsById(
  supabase: ReturnType<typeof createServerClient>,
  ids: string[]
): Promise<Question[]> {
  const { data } = await supabase!
    .from('questions')
    .select('id, chapter_id, subject_id, question_text, option_a, option_b, option_c, option_d, year_tag, difficulty')
    .in('id', ids)

  if (!data) return []

  // Map snake_case DB fields to camelCase
  return data.map((r) => ({
    id: r.id,
    chapterId: r.chapter_id,
    subjectId: r.subject_id,
    questionText: r.question_text,
    optionA: r.option_a,
    optionB: r.option_b,
    optionC: r.option_c,
    optionD: r.option_d,
    yearTag: r.year_tag,
    difficulty: r.difficulty,
  }))
}

async function selectQuestions(
  supabase: ReturnType<typeof createServerClient>,
  opts: {
    subjectIds: string[]
    classLevel: number
    seenIds: Set<string>
    count: number
  }
): Promise<Question[]> {
  const { subjectIds, classLevel, seenIds, count } = opts

  // Fetch a pool of unseen questions from user's subjects
  let query = supabase!
    .from('questions')
    .select('id, chapter_id, subject_id, question_text, option_a, option_b, option_c, option_d, year_tag, difficulty')
    .eq('class_level', classLevel)
    .eq('is_active', true)

  if (subjectIds.length > 0) {
    query = query.in('subject_id', subjectIds)
  }

  const { data } = await query.limit(100)
  if (!data) return []

  // Filter out seen questions
  const unseen = data.filter((q) => !seenIds.has(q.id))
  const pool = unseen.length >= count ? unseen : data // fallback to all if too few unseen

  // Shuffle and take the required count
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count)

  return shuffled.map((r) => ({
    id: r.id,
    chapterId: r.chapter_id,
    subjectId: r.subject_id,
    questionText: r.question_text,
    optionA: r.option_a,
    optionB: r.option_b,
    optionC: r.option_c,
    optionD: r.option_d,
    yearTag: r.year_tag,
    difficulty: r.difficulty,
  }))
}

function getSubjectNames(questions: Question[]): string[] {
  const subjectIds = [...new Set(questions.map((q) => q.subjectId))]
  return subjectIds
    .map((id) => getSubjectById(id)?.name ?? id)
    .filter(Boolean)
}
