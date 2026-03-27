import { createClient } from '@supabase/supabase-js'

// ─── Supabase Server Client ──────────────────────────────────────────────────
// Used ONLY in API routes (server-side).
// Uses service role key → bypasses RLS → full DB access.
// NEVER import this in client components — it exposes the service role key.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(serviceRoleKey)

export function createServerClient() {
  if (!isSupabaseConfigured) {
    return null
  }
  return createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      // Don't persist sessions on the server
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
