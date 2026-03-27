import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { MOCK_QUESTIONS } from '@/lib/mock-data'
import { DAILY_SET_SIZE, SESSION_ESTIMATED_MINUTES, getSubjectById } from '@/lib/constants'
import type { Question, SetMix } from '@/types'

// GET /api/daily-set?userId=...&classLevel=...&subjectIds=...
// Returns today's daily set, generating one if needed.
// Questions are chosen via a 3-bucket personalisation algorithm:
//
//   FOCUS         (target 5)  weak chapters:  accuracy < 60%, ≥ 5 attempts
//   REINFORCEMENT (target 3)  recently practised chapters (last 7 days)
//   EXPLORATION   (target 2)  new or less-practised chapters
//
// If any bucket is short, overflow fills from other buckets so a full
// 10-question set is always returned whenever the DB has enough questions.
// Falls back to demo mode on ANY error — the home screen never shows blank.

// ─── Bucket constants ─────────────────────────────────────────────────────────
const BUCKET_TARGETS = { focus: 5, reinforcement: 3, exploration: 2 } as const
const MIN_ATTEMPTS_WEAK = 5      // chapters with fewer attempts are not flagged as weak
const WEAK_ACCURACY     = 0.60   // below this threshold → "focus" chapter
const RECENT_DAYS       = 7      // window for the reinforcement bucket (days)
const ATTEMPTS_LOOKBACK = 90     // days of history fetched for stats (bounded scan)
const POOL_MULTIPLIER   = 4      // fetch 4× target so dedup has room to prefer unseen

// ─── Internal types ───────────────────────────────────────────────────────────
type BucketLabel = 'focus' | 'reinforcement' | 'exploration'

interface ChapterStat {
  chapterId: string
  subjectId: string
  attempted: number
  correct:   number
  lastSeen:  string   // ISO timestamp of most-recent attempt in this chapter
}

interface TaggedQuestion extends Question {
  _bucket: BucketLabel
}

interface SmartSet {
  questions: Question[]
  mix:       SetMix
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const userId     = req.nextUrl.searchParams.get('userId')
  const classLevel = parseInt(req.nextUrl.searchParams.get('classLevel') ?? '10')
  const subjectIds = (req.nextUrl.searchParams.get('subjectIds') ?? '').split(',').filter(Boolean)
  const today      = new Date().toISOString().slice(0, 10)

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  // ── Pure demo mode ─────────────────────────────────────────────────────────
  if (!isSupabaseConfigured) {
    return NextResponse.json(buildDemoSet(today, subjectIds, classLevel))
  }

  // ── Supabase mode — wrap everything so errors NEVER bubble to client ────────
  try {
    const supabase = createServerClient()!

    // ── 1. Check for existing set today ─────────────────────────────────────
    const { data: existingSet } = await supabase
      .from('daily_sets')
      .select('id, question_ids, status, mix')
      .eq('user_id', userId)
      .eq('set_date', today)
      .single()

    if (existingSet) {
      const questionIds: string[] = existingSet.question_ids
      const questions = await fetchQuestionsById(supabase, questionIds)
      if (questions.length > 0) {
        return NextResponse.json({
          dailySetId:       existingSet.id,
          date:             today,
          questionCount:    questions.length,
          subjects:         getSubjectNames(questions),
          estimatedMinutes: SESSION_ESTIMATED_MINUTES,
          questions,
          isCompleted:      existingSet.status === 'completed',
          mix:              (existingSet.mix as SetMix) ?? null,
        })
      }
    }

    // ── 2. Ensure user exists in DB ──────────────────────────────────────────
    let dbSubjectIds = subjectIds
    let dbClassLevel = classLevel

    const { data: userRow } = await supabase
      .from('users')
      .select('class_level, subject_ids')
      .eq('id', userId)
      .single()

    if (!userRow) {
      await supabase.from('users').upsert({
        id:                  userId,
        name:                'Student',
        class_level:         classLevel,
        subject_ids:         subjectIds,
        onboarding_complete: true,
        updated_at:          new Date().toISOString(),
      }, { onConflict: 'id' })

      await supabase.from('streaks').upsert(
        { user_id: userId, current_streak: 0, longest_streak: 0 },
        { onConflict: 'user_id', ignoreDuplicates: true }
      )
    } else {
      dbSubjectIds = userRow.subject_ids ?? subjectIds
      dbClassLevel = userRow.class_level  ?? classLevel
    }

    // ── 3. Smart question selection ──────────────────────────────────────────

    // Query 1: per-chapter accuracy stats + seen question IDs (single round-trip)
    const { stats, seenIds } = await fetchChapterStats(supabase, userId, dbSubjectIds)

    // Query 2: all chapter IDs for the user's subjects (feeds exploration pool)
    const { data: chapterRows } = await supabase
      .from('chapters')
      .select('id')
      .in('subject_id', dbSubjectIds)

    const allChapterIds = (chapterRows ?? []).map((c) => c.id)

    // Classify chapters into buckets (pure in-memory — no additional queries)
    const sevenDaysAgo = new Date(Date.now() - RECENT_DAYS * 86_400_000).toISOString()
    const buckets      = classifyChapters(stats, allChapterIds, sevenDaysAgo)

    // Queries 3, 4, 5: fetch candidate pools in parallel
    const poolLimit = Math.max(DAILY_SET_SIZE * POOL_MULTIPLIER, 20)
    const [focusPool, reinforcementPool, explorationPool] = await Promise.all([
      fetchPool(supabase, buckets.focus,         dbClassLevel, poolLimit, 'focus'),
      fetchPool(supabase, buckets.reinforcement, dbClassLevel, poolLimit, 'reinforcement'),
      fetchPool(supabase, buckets.exploration,   dbClassLevel, poolLimit, 'exploration'),
    ])

    // Merge pools into the final 10-question set with gap-filling
    const { questions: selectedQuestions, mix } = allocateBuckets(
      focusPool, reinforcementPool, explorationPool,
      seenIds, BUCKET_TARGETS, DAILY_SET_SIZE,
    )

    // ── 4. Fall back to mock if DB has too few questions ─────────────────────
    if (selectedQuestions.length < 3) {
      return NextResponse.json(buildDemoSet(today, dbSubjectIds, dbClassLevel))
    }

    // ── 5. Save daily set (with mix) ─────────────────────────────────────────
    const questionIds = selectedQuestions.map((q) => q.id)
    const { data: newSet } = await supabase
      .from('daily_sets')
      .insert({
        user_id:      userId,
        set_date:     today,
        question_ids: questionIds,
        status:       'pending',
        mix,
      })
      .select('id')
      .single()

    return NextResponse.json({
      dailySetId:       newSet?.id ?? `local-${Date.now()}`,
      date:             today,
      questionCount:    selectedQuestions.length,
      subjects:         getSubjectNames(selectedQuestions),
      estimatedMinutes: SESSION_ESTIMATED_MINUTES,
      questions:        selectedQuestions,
      isCompleted:      false,
      mix,
    })
  } catch (err) {
    // NEVER let a DB error break the home screen — fall back to demo
    console.error('[daily-set] Supabase error, falling back to demo:', err)
    return NextResponse.json(buildDemoSet(today, subjectIds, classLevel))
  }
}

// ─── Smart selection helpers ──────────────────────────────────────────────────

/**
 * Query 1 — Fetches attempt history to compute per-chapter accuracy stats.
 * Also collects all seen question IDs so the picker can prefer unseen questions.
 * Uses a bounded lookback window (ATTEMPTS_LOOKBACK days) for performance.
 */
async function fetchChapterStats(
  supabase:   ReturnType<typeof createServerClient>,
  userId:     string,
  subjectIds: string[],
): Promise<{ stats: ChapterStat[]; seenIds: Set<string> }> {
  const cutoff = new Date(Date.now() - ATTEMPTS_LOOKBACK * 86_400_000).toISOString()

  const { data: rows } = await supabase!
    .from('attempts')
    .select('question_id, is_correct, answered_at, questions(chapter_id, subject_id)')
    .eq('user_id', userId)
    .gte('answered_at', cutoff)
    .limit(1000)

  const statsMap = new Map<string, ChapterStat>()
  const seenIds  = new Set<string>()

  for (const row of rows ?? []) {
    seenIds.add(row.question_id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const q      = row.questions as any
    const chapId = q?.chapter_id as string | undefined
    const subjId = q?.subject_id as string | undefined

    // Only aggregate chapters in the user's selected subjects
    if (!chapId || !subjId || !subjectIds.includes(subjId)) continue

    if (!statsMap.has(chapId)) {
      statsMap.set(chapId, {
        chapterId: chapId,
        subjectId: subjId,
        attempted: 0,
        correct:   0,
        lastSeen:  row.answered_at,
      })
    }
    const s = statsMap.get(chapId)!
    s.attempted++
    if (row.is_correct) s.correct++
    if (row.answered_at > s.lastSeen) s.lastSeen = row.answered_at
  }

  return { stats: Array.from(statsMap.values()), seenIds }
}

/**
 * Classifies chapter IDs into three exclusive buckets (pure in-memory, no DB).
 *
 *   FOCUS         accuracy < WEAK_ACCURACY and attempted ≥ MIN_ATTEMPTS_WEAK
 *   REINFORCEMENT attempted within RECENT_DAYS, and not in focus
 *   EXPLORATION   all remaining chapter IDs (including never-attempted chapters)
 */
function classifyChapters(
  stats:         ChapterStat[],
  allChapterIds: string[],
  sevenDaysAgo:  string,
): { focus: string[]; reinforcement: string[]; exploration: string[] } {
  const focus:         string[] = []
  const reinforcement: string[] = []
  const classified = new Set<string>()

  for (const s of stats) {
    const accuracy = s.correct / s.attempted
    if (s.attempted >= MIN_ATTEMPTS_WEAK && accuracy < WEAK_ACCURACY) {
      focus.push(s.chapterId)
      classified.add(s.chapterId)
    } else if (s.lastSeen >= sevenDaysAgo) {
      reinforcement.push(s.chapterId)
      classified.add(s.chapterId)
    }
    // Chapters practised more than RECENT_DAYS ago with ≥60% accuracy
    // are deliberately excluded — they don't need reinforcement right now.
  }

  // Exploration = every chapter not already assigned to focus or reinforcement.
  // This includes chapters the student has never touched.
  const exploration = allChapterIds.filter((id) => !classified.has(id))

  return { focus, reinforcement, exploration }
}

/**
 * Queries 3/4/5 — Fetches a shuffled pool of candidate questions for a
 * given list of chapter IDs.  Returns an empty array immediately when
 * chapterIds is empty (avoids unnecessary DB round-trips).
 */
async function fetchPool(
  supabase:   ReturnType<typeof createServerClient>,
  chapterIds: string[],
  classLevel: number,
  limit:      number,
  bucket:     BucketLabel,
): Promise<TaggedQuestion[]> {
  if (chapterIds.length === 0) return []

  const { data } = await supabase!
    .from('questions')
    .select('id, chapter_id, subject_id, question_text, option_a, option_b, option_c, option_d, year_tag, difficulty')
    .in('chapter_id', chapterIds)
    .eq('class_level', classLevel)
    .eq('is_active', true)
    .limit(limit)

  if (!data || data.length === 0) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => ({ ...mapQuestion(r), _bucket: bucket }))
}

/**
 * Picks up to `want` questions from a pool.
 * Prefers questions the student hasn't seen recently (seenIds).
 * Falls back to seen questions only when unseen runs dry.
 * Each group is shuffled to prevent always serving the same subset.
 */
function pickFrom(
  pool:    TaggedQuestion[],
  seenIds: Set<string>,
  want:    number,
): TaggedQuestion[] {
  if (want <= 0 || pool.length === 0) return []

  const unseen = pool.filter((q) => !seenIds.has(q.id)).sort(() => Math.random() - 0.5)
  const seen   = pool.filter((q) =>  seenIds.has(q.id)).sort(() => Math.random() - 0.5)

  return [...unseen, ...seen].slice(0, want)
}

/**
 * Assembles the final question set by allocating across the three bucket pools.
 *
 * Algorithm:
 *   1. Pick up to `targets.N` from each bucket (prefer unseen).
 *   2. If total < target, fill the gap from the combined overflow of all pools.
 *      Overflow questions are tagged 'exploration'.
 *   3. Shuffle the final array so bucket order is invisible to the student.
 *   4. Return questions (internal _bucket tag stripped) + accurate mix counts.
 */
function allocateBuckets(
  focusPool:         TaggedQuestion[],
  reinforcementPool: TaggedQuestion[],
  explorationPool:   TaggedQuestion[],
  seenIds:           Set<string>,
  targets:           typeof BUCKET_TARGETS,
  total:             number,
): SmartSet {
  const picked    = new Array<TaggedQuestion>()
  const pickedIds = new Set<string>()

  function take(pool: TaggedQuestion[], want: number): void {
    const available = pool.filter((q) => !pickedIds.has(q.id))
    const chosen    = pickFrom(available, seenIds, want)
    for (const q of chosen) {
      picked.push(q)
      pickedIds.add(q.id)
    }
  }

  // Primary allocation — respect per-bucket targets
  take(focusPool,         targets.focus)
  take(reinforcementPool, targets.reinforcement)
  take(explorationPool,   targets.exploration)

  // Gap-fill: if any bucket was short, draw from all remaining candidates.
  // Overflow questions are tagged 'exploration' — they aren't specifically
  // targeted by chapter weakness or recency.
  const deficit = total - picked.length
  if (deficit > 0) {
    const overflow: TaggedQuestion[] = [
      ...focusPool,
      ...reinforcementPool,
      ...explorationPool,
    ]
      .filter((q) => !pickedIds.has(q.id))
      .map((q)  => ({ ...q, _bucket: 'exploration' as BucketLabel }))

    take(overflow, deficit)
  }

  // Shuffle so the student sees an interleaved set, not grouped by bucket
  const shuffled = picked
    .slice(0, total)
    .sort(() => Math.random() - 0.5)

  const mix: SetMix = {
    focus:         shuffled.filter((q) => q._bucket === 'focus').length,
    reinforcement: shuffled.filter((q) => q._bucket === 'reinforcement').length,
    exploration:   shuffled.filter((q) => q._bucket === 'exploration').length,
  }

  // Strip internal _bucket tag — it must never reach the client
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const questions: Question[] = shuffled.map(({ _bucket, ...q }) => q)

  return { questions, mix }
}

// ─── Demo / fallback helpers ──────────────────────────────────────────────────

/**
 * Builds a demo set from mock questions when Supabase is not configured,
 * or as a last-resort fallback when the DB returns too few questions.
 * Returns a realistic mix shape so the UI always renders correctly.
 */
function buildDemoSet(today: string, subjectIds: string[], _classLevel: number) {
  let pool = MOCK_QUESTIONS.filter((q) => {
    return subjectIds.length === 0 || subjectIds.includes(q.subjectId)
  })
  if (pool.length < 5) pool = MOCK_QUESTIONS // widen to all if filter is too narrow

  const shuffled  = [...pool].sort(() => Math.random() - 0.5)
  const questions = shuffled.slice(0, DAILY_SET_SIZE)
  const subjects  = getSubjectNames(questions)

  // Brand-new demo user → all exploration, no focus/reinforcement
  const mix: SetMix = { focus: 0, reinforcement: 0, exploration: questions.length }

  return {
    dailySetId:       `demo-${today}`,
    date:             today,
    questionCount:    questions.length,
    subjects:         subjects.length > 0 ? subjects : ['Science', 'Mathematics'],
    estimatedMinutes: SESSION_ESTIMATED_MINUTES,
    questions,
    isCompleted:      false,
    mix,
  }
}

// ─── Shared utilities ─────────────────────────────────────────────────────────

async function fetchQuestionsById(
  supabase: ReturnType<typeof createServerClient>,
  ids:      string[],
): Promise<Question[]> {
  if (!ids || ids.length === 0) return []
  const { data } = await supabase!
    .from('questions')
    .select('id, chapter_id, subject_id, question_text, option_a, option_b, option_c, option_d, year_tag, difficulty')
    .in('id', ids)
  return (data ?? []).map(mapQuestion)
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
