import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ─── Supabase Server Client ───────────────────────────────────────────────────
// Used ONLY in API routes (server-side).
// Uses the service-role key → bypasses Row Level Security.
// NEVER import this in any client component — it exposes the service key.

const supabaseUrl      = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey   = process.env.SUPABASE_SERVICE_ROLE_KEY

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(serviceRoleKey)

/**
 * Call this inside API routes to get a server-side Supabase client.
 * Returns null when Supabase is not configured → caller falls back to demo mode.
 */
export function createServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null

  return createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  })
}
