-- ══════════════════════════════════════════════════════════════════════════════
-- PrepFire — Analytics Query Reference
-- Run these in Supabase Dashboard → SQL Editor → New Query
-- All queries read from the `events` table only.
-- ══════════════════════════════════════════════════════════════════════════════


-- ─── 1. Daily Active Users (DAU) ─────────────────────────────────────────────
-- Count of distinct users who triggered any event, grouped by day.
-- Use this to track overall engagement trend.

SELECT
  DATE(created_at)          AS day,
  COUNT(DISTINCT user_id)   AS dau
FROM events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1 DESC;


-- ─── 2. Daily Active Users — by event type ───────────────────────────────────
-- See which features drive daily engagement.

SELECT
  DATE(created_at)          AS day,
  event_name,
  COUNT(DISTINCT user_id)   AS users,
  COUNT(*)                  AS event_count
FROM events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY 1, 2
ORDER BY 1 DESC, 3 DESC;


-- ─── 3. Session Completion Rate ──────────────────────────────────────────────
-- Percentage of started sessions that were completed.
-- A low rate (< 60%) suggests drop-off mid-session.

WITH started AS (
  SELECT COUNT(DISTINCT metadata->>'sessionId') AS total
  FROM events
  WHERE event_name = 'session_started'
    AND created_at >= NOW() - INTERVAL '30 days'
),
completed AS (
  SELECT COUNT(DISTINCT metadata->>'sessionId') AS total
  FROM events
  WHERE event_name = 'session_completed'
    AND created_at >= NOW() - INTERVAL '30 days'
)
SELECT
  started.total                                             AS sessions_started,
  completed.total                                           AS sessions_completed,
  ROUND(completed.total::numeric / NULLIF(started.total, 0) * 100, 1)
                                                            AS completion_rate_pct
FROM started, completed;


-- ─── 4. Session Completion Rate — daily trend ────────────────────────────────

SELECT
  DATE(s.created_at)                                         AS day,
  COUNT(DISTINCT s.metadata->>'sessionId')                   AS started,
  COUNT(DISTINCT c.metadata->>'sessionId')                   AS completed,
  ROUND(
    COUNT(DISTINCT c.metadata->>'sessionId')::numeric
    / NULLIF(COUNT(DISTINCT s.metadata->>'sessionId'), 0) * 100
  , 1)                                                        AS completion_pct
FROM events s
LEFT JOIN events c
  ON  c.event_name = 'session_completed'
  AND c.metadata->>'sessionId' = s.metadata->>'sessionId'
WHERE s.event_name = 'session_started'
  AND s.created_at >= NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1 DESC;


-- ─── 5. Next-Day Retention ───────────────────────────────────────────────────
-- Of users who onboarded on day N, how many came back on day N+1?
-- This is the most important retention metric for a daily-habit app.

SELECT
  DATE(o.created_at)                                             AS cohort_day,
  COUNT(DISTINCT o.user_id)                                      AS new_users,
  COUNT(DISTINCT r.user_id)                                      AS returned_next_day,
  ROUND(
    COUNT(DISTINCT r.user_id)::numeric
    / NULLIF(COUNT(DISTINCT o.user_id), 0) * 100
  , 1)                                                            AS day1_retention_pct
FROM events o
LEFT JOIN events r
  ON  r.user_id    = o.user_id
  AND r.event_name = 'daily_set_loaded'
  AND DATE(r.created_at) = DATE(o.created_at) + INTERVAL '1 day'
WHERE o.event_name = 'onboarding_completed'
GROUP BY 1
ORDER BY 1 DESC;


-- ─── 6. Weekly Retention (Day 7) ─────────────────────────────────────────────
-- Same cohort logic but looking for return within 7 days.

SELECT
  DATE(o.created_at)                                             AS cohort_day,
  COUNT(DISTINCT o.user_id)                                      AS new_users,
  COUNT(DISTINCT r.user_id)                                      AS returned_day7,
  ROUND(
    COUNT(DISTINCT r.user_id)::numeric
    / NULLIF(COUNT(DISTINCT o.user_id), 0) * 100
  , 1)                                                            AS day7_retention_pct
FROM events o
LEFT JOIN events r
  ON  r.user_id    = o.user_id
  AND r.event_name = 'daily_set_loaded'
  AND r.created_at >= o.created_at + INTERVAL '6 days'
  AND r.created_at <  o.created_at + INTERVAL '8 days'
WHERE o.event_name = 'onboarding_completed'
GROUP BY 1
ORDER BY 1 DESC;


-- ─── 7. Average Session Accuracy ─────────────────────────────────────────────
-- Mean accuracy across all completed sessions.
-- Helps gauge whether questions are too hard or too easy.

SELECT
  ROUND(AVG((metadata->>'accuracyPct')::numeric), 1)   AS avg_accuracy_pct,
  ROUND(MIN((metadata->>'accuracyPct')::numeric), 1)   AS min_accuracy_pct,
  ROUND(MAX((metadata->>'accuracyPct')::numeric), 1)   AS max_accuracy_pct,
  COUNT(*)                                              AS total_sessions
FROM events
WHERE event_name = 'session_completed'
  AND metadata->>'accuracyPct' IS NOT NULL;


-- ─── 8. Mistake Review Engagement ────────────────────────────────────────────
-- What percentage of sessions with mistakes lead to a review?

WITH sessions_with_mistakes AS (
  SELECT COUNT(DISTINCT metadata->>'sessionId') AS total
  FROM events
  WHERE event_name = 'session_completed'
    AND (metadata->>'accuracyPct')::numeric < 100
),
reviews AS (
  SELECT COUNT(DISTINCT metadata->>'sessionId') AS total
  FROM events
  WHERE event_name = 'mistake_review_opened'
)
SELECT
  sessions_with_mistakes.total    AS sessions_with_mistakes,
  reviews.total                   AS reviews_opened,
  ROUND(
    reviews.total::numeric
    / NULLIF(sessions_with_mistakes.total, 0) * 100
  , 1)                            AS review_open_rate_pct
FROM sessions_with_mistakes, reviews;


-- ─── 9. Chapter Practice vs Daily Set — source breakdown ─────────────────────
-- How many sessions come from the daily set vs chapter practice?

SELECT
  COALESCE(metadata->>'source', 'unknown')   AS source,
  COUNT(*)                                   AS session_starts,
  COUNT(DISTINCT user_id)                    AS unique_users
FROM events
WHERE event_name = 'session_started'
   OR event_name = 'chapter_practice_started'
GROUP BY 1
ORDER BY 2 DESC;


-- ─── 10. Weak Chapter Practice — from progress page ──────────────────────────
-- How often do students act on "Focus Areas" recommendations?

SELECT
  DATE(created_at)          AS day,
  COUNT(*)                  AS chapter_sessions_from_weak_chapters,
  COUNT(DISTINCT user_id)   AS unique_users,
  ROUND(AVG((metadata->>'accuracyPct')::numeric), 1) AS avg_chapter_accuracy
FROM events
WHERE event_name = 'chapter_practice_started'
  AND metadata->>'source' = 'weak_chapters'
GROUP BY 1
ORDER BY 1 DESC;


-- ─── 11. Onboarding funnel — subject choices ─────────────────────────────────
-- Which class levels and subject combos are most popular?

SELECT
  metadata->>'classLevel'                  AS class_level,
  (metadata->>'subjectCount')::int         AS subject_count,
  COUNT(*)                                 AS users
FROM events
WHERE event_name = 'onboarding_completed'
GROUP BY 1, 2
ORDER BY 3 DESC;


-- ─── 12. Top users by sessions completed ─────────────────────────────────────
-- Useful to find power users for feedback interviews.

SELECT
  user_id,
  COUNT(*)                                           AS sessions_completed,
  ROUND(AVG((metadata->>'accuracyPct')::numeric), 1) AS avg_accuracy,
  MIN(created_at)::date                              AS first_session,
  MAX(created_at)::date                              AS last_session
FROM events
WHERE event_name = 'session_completed'
GROUP BY user_id
ORDER BY sessions_completed DESC
LIMIT 20;
