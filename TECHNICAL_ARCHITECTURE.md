# Technical Architecture — CBSE Exam Prep App (MVP)

**Version:** v0.1
**Stack:** Next.js (App Router) + Supabase + Vercel
**Target:** Mobile-first, Android-first, works on slow 4G
**Beginner-friendly:** Yes — no complex DevOps, no microservices, no over-engineering

---

## 1. Tech Stack

### The Rule: One tool per job. No alternatives. No "it depends."

| Layer | Tool | Why |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | You already chose it. Server components = faster first load. |
| **Hosting** | Vercel | Zero-config deploys. Free tier is generous. Works perfectly with Next.js. |
| **Database** | Supabase (PostgreSQL) | Free tier, built-in auth, real-time, REST API auto-generated. No backend code needed for basic CRUD. |
| **Auth** | Supabase Auth (Phone OTP) | Phone + OTP is the Indian standard. Built-in. Zero setup. |
| **File Storage** | Supabase Storage | For future question images. Not needed on Day 1. |
| **State Management** | Zustand | Tiny (1KB), simple, beginner-friendly. Replaces Redux entirely. |
| **Styling** | Tailwind CSS | Fast to write, mobile-first by default, no CSS files to manage. |
| **Local Cache** | localStorage + IndexedDB (via idb-keyval) | Cache daily questions for offline use. |
| **Push Notifications** | Vercel Edge Functions + Web Push API | Simple daily reminder. No Firebase needed for MVP. |
| **Analytics** | PostHog (free tier) | Track retention, session length, completion rates. Self-hostable later. |

### What you do NOT need (avoid these):
- ❌ Redis (use Supabase + localStorage instead)
- ❌ GraphQL (REST is enough for MVP)
- ❌ Docker (Vercel handles deployment)
- ❌ Prisma ORM (Supabase client handles queries)
- ❌ React Query for MVP (Zustand + fetch is enough)
- ❌ Firebase (Supabase does everything Firebase does, with a real SQL database)

---

## 2. Folder Structure

```
cbse-prep-app/
│
├── app/                          ← All pages (Next.js App Router)
│   ├── layout.tsx                ← Root layout (fonts, providers, nav)
│   ├── page.tsx                  ← Root redirect → /home or /onboarding
│   │
│   ├── (auth)/                   ← Auth route group (no nav bar)
│   │   ├── onboarding/
│   │   │   └── page.tsx          ← Onboarding flow
│   │   └── login/
│   │       └── page.tsx          ← Phone + OTP login
│   │
│   ├── (app)/                    ← Main app route group (with nav bar)
│   │   ├── layout.tsx            ← App shell with bottom navigation
│   │   ├── home/
│   │   │   └── page.tsx          ← Home screen (daily set entry point)
│   │   ├── practice/
│   │   │   ├── page.tsx          ← Chapter selection screen
│   │   │   ├── [chapterId]/
│   │   │   │   └── page.tsx      ← Chapter detail + start practice
│   │   │   └── session/
│   │   │       └── page.tsx      ← Active question flow (client component)
│   │   ├── results/
│   │   │   └── page.tsx          ← Session results screen
│   │   ├── progress/
│   │   │   └── page.tsx          ← Progress dashboard
│   │   ├── leaderboard/
│   │   │   └── page.tsx          ← Weekly leaderboard
│   │   └── profile/
│   │       └── page.tsx          ← Profile + settings
│   │
│   └── api/                      ← API Routes (server-side logic only)
│       ├── daily-set/
│       │   └── route.ts          ← GET: generate today's question set
│       ├── attempts/
│       │   └── route.ts          ← POST: save a question attempt
│       ├── streak/
│       │   └── route.ts          ← POST: update streak after session
│       └── report/
│           └── route.ts          ← GET: generate parent report data
│
├── components/                   ← Reusable UI components
│   ├── ui/                       ← Pure UI, no business logic
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Badge.tsx
│   │   ├── StreakFlame.tsx
│   │   └── BottomNav.tsx
│   │
│   ├── practice/                 ← Practice flow components
│   │   ├── QuestionCard.tsx      ← Single question display
│   │   ├── OptionButton.tsx      ← Answer option (tap to select)
│   │   ├── ExplanationPanel.tsx  ← Explanation after answering
│   │   ├── ProgressDots.tsx      ← Q1 of 10 indicator
│   │   └── SessionSummary.tsx    ← End of session results
│   │
│   ├── home/
│   │   ├── DailySetCard.tsx      ← "Today's Set" entry card
│   │   ├── StreakCard.tsx        ← Streak display
│   │   └── SubjectChips.tsx      ← Quick subject filter
│   │
│   └── progress/
│       ├── AccuracyChart.tsx     ← 7-day accuracy trend
│       ├── ChapterList.tsx       ← Chapter completion list
│       └── XPBar.tsx             ← XP + level display
│
├── hooks/                        ← Custom React hooks
│   ├── useSession.ts             ← Active practice session state
│   ├── useStreak.ts              ← Streak data + update logic
│   ├── useDailySet.ts            ← Fetch + cache daily questions
│   ├── useProgress.ts            ← Chapter/subject progress
│   └── useUser.ts                ← Current user profile
│
├── store/                        ← Zustand state stores
│   ├── sessionStore.ts           ← Active session (questions, answers, index)
│   ├── userStore.ts              ← User profile + auth state
│   └── practiceStore.ts          ← Chapter browsing state
│
├── lib/                          ← Utilities and configurations
│   ├── supabase.ts               ← Supabase client (browser)
│   ├── supabase-server.ts        ← Supabase client (server components)
│   ├── cache.ts                  ← localStorage/IndexedDB helpers
│   ├── dailySet.ts               ← Daily set selection algorithm
│   ├── xp.ts                     ← XP calculation logic
│   └── constants.ts              ← App-wide constants (subjects, grades)
│
├── types/                        ← TypeScript type definitions
│   └── index.ts                  ← All shared types (User, Question, etc.)
│
├── public/                       ← Static assets
│   ├── icons/                    ← App icons (PWA)
│   └── manifest.json             ← PWA manifest
│
├── middleware.ts                 ← Auth guard (redirect if not logged in)
├── next.config.js                ← Next.js config (PWA, image optimization)
├── tailwind.config.js
└── .env.local                    ← Supabase URL + anon key
```

---

## 3. Data Model (Supabase / PostgreSQL)

### Table 1: `users`
```sql
users (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone           text UNIQUE NOT NULL,       -- +91XXXXXXXXXX
  name            text,                        -- Optional
  grade           smallint NOT NULL,           -- 9, 10, 11, 12
  stream          text,                        -- 'science' | 'commerce' | 'arts' | null (for 9-10)
  subjects        text[],                      -- ['physics', 'chemistry', 'maths']
  created_at      timestamptz DEFAULT now(),
  last_active_at  timestamptz DEFAULT now()
)
```

### Table 2: `subjects`
```sql
subjects (
  id          text PRIMARY KEY,               -- 'physics', 'chemistry', 'maths', 'science'
  name        text NOT NULL,                  -- 'Physics'
  grade       smallint NOT NULL,              -- 12
  color       text NOT NULL,                  -- '#3B82F6' (for UI)
  icon        text NOT NULL,                  -- emoji or icon name
  total_questions integer DEFAULT 0          -- denormalized count
)
```

### Table 3: `chapters`
```sql
chapters (
  id              text PRIMARY KEY,           -- 'physics-12-ch1'
  subject_id      text REFERENCES subjects,
  name            text NOT NULL,              -- 'Electric Charges and Fields'
  chapter_number  smallint NOT NULL,          -- 1
  total_questions integer DEFAULT 0,          -- denormalized
  difficulty_avg  numeric(3,2)                -- average difficulty 1-3
)
```

### Table 4: `questions`
```sql
questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id      text REFERENCES chapters,
  subject_id      text REFERENCES subjects,
  grade           smallint NOT NULL,
  text            text NOT NULL,              -- Question text
  option_a        text NOT NULL,
  option_b        text NOT NULL,
  option_c        text NOT NULL,
  option_d        text NOT NULL,
  correct_option  char(1) NOT NULL,           -- 'a' | 'b' | 'c' | 'd'
  explanation     text NOT NULL,              -- 2-5 line explanation
  ncert_ref       text,                       -- 'Class 10 Science Ch.1 Sec.1.3'
  difficulty      smallint DEFAULT 2,         -- 1=easy, 2=medium, 3=hard
  year            smallint,                   -- PYQ year (2023, 2022, etc.)
  question_type   text DEFAULT 'mcq',         -- 'mcq' | 'assertion' | 'case-based'
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
)
```

### Table 5: `attempts`
```sql
attempts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES users NOT NULL,
  question_id     uuid REFERENCES questions NOT NULL,
  session_id      uuid NOT NULL,              -- groups a session's attempts
  selected_option char(1) NOT NULL,           -- 'a' | 'b' | 'c' | 'd'
  is_correct      boolean NOT NULL,
  time_taken_ms   integer,                    -- milliseconds to answer
  xp_earned       smallint DEFAULT 0,
  attempted_at    timestamptz DEFAULT now()
)
```

### Table 6: `sessions`
```sql
sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES users NOT NULL,
  session_type    text NOT NULL,              -- 'daily' | 'chapter' | 'plan'
  subject_id      text,
  chapter_id      text,
  total_questions smallint NOT NULL,
  correct_count   smallint DEFAULT 0,
  xp_earned       smallint DEFAULT 0,
  completed       boolean DEFAULT false,
  started_at      timestamptz DEFAULT now(),
  completed_at    timestamptz
)
```

### Table 7: `streaks`
```sql
streaks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES users UNIQUE NOT NULL,
  current_streak  smallint DEFAULT 0,
  longest_streak  smallint DEFAULT 0,
  last_practice_date date,
  freeze_count    smallint DEFAULT 1,         -- streak freeze available
  updated_at      timestamptz DEFAULT now()
)
```

### Table 8: `user_progress` (per chapter)
```sql
user_progress (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid REFERENCES users NOT NULL,
  chapter_id          text REFERENCES chapters NOT NULL,
  questions_attempted integer DEFAULT 0,
  questions_correct   integer DEFAULT 0,
  last_attempted_at   timestamptz,
  UNIQUE(user_id, chapter_id)
)
```

### Table 9: `daily_sets` (cached daily sets)
```sql
daily_sets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES users NOT NULL,
  set_date        date NOT NULL,
  question_ids    uuid[] NOT NULL,            -- ordered array of 10-15 question IDs
  is_completed    boolean DEFAULT false,
  completed_at    timestamptz,
  UNIQUE(user_id, set_date)
)
```

### Indexes to add:
```sql
CREATE INDEX idx_attempts_user_id ON attempts(user_id);
CREATE INDEX idx_attempts_session_id ON attempts(session_id);
CREATE INDEX idx_questions_chapter_id ON questions(chapter_id);
CREATE INDEX idx_questions_subject_grade ON questions(subject_id, grade);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_daily_sets_user_date ON daily_sets(user_id, set_date);
```

---

## 4. API Design

### Minimal API — Only what the MVP actually needs

#### `GET /api/daily-set`
**Purpose:** Get (or generate) today's daily set for the current user
**Auth:** Required
**Response:**
```json
{
  "setId": "uuid",
  "date": "2026-03-27",
  "isCompleted": false,
  "questions": [
    {
      "id": "uuid",
      "text": "Which of the following...",
      "options": { "a": "...", "b": "...", "c": "...", "d": "..." },
      "chapterId": "physics-12-ch1",
      "subjectId": "physics",
      "difficulty": 2
    }
    // ...10-15 total, NO correct_option sent to client
  ]
}
```
**Logic:** Check if daily_set exists for today → if yes, return it → if no, generate one (see Section 5)

---

#### `POST /api/attempts`
**Purpose:** Record a single question attempt
**Auth:** Required
**Body:**
```json
{
  "sessionId": "uuid",
  "questionId": "uuid",
  "selectedOption": "b",
  "timeTakenMs": 8200
}
```
**Response:**
```json
{
  "isCorrect": true,
  "correctOption": "b",
  "explanation": "Electric field lines originate from...",
  "ncertRef": "Class 12 Physics Ch.1 Sec.1.4",
  "xpEarned": 10
}
```
**Key detail:** `correct_option` is ONLY returned AFTER an attempt is submitted. Never sent with questions.

---

#### `POST /api/sessions`
**Purpose:** Create a new session (before starting practice)
**Body:**
```json
{
  "sessionType": "daily",
  "chapterId": null,
  "totalQuestions": 10
}
```
**Response:** `{ "sessionId": "uuid" }`

---

#### `PATCH /api/sessions/:id`
**Purpose:** Mark a session as complete
**Body:** `{ "correctCount": 8, "xpEarned": 95 }`
**Side effects:** Triggers streak update on server

---

#### `POST /api/streak`
**Purpose:** Update streak after completing daily set
**Auth:** Required
**Body:** `{ "sessionId": "uuid" }` (server validates it was a daily set)
**Response:**
```json
{
  "currentStreak": 6,
  "longestStreak": 12,
  "streakIncreased": true,
  "freezeUsed": false
}
```

---

#### `GET /api/progress`
**Purpose:** Get user's chapter-level progress
**Auth:** Required
**Query:** `?subjectId=physics`
**Response:**
```json
{
  "subject": "physics",
  "chapters": [
    {
      "chapterId": "physics-12-ch1",
      "name": "Electric Charges and Fields",
      "totalQuestions": 45,
      "attempted": 20,
      "correct": 15,
      "accuracyPct": 75,
      "completionPct": 44
    }
  ]
}
```

---

#### `GET /api/leaderboard`
**Purpose:** Get user's league leaderboard
**Auth:** Required
**Response:**
```json
{
  "userLeague": "silver",
  "userRank": 12,
  "userXp": 840,
  "weekStart": "2026-03-23",
  "entries": [
    { "rank": 1, "name": "Riya S.", "xp": 1240, "isCurrentUser": false },
    { "rank": 12, "name": "You", "xp": 840, "isCurrentUser": true }
  ],
  "promotionZone": 5,
  "relegationZone": 45
}
```

---

#### `GET /api/report`
**Purpose:** Generate parent report data
**Auth:** Required
**Query:** `?days=7`
**Response:**
```json
{
  "studentName": "Arjun",
  "periodDays": 7,
  "questionsAttempted": 87,
  "correctAnswers": 63,
  "accuracyPct": 72,
  "previousAccuracyPct": 65,
  "streakDays": 6,
  "subjectsSummary": [...],
  "chaptersCompleted": 3,
  "chaptersRevised": 2
}
```

---

## 5. Daily Set Logic (Core Algorithm)

### MVP Algorithm — Simple, deterministic, expandable later

```
FUNCTION generateDailySet(userId, date):

  1. LOAD user profile (grade, subjects, stream)

  2. LOAD user_progress (all chapters user has attempted)

  3. DISTRIBUTE 10-12 questions across subjects:
     - If user has 3 subjects → ~3-4 questions per subject
     - Always include at least 1 subject the user is weakest in

  4. FOR EACH subject slot, pick questions using this priority:
     Priority 1 (40%): Chapters user has NEVER attempted
                       → Introduces new coverage
     Priority 2 (40%): Chapters user attempted but has <70% accuracy
                       → Reinforces weak areas
     Priority 3 (20%): Chapters user has >70% accuracy
                       → Spaced revision

  5. WITHIN each priority bucket, pick questions:
     → That user has NEVER seen before (check attempts table)
     → Difficulty: 60% medium, 25% easy, 15% hard
     → Randomise order (shuffle the final array)

  6. SAVE to daily_sets table with today's date

  7. RETURN question IDs (without answers)
```

### MVP Simplification:
- **Day 1-7:** The selection can be fully random within the user's subjects (no weak-area logic yet). Just avoid repeating seen questions.
- **Day 8+:** Add the priority weighting above using `user_progress` data.
- **What to hardcode:** The question count (10 for weekdays, 12 for weekends). The difficulty ratio (60/25/15).

### Future improvements (post-MVP):
- Weight by time since last seen (spaced repetition)
- Include questions from upcoming school chapters (if student sets pace)
- AI-based weak topic detection from wrong answer patterns

---

## 6. State Management Strategy

### Rule: Server = source of truth. Local = speed layer.

| Data | Where to Store | Why |
|---|---|---|
| User profile (name, grade) | Zustand + localStorage | Needed on every screen, rarely changes |
| Active session questions | Zustand sessionStore | Changes fast, needs instant updates, NOT persisted |
| Current question index | Zustand sessionStore | Same as above |
| User's selected answer | Zustand sessionStore | Temporary UI state |
| Daily set questions | Zustand + localStorage | Cache for offline, cleared daily |
| Streak count | Zustand + server | Show immediately from cache, sync after session |
| Progress data | Server (fetched on demand) | Not needed offline, can be stale by 5 minutes |
| Leaderboard | Server (fetched on demand) | Real-time isn't needed for MVP |

### Zustand sessionStore structure:
```typescript
interface SessionStore {
  sessionId: string | null
  questions: Question[]         // Full question objects (with options, no answer)
  currentIndex: number          // 0-based
  answers: Record<string, {     // keyed by questionId
    selected: string
    isCorrect: boolean
    explanation: string
    xpEarned: number
  }>
  isComplete: boolean

  // Actions
  startSession: (questions: Question[], sessionId: string) => void
  submitAnswer: (questionId: string, option: string) => Promise<void>
  nextQuestion: () => void
  completeSession: () => void
  resetSession: () => void
}
```

---

## 7. Caching Strategy

### Goal: App works with no internet after first load

#### Layer 1 — Next.js Static Generation
- All question data pages (chapter lists, subject pages) → `generateStaticParams`
- Revalidate every 24 hours: `export const revalidate = 86400`
- Home page layout is static, only user-specific data is dynamic

#### Layer 2 — Daily Set Pre-caching
```typescript
// In useDailySet.ts
// When user opens app in the morning with internet:
// → Fetch today's daily set from API
// → Save to localStorage with today's date as key
// → When user does practice later (possibly offline):
//   → Serve from localStorage

const CACHE_KEY = `daily_set_${userId}_${todayDate}`
localStorage.setItem(CACHE_KEY, JSON.stringify(questionsArray))
```

#### Layer 3 — Offline Attempt Queue
```typescript
// In lib/cache.ts
// If user submits answer while offline:
// → Save attempt to IndexedDB queue
// → When back online → flush queue to /api/attempts
// → Use navigator.onLine + window 'online' event to detect reconnection

interface QueuedAttempt {
  questionId: string
  sessionId: string
  selectedOption: string
  timeTakenMs: number
  timestamp: number
}
```

#### Layer 4 — Service Worker (PWA)
```javascript
// In next.config.js — use next-pwa package
// Cache strategy:
// → App shell (HTML, CSS, JS): Cache First
// → API calls: Network First with 5-second timeout → fallback to cache
// → Images: Cache First with 30-day expiry
```

#### What this means for a student on 2G:
1. Opens app → served from service worker cache (< 1 second)
2. Daily set loads from localStorage (instant, no network)
3. Submits answers → saved to IndexedDB queue
4. When 4G returns → queue syncs automatically
5. Student doesn't notice the connectivity gap

---

## 8. Performance Strategy

### Target: < 3 second TTI on Redmi 9A (budget Android, 2GB RAM, 4G)

#### Do these:
1. **No large libraries.** Total JS bundle < 150KB gzipped. Check with `next build --analyze`
2. **Tailwind purging** — only ships CSS classes actually used. ~5KB of CSS.
3. **Dynamic imports** for heavy screens. The leaderboard chart only loads when user visits it:
   ```typescript
   const AccuracyChart = dynamic(() => import('@/components/progress/AccuracyChart'), {
     loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-xl" />
   })
   ```
4. **No heavy chart library.** Draw accuracy bars with pure CSS/Tailwind for MVP. Add chart.js only if needed.
5. **Image optimisation.** Use `next/image` for all images. Use SVG for icons.
6. **Fonts.** Load one font max (Inter via `next/font`). No Google Fonts CDN calls.
7. **No animations on mount.** Animate ONLY post-interaction (after user taps answer). Never block render with animation.
8. **Prefetch next question.** After user sees question N's explanation, prefetch question N+1's data.

#### Avoid these:
- ❌ Moment.js (use `date-fns` or built-in `Intl`)
- ❌ Lodash full bundle (use individual imports: `import debounce from 'lodash/debounce'`)
- ❌ MUI or Ant Design (massive bundles — use Tailwind + shadcn/ui components only)
- ❌ Framer Motion for MVP (nice but heavy — use CSS transitions)
- ❌ Any library that adds > 20KB to bundle without a strong reason

#### Performance budget:
| Metric | Target |
|---|---|
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.0s |
| Total JS Bundle (gzipped) | < 150KB |
| Total CSS (gzipped) | < 10KB |
| API response (daily set) | < 500ms |

---

## 9. MVP Simplifications

### What to hardcode initially (Week 1-2):

| Thing | MVP Approach | How to improve later |
|---|---|---|
| Daily set size | Always 10 questions | Dynamic based on streak length |
| Daily set algorithm | Fully random within user's subjects | Add weak-topic weighting in Week 3 |
| League assignment | Hardcode everyone in "Bronze" league | Implement promotion/relegation after 100 users |
| XP values | +10 for correct, +3 for attempted | Fine-tune based on engagement data |
| Question difficulty | All questions tagged manually | Add adaptive difficulty tracking |
| Explanations | Fetch from database | Add "was this helpful?" rating later |
| Streak freeze | Always show 1 freeze available | Track actual freeze usage |

### What to mock/fake for demo:

| Thing | Mock approach |
|---|---|
| Leaderboard | Seed 20 fake users with random XP scores |
| "X students practised today" | Hardcode a realistic number (e.g., 1,200) |
| Push notifications | Use browser Notification API (no server needed) |
| Parent report image | Generate a styled HTML page + print-to-PDF |

### What can wait until after launch:
- Real-time leaderboard updates (poll every 5 minutes is fine)
- Email/SMS notifications (push notification is enough)
- In-app question error reporting (use a WhatsApp link as shortcut)
- Advanced analytics (PostHog basic tracking is enough)

---

## 10. Day-by-Day Build Plan

### Phase 0 — Setup (Day 0, ~2 hours)
- [ ] `npx create-next-app@latest cbse-prep --typescript --tailwind --app`
- [ ] Create Supabase project at supabase.com (free tier)
- [ ] Add `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deploy empty app to Vercel (connect GitHub → auto-deploy)
- [ ] Run the SQL schemas from Section 3 in Supabase SQL editor
- [ ] Seed 50 sample questions manually (or via CSV import)

---

### Day 1 — Authentication + Onboarding
**Goal: User can sign in with phone OTP and complete onboarding**

- [ ] Install `@supabase/supabase-js` and `@supabase/ssr`
- [ ] Create `lib/supabase.ts` (browser client)
- [ ] Build `app/(auth)/login/page.tsx` — Phone number input → OTP input
- [ ] Connect to Supabase Auth (phone OTP)
- [ ] Build `app/(auth)/onboarding/page.tsx` — Grade select → Stream select → Subjects select
- [ ] Save user profile to `users` table on onboarding complete
- [ ] Build `middleware.ts` — redirect unauthenticated users to /login
- [ ] **Test:** Full sign-up flow on mobile browser

**Deliverable:** User can sign up, complete onboarding, and get redirected to home.

---

### Day 2 — Home Screen + Daily Set Display
**Goal: User sees home screen with today's daily set ready**

- [ ] Build `app/(app)/layout.tsx` — App shell with bottom nav (4 tabs)
- [ ] Build `components/ui/BottomNav.tsx` — Home, Practice, Progress, Profile
- [ ] Build `app/api/daily-set/route.ts` — Generate and return today's set
- [ ] Build `hooks/useDailySet.ts` — Fetch + cache to localStorage
- [ ] Build `app/(app)/home/page.tsx` — Daily set card, streak display, subject chips
- [ ] Build `components/home/DailySetCard.tsx` — Shows "10 Questions • ~8 min • Keep your streak!"
- [ ] Build `components/home/StreakCard.tsx` — Flame emoji + streak count
- [ ] **Test:** Home screen loads in < 2 seconds, daily set shows correctly

**Deliverable:** User sees personalised home screen with today's set.

---

### Day 3 — Question Flow (Most Important Day)
**Goal: User can complete a full practice session**

- [ ] Build `store/sessionStore.ts` — Zustand store for active session
- [ ] Build `app/(app)/practice/session/page.tsx` — Question flow shell
- [ ] Build `components/practice/QuestionCard.tsx` — Question text + 4 options
- [ ] Build `components/practice/OptionButton.tsx` — Tap → locked → correct/wrong animation
- [ ] Build `app/api/attempts/route.ts` — Record attempt, return correct answer + explanation
- [ ] Build `components/practice/ExplanationPanel.tsx` — Slides up after answer
- [ ] Build `components/practice/ProgressDots.tsx` — Q3 of 10 indicator
- [ ] Add "Next Question" button flow
- [ ] **Test:** Complete a full 10-question session on mobile, check all states

**Deliverable:** User can do a full session — see question, tap answer, see explanation, proceed.

---

### Day 4 — Results Screen + Streak System
**Goal: User sees results and streak updates after completing session**

- [ ] Build `app/(app)/results/page.tsx` — Score, accuracy, XP earned, streak status
- [ ] Build `components/practice/SessionSummary.tsx` — Big score number, accuracy comparison
- [ ] Build `app/api/sessions/route.ts` — Create session + mark complete
- [ ] Build `app/api/streak/route.ts` — Update streak after daily set completion
- [ ] Build `hooks/useStreak.ts` — Fetch streak, update locally on session complete
- [ ] Add "Go Home" and "Practice More" CTAs on results
- [ ] Add streak flame animation on increment (CSS only)
- [ ] **Test:** Complete daily set → see result → streak increments → return to home shows updated streak

**Deliverable:** Full habit loop working: practice → result → streak reward → home.

---

### Day 5 — Chapter Practice + Progress
**Goal: User can browse and practice specific chapters**

- [ ] Build `app/(app)/practice/page.tsx` — Subject list → Chapter list
- [ ] Build `app/(app)/practice/[chapterId]/page.tsx` — Chapter detail + "Start Practice"
- [ ] Build `app/api/progress/route.ts` — Return user progress per chapter
- [ ] Build `app/(app)/progress/page.tsx` — Progress dashboard
- [ ] Build `components/progress/ChapterList.tsx` — Chapter completion bars
- [ ] Build `hooks/useProgress.ts` — Fetch progress data
- [ ] Update `user_progress` table after each session
- [ ] **Test:** Browse to a chapter, start a practice session, finish it, see progress update

**Deliverable:** Chapter-wise practice working. Progress screen shows real data.

---

### Day 6 — Leaderboard + Profile
**Goal: User can see their rank and manage their profile**

- [ ] Seed fake leaderboard users in Supabase
- [ ] Build `app/api/leaderboard/route.ts` — Return league standings
- [ ] Build `app/(app)/leaderboard/page.tsx` — League display with user's position highlighted
- [ ] Build `components/progress/XPBar.tsx` — XP progress toward next league
- [ ] Build `app/(app)/profile/page.tsx` — Name, grade, streak, total questions, settings
- [ ] Build `app/api/report/route.ts` — Generate parent report JSON
- [ ] Add "Share with Parent" button → formatted WhatsApp message
- [ ] **Test:** Leaderboard shows, user rank is visible, share button generates correct message

**Deliverable:** Leaderboard, profile, and parent report sharing working.

---

### Day 7 — Polish, PWA, and Deploy
**Goal: App feels fast, works offline, and is live on a real URL**

- [ ] Install `next-pwa` and configure service worker
- [ ] Add `public/manifest.json` for PWA install prompt
- [ ] Implement offline attempt queue (IndexedDB)
- [ ] Add loading skeletons for slow connections (Tailwind `animate-pulse`)
- [ ] Add empty states for all screens (no data, no streak yet, etc.)
- [ ] Add basic error boundaries
- [ ] Test entire flow on a real Android device (Chrome)
- [ ] Run Lighthouse audit → fix anything below 80
- [ ] Push to GitHub → auto-deploys to Vercel
- [ ] Share URL with 5 test users for real device feedback

**Deliverable:** Live, installable PWA on a Vercel URL. Working offline. Ready for first real users.

---

## Appendix: Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key   # Server-side only, never expose to client

# Optional for analytics
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## Appendix: Key Package.json Dependencies

```json
{
  "dependencies": {
    "next": "14.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "zustand": "^4.x",
    "idb-keyval": "^6.x",
    "next-pwa": "^5.x",
    "date-fns": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/node": "^20.x",
    "@types/react": "^18.x"
  }
}
```

**Total production dependencies: 6.** This is intentionally minimal.

---

*End of Technical Architecture — v0.1*
