import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import { getSubjectById } from '@/lib/constants'

// POST /api/sessions
// Creates a new session record before the user starts answering.
//
// Body: { userId, dailySetId?, chapterId? }
//   - dailySetId  → daily-set session  (home screen flow)
//   - chapterId   → chapter session    (chapter practice flow)
//   - neither     → free session       (future use)
//
// subject_name is stored on the row so progress history and leaderboard
// can display it without joining back to chapters/subjects.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, dailySetId, chapterId } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // ── Demo mode ─────────────────────────────────────────────────────────
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        sessionId: `demo-session-${Date.now()}`,
        startedAt: new Date().toISOString(),
      })
    }

    // ── Supabase mode ──────────────────────────────────────────────────────
    const supabase = createServerClient()!

    // Resolve subject_name for display purposes.
    // For daily sets: use the user's first subject.
    // For chapter sessions: look up the chapter's subject_id.
    let subjectName: string | null = null

    if (chapterId) {
      // Look up which subject this chapter belongs to
      const { data: chapter } = await supabase
        .from('chapters')
        .select('subject_id')
        .eq('id', chapterId)
        .single()

      if (chapter?.subject_id) {
        subjectName = getSubjectById(chapter.subject_id)?.name ?? chapter.subject_id
      }
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id:         userId,
        daily_set_id:    dailySetId  ?? null,
        chapter_id:      chapterId   ?? null,   // ← now correctly saved
        subject_name:    subjectName,
        started_at:      new Date().toISOString(),
        total_questions: 10,
        correct_count:   0,
        xp_earned:       0,
      })
      .select('id, started_at')
      .single()

    if (error) {
      console.error('[sessions POST] Error:', error.message)
      return NextResponse.json({ error: 'Could not create session' }, { status: 500 })
    }

    return NextResponse.json({
      sessionId: data.id,
      startedAt: data.started_at,
    })
  } catch (e) {
    console.error('[sessions POST] Unexpected error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
