import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

// POST /api/analytics
// Receives a single analytics event from the client and writes it to the
// `events` table in Supabase.
//
// Design rules:
//   - Always returns HTTP 200 — analytics must never cause client errors
//   - DB write is fire-and-forget — response is sent before the insert finishes
//   - No auth required — userId comes from the request body (validated below)
//   - Silently no-ops when Supabase is not configured (demo mode)

export async function POST(req: NextRequest) {
  // Always respond 200 — analytics endpoints must be invisible to the user
  try {
    const body = await req.json().catch(() => ({}))
    const { userId, event, metadata } = body

    // Minimal validation — drop malformed or anonymous events silently
    if (!userId || !event || typeof event !== 'string') {
      return NextResponse.json({ ok: true })
    }

    // No-op in demo mode (Supabase not configured)
    if (!isSupabaseConfigured) {
      return NextResponse.json({ ok: true })
    }

    const supabase = createServerClient()!

    // Fire-and-forget DB write — the client gets a response immediately.
    // If the insert fails (network blip, Supabase outage) we log a warning
    // but never surface it to the user.
    supabase
      .from('events')
      .insert({
        user_id:    userId,
        event_name: event,
        metadata:   metadata && typeof metadata === 'object' ? metadata : {},
      })
      .then(({ error }) => {
        if (error) console.warn('[analytics] Insert failed:', error.message)
      })
      .catch((err) => {
        console.warn('[analytics] Unexpected error:', err?.message)
      })

    return NextResponse.json({ ok: true })
  } catch {
    // Even a crash returns 200 — analytics must not affect UX
    return NextResponse.json({ ok: true })
  }
}
