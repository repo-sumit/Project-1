# PrepFire — CBSE Daily Practice App

> Mobile-first exam prep. 10 PYQ questions. 8 minutes. Every day.

---

## Quick Start (Day 0 Setup — ~30 minutes)

### Step 1: Install dependencies
```bash
npm install
```

### Step 2: Set up Supabase
1. Go to [supabase.com](https://supabase.com) and create a free project
2. Go to **SQL Editor** → paste and run `supabase/schema.sql`
3. Then paste and run `supabase/seed.sql`
4. Go to **Settings → API** → copy your Project URL and anon key

### Step 3: Configure environment
```bash
cp .env.local.example .env.local
# Open .env.local and fill in your Supabase values
```

### Step 4: Run the app
```bash
npm run dev
# Open http://localhost:3000
```

> **No Supabase yet?** The app runs in **Demo Mode** automatically using hardcoded mock questions. You can test the full UI flow without any database.

---

## What's Built (V1 Scope)

| Feature | Status |
|---|---|
| Onboarding (class → subjects → name) | ✅ |
| Home screen with Daily Set card | ✅ |
| Streak display | ✅ |
| Practice session (10 questions) | ✅ |
| Instant feedback + explanation panel | ✅ |
| Result screen (score, XP, streak) | ✅ |
| Progress page (subject stats, history) | ✅ |
| Profile page | ✅ |
| Demo mode (no DB needed) | ✅ |
| Supabase integration | ✅ |
| Mobile-responsive layout | ✅ |

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS |
| State | Zustand |
| Hosting | Vercel |

---

## Deploy to Vercel

```bash
# One-time setup
npm install -g vercel
vercel login

# Deploy
vercel

# Add env vars in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
```

---

## Folder Structure

```
app/
  (auth)/onboarding/     ← Onboarding flow (3 steps)
  (app)/home/            ← Daily Set + streak
  (app)/practice/        ← Session + result
  (app)/progress/        ← Stats
  (app)/profile/         ← User settings
  api/                   ← Server-side API routes
components/
  ui/                    ← Buttons, nav, progress bar
  home/                  ← DailySetCard, StreakCard
  practice/              ← QuestionCard, OptionButton, ExplanationPanel
  progress/              ← SubjectProgress, SessionHistory
store/                   ← Zustand (userStore, sessionStore)
lib/                     ← Supabase clients, cache helpers, XP logic
types/                   ← TypeScript interfaces
supabase/                ← SQL schema + seed data
```

---

## Adding Real Questions

Edit `supabase/seed.sql` following the format:
```sql
INSERT INTO questions (subject_id, chapter_id, class_level, question_text,
  option_a, option_b, option_c, option_d,
  correct_option, explanation, year_tag, difficulty)
VALUES (
  'science-10', 'c-sci10-01', 10,
  'Your question text here?',
  'Option A', 'Option B', 'Option C', 'Option D',
  'B',  -- correct answer
  'Explanation: why B is correct. NCERT Class 10 Ch. X.',
  2023, 'medium'
);
```

**Explanation writing rules:**
- Max 3 sentences
- Explain WHY the answer is correct
- Mention NCERT chapter reference
- Plain school-level language

---

## V2 Roadmap (Post-MVP)

- [ ] Phone OTP auth (Supabase Auth)
- [ ] Chapter browser
- [ ] Leaderboard
- [ ] Parent report (WhatsApp share)
- [ ] 30-day exam plan
- [ ] Weak topic engine
- [ ] PWA offline support
- [ ] Hindi explanations
