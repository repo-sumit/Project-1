-- ─────────────────────────────────────────────────────────────────────────────
-- PrepFire — Supabase SQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ─── TABLE: users ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  class_level           SMALLINT NOT NULL CHECK (class_level IN (9, 10, 11, 12)),
  subject_ids           TEXT[] NOT NULL DEFAULT '{}',
  onboarding_complete   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TABLE: subjects ──────────────────────────────────────────────────────────
-- This table is mostly reference data — kept in sync with lib/constants.ts
CREATE TABLE IF NOT EXISTS subjects (
  id          TEXT PRIMARY KEY,   -- e.g. 'science-10'
  name        TEXT NOT NULL,
  class_level SMALLINT NOT NULL,
  board       TEXT NOT NULL DEFAULT 'CBSE',
  color       TEXT,
  icon        TEXT
);

-- ─── TABLE: chapters ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chapters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id    TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  order_index   SMALLINT NOT NULL DEFAULT 1
);

-- ─── TABLE: questions ─────────────────────────────────────────────────────────
-- correct_option is stored here and NEVER sent to the client directly.
-- It is only returned from the /api/attempts endpoint AFTER the user answers.
CREATE TABLE IF NOT EXISTS questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id      UUID REFERENCES chapters(id) ON DELETE SET NULL,
  subject_id      TEXT NOT NULL REFERENCES subjects(id),
  class_level     SMALLINT NOT NULL,
  question_text   TEXT NOT NULL,
  option_a        TEXT NOT NULL,
  option_b        TEXT NOT NULL,
  option_c        TEXT NOT NULL,
  option_d        TEXT NOT NULL,
  correct_option  CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation     TEXT NOT NULL,
  year_tag        SMALLINT,        -- PYQ year (2015-2025)
  difficulty      TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_type   TEXT NOT NULL DEFAULT 'mcq',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TABLE: daily_sets ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_sets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  set_date      DATE NOT NULL,
  question_ids  JSONB NOT NULL DEFAULT '[]',  -- ordered array of question UUIDs
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, set_date)
);

-- ─── TABLE: sessions ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  daily_set_id      UUID REFERENCES daily_sets(id) ON DELETE SET NULL,
  subject_name      TEXT,             -- denormalized display name
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  total_questions   SMALLINT NOT NULL DEFAULT 10,
  correct_count     SMALLINT NOT NULL DEFAULT 0,
  xp_earned         SMALLINT NOT NULL DEFAULT 0
);

-- ─── TABLE: attempts ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attempts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id      UUID NOT NULL REFERENCES questions(id),
  selected_option  CHAR(1) NOT NULL CHECK (selected_option IN ('A', 'B', 'C', 'D')),
  is_correct       BOOLEAN NOT NULL,
  answered_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TABLE: streaks ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS streaks (
  user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak       SMALLINT NOT NULL DEFAULT 0,
  longest_streak       SMALLINT NOT NULL DEFAULT 0,
  last_completed_date  DATE
);

-- ─── TABLE: user_progress ─────────────────────────────────────────────────────
-- Subject-level progress aggregates. Updated after each session.
CREATE TABLE IF NOT EXISTS user_progress (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id           TEXT NOT NULL REFERENCES subjects(id),
  questions_attempted  INTEGER NOT NULL DEFAULT 0,
  questions_correct    INTEGER NOT NULL DEFAULT 0,
  accuracy_pct         NUMERIC(5,2) NOT NULL DEFAULT 0,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, subject_id)
);


-- ─────────────────────────────────────────────────────────────────────────────
-- INDEXES — for fast lookups on the most common queries
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_questions_subject_class ON questions(subject_id, class_level);
CREATE INDEX IF NOT EXISTS idx_questions_is_active     ON questions(is_active);
CREATE INDEX IF NOT EXISTS idx_attempts_session_id     ON attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_id        ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id        ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_sets_user_date    ON daily_sets(user_id, set_date);
CREATE INDEX IF NOT EXISTS idx_user_progress_user      ON user_progress(user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Since V1 has no JWT auth, we use the service role key from API routes.
-- RLS is disabled — API routes are the security boundary.
-- Enable RLS + policies when Supabase Auth is added in V2.
-- ─────────────────────────────────────────────────────────────────────────────

-- Disable RLS for V1 (service role key bypasses it anyway)
ALTER TABLE users          DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects       DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapters       DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions      DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_sets     DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions       DISABLE ROW LEVEL SECURITY;
ALTER TABLE attempts       DISABLE ROW LEVEL SECURITY;
ALTER TABLE streaks        DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress  DISABLE ROW LEVEL SECURITY;
