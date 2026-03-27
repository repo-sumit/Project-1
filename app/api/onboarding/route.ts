import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

// POST /api/onboarding
// Creates or updates a user record in the database.
// This is fire-and-forget from the client — local storage saves first.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, name, classLevel, subjectIds } = body

    // Validate required fields
    if (!userId || !name || !classLevel || !Array.isArray(subjectIds)) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, name, classLevel, subjectIds' },
        { status: 400 }
      )
    }

    // Demo mode: no Supabase configured
    if (!isSupabaseConfigured) {
      return NextResponse.json({ userId, onboardingComplete: true })
    }

    const supabase = createServerClient()!

    // Upsert user record (insert or update)
    const { error } = await supabase.from('users').upsert(
      {
        id: userId,
        name: name.trim().slice(0, 50),
        class_level: classLevel,
        subject_ids: subjectIds,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

    if (error) {
      console.error('[onboarding] Supabase error:', error.message)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Ensure streak row exists
    await supabase.from('streaks').upsert(
      {
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
      },
      { onConflict: 'user_id', ignoreDuplicates: true }
    )

    return NextResponse.json({ userId, onboardingComplete: true })
  } catch (e) {
    console.error('[onboarding] Error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
