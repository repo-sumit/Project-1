import { createClient } from '@supabase/supabase-js'

// ─── Supabase Browser Client ─────────────────────────────────────────────────
// Used in client components and hooks.
// Only has access to public (anon) data — respects Supabase RLS policies.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey)

// Create client only if env vars are present
// If not configured, the app runs in demo/mock mode
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null
