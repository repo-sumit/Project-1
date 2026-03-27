import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ─── Supabase Browser Client ──────────────────────────────────────────────────
// Safe: returns null if env vars are not set → app runs in Demo Mode.

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.log('[PrepFire] Running in Demo Mode — Supabase not configured.')
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null
