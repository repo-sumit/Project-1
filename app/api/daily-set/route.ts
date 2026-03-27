import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { MOCK_QUESTIONS } from '@/lib/mock-data'
import { DAILY_SET_SIZE, SESSION_ESTIMATED_MINUTES, getSubjectById } from '@/lib/constants'
import type { Question } from '@/types'

// GET /api/daily-set?userId=...&classLevel=...&subjectIds=...
// Returns today's daily set. Generates one if it doesn't exist.
// Falls back to demo mode on ANY error — never shows a blank screen.

export async function GET(req: NextRequest) {
  const userId      = req.nextUrl.searchParams.get('userId')
  const classLevel  = parseInt(req.nextUrl.searchParams.get('classLevel') ?? '10')
  const subjectIds  = (req.nextUrl.searchParams.get('subjectIds') ?? '').split(',').filter(Boolean)
  const today       = new Date().toISOString().slice(0, 10)

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  // ── Pure demo mode (no env vars) ─────────────────────────────────────────
  if (!isSupabaseConfigured) {
    return NextResponse.json(buildDemoSet(today, subjectIds, classLevel))
  }

  // ── Supabase mode — wrap everything so errors NEVER bubble to client ──────
  try {
    const supabase = createServerClient()!

    // 1. Check for existing set today
    const { data: existingSet } = await supabase
      .from('daily_sets')
      .select('*')
      .eq('user_id', userId)
      .eq('set_date', today)
      .single()

    if (existingSet) {
      const questionIds: string[] = existingSet.question_ids
      const questions = await fetchQuestionsById(supabase, questionIds)
      if (questions.length > 0) {
        return NextResponse.json({
          dailySetId: existingSet.id,
          date: today,
          questionCount: questions.length,
          subjects: getSubjectNames(questions),
          estimatedMinutes: SESSION_ESTIMATED_MINUTES,
          questions,
          isCompleted: existingSet.status === 'completed',
        })
      }
    }

    // 2. Ensure user exists in DB — auto-create if not (handles the case
    //    where localStorage onboarding saved but backend POST failed)
    let dbSubjectIds = subjectIds
    let dbClassLevel = classLevel

    const { data: userRow } = await supabase
      .from('users')
      .select('class_level, subject_ids')
      .eq('id', userId)
      .single()

    if (!userRow) {
      // Auto-create user so future calls work
      await supabase.from('users').upsert({
        id: userId,
        name: 'Student',
        class_level: classLevel,
        subject_ids: subjectIds,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })

      await supabase.from('streaks').upsert(
        { user_id: userId, current_streak: 0, longest_streak: 0 },
        { onConflict: 'user_id', ignoreDuplicates: true }
      )
    } else {
      dbSubjectIds = userRow.subject_ids ?? subjectIds
      dbClassLevel = userRow.class_level ?? classLevel
    }

    // 3. Get seen question IDs (avoid repeats)
    const { data: seenAttempts } = await supabase
      .from('attempts')
      .select('question_id')
      .eq('user_id', userId)
      .limit(500)

    const seenIds = new Set(
      (seenAttempts ?? []).map((a: { question_id: string }) => a.question_id)
    )

    // 4. Select questions from DB
    const selectedQuestions = await selectQuestions(supabase, {
      subjectIds: dbSubjectIds,
      classLevel: dbClassLevel,
      seenIds,
      count: DAILY_SET_SIZE,
    })

    // 5. Fall back to mock if DB has no questions yet
    if (selectedQuestions.length === 0) {
      return NextResponse.json(buildDemoSet(today, dbSubjectIds, dbClassLevel))
    }

    // 6. Save daily set
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

    return NextResponse.json({
      dailySetId: newSet?.id ?? `local-${Date.now()}`,
      date: today,
      questionCount: selectedQuestions.length,
      subjects: getSubjectNames(selectedQuestions),
      estimatedMinutes: SESSION_ESTIMATED_MINUTES,
      questions: selectedQuestions,
      isCompleted: false,
    })
  } catch (err) {
    // NEVER let a DB error break the home screen — fall back to demo
    console.error('[daily-set] Supabase error, falling back to demo:', err)
    return NextResponse.json(buildDemoSet(today, subjectIds, classLevel))
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDemoSet(today: string, subjectIds: string[], classLevel: number) {
  // Filter mock questions by user's class + subjects where possible
  let pool = MOCK_QUESTIONS.filter((q) => {
    const matchesSubject = subjectIds.length === 0 || subjectIds.includes(q.subjectId)
    return matchesSubject
  })
  if (pool.length < 5) pool = MOCK_QUESTIONS // fallback to all

  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const questions = shuffled.slice(0, DAILY_SET_SIZE)
  const subjects  = getSubjectNames(questions)

  return {
    dailySetId: `demo-${today}`,
    date: today,
    questionCount: questions.length,
    subjects: subjects.length > 0 ? subjects : ['Science', 'Mathematics'],
    estimatedMinutes: SESSION_ESTIMATED_MINUTES,
    questions,
    isCompleted: false,
  }
}

async function fetchQuestionsById(
  supabase: ReturnType<typeof createServerClient>,
  ids: string[]
): Promise<Question[]> {
  if (!ids || ids.length === 0) return []
  const { data } = await supabase!
    .from('questions')
    .select('id, chapter_id, subject_id, question_text, option_a, option_b, option_c, option_d, year_tag, difficulty')
    .in('id', ids)

  return (data ?? []).map(mapQuestion)
}

async function selectQuestions(
  supabase: ReturnType<typeof createServerClient>,
  opts: { subjectIds: string[]; classLevel: number; seenIds: Set<string>; count: number }
): Promise<Question[]> {
  const { subjectIds, classLevel, seenIds, count } = opts

  let query = supabase!
    .from('questions')
    .select('id, chapter_id, subject_id, question_text, option_a, option_b, option_c, option_d, year_tag, difficulty')
    .eq('class_level', classLevel)
    .eq('is_active', true)
    .limit(150)

  if (subjectIds.length > 0) {
    query = query.in('subject_id', subjectIds)
  }

  const { data } = await query
  if (!data || data.length === 0) return []

  const unseen   = data.filter((q) => !seenIds.has(q.id))
  const pool     = unseen.length >= count ? unseen : data
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count)

  return shuffled.map(mapQuestion)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapQuestion(r: any): Question {
  return {
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
  }
}

function getSubjectNames(questions: Question[]): string[] {
  const ids = Array.from(new Set(questions.map((q) => q.subjectId)))
  return ids.map((id) => getSubjectById(id)?.name ?? id).filter(Boolean) as string[]
}
