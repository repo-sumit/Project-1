-- ══════════════════════════════════════════════════════════════════════════════
-- PrepFire — Complete Database Schema
-- HOW TO USE:
--   1. Open Supabase Dashboard → SQL Editor → New Query
--   2. Paste this entire file → click Run
--   3. Then run seed.sql
-- ══════════════════════════════════════════════════════════════════════════════

-- Enable UUID generation (already enabled on Supabase, safe to repeat)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ─── Drop existing tables (safe re-run) ──────────────────────────────────────
-- Drops in reverse dependency order to avoid FK errors
DROP TABLE IF EXISTS user_progress  CASCADE;
DROP TABLE IF EXISTS streaks        CASCADE;
DROP TABLE IF EXISTS attempts       CASCADE;
DROP TABLE IF EXISTS sessions       CASCADE;
DROP TABLE IF EXISTS daily_sets     CASCADE;
DROP TABLE IF EXISTS questions      CASCADE;
DROP TABLE IF EXISTS chapters       CASCADE;
DROP TABLE IF EXISTS subjects       CASCADE;
DROP TABLE IF EXISTS users          CASCADE;


-- ─── TABLE: users ─────────────────────────────────────────────────────────────
CREATE TABLE users (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT        NOT NULL,
  class_level         SMALLINT    NOT NULL CHECK (class_level IN (9, 10, 11, 12)),
  subject_ids         TEXT[]      NOT NULL DEFAULT '{}',
  onboarding_complete BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE users IS 'One row per app user. id matches the UUID stored in localStorage.';


-- ─── TABLE: subjects ──────────────────────────────────────────────────────────
CREATE TABLE subjects (
  id          TEXT        PRIMARY KEY,   -- e.g. 'science-10'
  name        TEXT        NOT NULL,      -- e.g. 'Science'
  class_level SMALLINT    NOT NULL,
  board       TEXT        NOT NULL DEFAULT 'CBSE',
  color       TEXT,                      -- Tailwind class e.g. 'bg-blue-500'
  icon        TEXT                       -- emoji e.g. '🔬'
);


-- ─── TABLE: chapters ──────────────────────────────────────────────────────────
CREATE TABLE chapters (
  id          TEXT        PRIMARY KEY,   -- human-readable e.g. 'c-m10-01'
  subject_id  TEXT        NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  order_index SMALLINT    NOT NULL DEFAULT 1
);
COMMENT ON COLUMN chapters.order_index IS 'NCERT chapter number for ordering';


-- ─── TABLE: questions ─────────────────────────────────────────────────────────
-- IMPORTANT: correct_option is stored here but NEVER sent to the client in GET
-- responses. It is returned only from POST /api/attempts after the user answers.
CREATE TABLE questions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id      TEXT        REFERENCES chapters(id) ON DELETE SET NULL,
  subject_id      TEXT        NOT NULL REFERENCES subjects(id),
  class_level     SMALLINT    NOT NULL,
  question_text   TEXT        NOT NULL,
  option_a        TEXT        NOT NULL,
  option_b        TEXT        NOT NULL,
  option_c        TEXT        NOT NULL,
  option_d        TEXT        NOT NULL,
  correct_option  CHAR(1)     NOT NULL CHECK (correct_option IN ('A','B','C','D')),
  explanation     TEXT        NOT NULL,   -- 2-4 sentences, school-level language
  year_tag        SMALLINT,               -- CBSE PYQ year (2015–2025)
  difficulty      TEXT        NOT NULL DEFAULT 'medium'
                              CHECK (difficulty IN ('easy','medium','hard')),
  question_type   TEXT        NOT NULL DEFAULT 'mcq',
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON COLUMN questions.correct_option IS 'NEVER expose in client-facing GET APIs';


-- ─── TABLE: daily_sets ────────────────────────────────────────────────────────
CREATE TABLE daily_sets (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  set_date     DATE        NOT NULL,
  question_ids JSONB       NOT NULL DEFAULT '[]',  -- ordered array of question UUIDs
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending','completed')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, set_date)
);


-- ─── TABLE: sessions ──────────────────────────────────────────────────────────
CREATE TABLE sessions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  daily_set_id     UUID        REFERENCES daily_sets(id) ON DELETE SET NULL,
  chapter_id       TEXT        REFERENCES chapters(id)   ON DELETE SET NULL,
  subject_name     TEXT,                    -- denormalized for display
  started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  total_questions  SMALLINT    NOT NULL DEFAULT 10,
  correct_count    SMALLINT    NOT NULL DEFAULT 0,
  xp_earned        SMALLINT    NOT NULL DEFAULT 0
);


-- ─── TABLE: attempts ──────────────────────────────────────────────────────────
CREATE TABLE attempts (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       UUID        REFERENCES sessions(id)  ON DELETE CASCADE,
  user_id          UUID        REFERENCES users(id)     ON DELETE CASCADE,
  question_id      UUID        NOT NULL REFERENCES questions(id),
  selected_option  CHAR(1)     NOT NULL CHECK (selected_option IN ('A','B','C','D')),
  is_correct       BOOLEAN     NOT NULL,
  answered_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── TABLE: streaks ───────────────────────────────────────────────────────────
CREATE TABLE streaks (
  user_id              UUID     PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak       SMALLINT NOT NULL DEFAULT 0,
  longest_streak       SMALLINT NOT NULL DEFAULT 0,
  last_completed_date  DATE
);


-- ─── TABLE: user_progress ─────────────────────────────────────────────────────
-- Subject-level aggregates. Updated after each completed session.
CREATE TABLE user_progress (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id           TEXT        NOT NULL REFERENCES subjects(id),
  questions_attempted  INTEGER     NOT NULL DEFAULT 0,
  questions_correct    INTEGER     NOT NULL DEFAULT 0,
  accuracy_pct         NUMERIC(5,2) NOT NULL DEFAULT 0,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, subject_id)
);


-- ══════════════════════════════════════════════════════════════════════════════
-- INDEXES — fast lookups on common query patterns
-- ══════════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_questions_subject_class  ON questions(subject_id, class_level);
CREATE INDEX idx_questions_chapter_id     ON questions(chapter_id);
CREATE INDEX idx_questions_is_active      ON questions(is_active);
CREATE INDEX idx_attempts_session_id      ON attempts(session_id);
CREATE INDEX idx_attempts_user_id         ON attempts(user_id);
CREATE INDEX idx_attempts_question_id     ON attempts(question_id);
CREATE INDEX idx_sessions_user_id         ON sessions(user_id);
CREATE INDEX idx_sessions_completed_at    ON sessions(completed_at);
CREATE INDEX idx_daily_sets_user_date     ON daily_sets(user_id, set_date);
CREATE INDEX idx_user_progress_user       ON user_progress(user_id);
CREATE INDEX idx_chapters_subject_id      ON chapters(subject_id);


-- ══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- V1: Disabled — API routes use the service-role key which bypasses RLS anyway.
-- V2: Enable RLS + JWT policies when phone OTP auth is added.
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE users           DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects        DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapters        DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions       DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_sets      DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions        DISABLE ROW LEVEL SECURITY;
ALTER TABLE attempts        DISABLE ROW LEVEL SECURITY;
ALTER TABLE streaks         DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress   DISABLE ROW LEVEL SECURITY;


-- ══════════════════════════════════════════════════════════════════════════════
-- VERIFY (run after schema.sql to check tables exist)
-- ══════════════════════════════════════════════════════════════════════════════
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;
