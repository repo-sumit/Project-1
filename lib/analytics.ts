// ─── PrepFire Analytics ───────────────────────────────────────────────────────
// Lightweight, fire-and-forget event tracking.
//
// USAGE:
//   trackEvent(user.id, 'session_started', { sessionId, source: 'daily_set' })
//
// RULES:
//   - Never awaited    — does not block navigation or UI updates
//   - Never throws     — analytics failures are silently ignored
//   - No user impact   — a broken analytics endpoint = nothing visible to user
//   - keepalive: true  — fetch completes even if the page navigates away immediately

/**
 * Track a single user event.  Fire-and-forget — safe to call anywhere.
 *
 * @param userId   UUID of the current user.  If null/undefined, call is a no-op.
 * @param event    Snake_case event name e.g. 'session_started'.
 * @param metadata Optional key/value bag stored in the events.metadata JSONB column.
 */
export function trackEvent(
  userId:   string | null | undefined,
  event:    string,
  metadata: Record<string, unknown> = {},
): void {
  // Skip anonymous events — we can't attribute them anyway
  if (!userId || !event) return

  // keepalive ensures the request is not cancelled when the page navigates away.
  // This is important for events like 'session_started' where the user taps a
  // button and is immediately routed to a new page.
  void fetch('/api/analytics', {
    method:    'POST',
    headers:   { 'Content-Type': 'application/json' },
    body:      JSON.stringify({ userId, event, metadata }),
    keepalive: true,   // completes even after page navigation
  }).catch(() => undefined)   // swallow all errors silently
}

// ─── Event name constants ─────────────────────────────────────────────────────
// Centralised names prevent typos across the codebase.

export const EVENTS = {
  ONBOARDING_COMPLETED:     'onboarding_completed',
  DAILY_SET_LOADED:         'daily_set_loaded',
  SESSION_STARTED:          'session_started',
  ANSWER_SUBMITTED:         'answer_submitted',
  SESSION_COMPLETED:        'session_completed',
  MISTAKE_REVIEW_OPENED:    'mistake_review_opened',
  CHAPTER_PRACTICE_STARTED: 'chapter_practice_started',
} as const
