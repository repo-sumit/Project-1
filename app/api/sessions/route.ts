import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

// POST /api/sessions
// Creates a new session record before the user starts answering.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, dailySetId } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Demo mode
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        sessionId: `demo-session-${Date.now()}`,
        startedAt: new Date().toISOString(),
      })
    }

    const supabase = createServerClient()!

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: userId,
        daily_set_id: dailySetId ?? null,
        started_at: new Date().toISOString(),
        total_questions: 10,
        correct_count: 0,
        xp_earned: 0,
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
