# Product Foundation Document — Exam-Prep App (MVP)

**Codename:** TBD
**Version:** v0.1 — MVP Definition
**Date:** 2026-03-27
**Author:** Product Strategy

---

## 1. Product Vision

Build the most habit-forming, low-friction exam practice app for Indian school students — one that makes daily revision feel like a game, not a chore.

The long-term ambition is to become the default daily practice companion for every Indian student from grade 9 through competitive exams. The MVP starts narrow: CBSE grades 9–12, PYQ-first, chapter-wise practice — and earns the right to expand by proving daily retention and measurable score improvement.

---

## 2. Problem Statement

Indian students in grades 9–12 face a specific, underserved problem: they know *what* to study (NCERT syllabus), but they lack a structured, engaging way to *practice consistently* outside of tuition/coaching.

**Current reality:**
- Existing apps (Byju's, Vedantu, Unacademy) are video-heavy, expensive, and optimised for long sessions — not daily micro-practice.
- Students download apps, watch a few videos, and churn within 2 weeks because there's no daily pull.
- PYQ solving — the single highest-ROI exam prep activity — is still done from printed books or unstructured PDFs.
- Students from smaller towns often lack access to coaching but have smartphones. They need structured guidance, not just content dumps.
- Parents spend money on tuition but have zero visibility into whether their child is actually practising.

**The gap:** No product today makes daily PYQ practice as easy, rewarding, and trackable as opening Instagram.

---

## 3. Target Audience Segmentation

| Segment | Description | Device & Connectivity | Motivation | Willingness to Pay |
|---|---|---|---|---|
| **Urban Self-Learner** | Studies in English-medium CBSE school in a Tier-1/2 city. May or may not attend coaching. Has own phone (often mid-range Android or iPhone). | Good device, stable 4G/Wi-Fi | Board exam scores, competitive exam prep foundation | Medium-High (parents will pay for results) |
| **Semi-Urban Aspirant** | Tier-2/3 town, attends local school, limited coaching access. Relies heavily on NCERT and YouTube. Has own Android phone. | Mid-range Android, intermittent connectivity | First in family aiming for top college, needs structured help | Medium (price-sensitive but motivated) |
| **Rural Motivated Learner** | Small town or village, Hindi/regional medium possible. Government or low-fee private school. Shares phone or has budget Android. | Budget Android, inconsistent data | Pass with good marks, improve employability, parental pride | Low (freemium is essential) |
| **Parent (Secondary User)** | Does not use the app daily but wants proof their child is studying. Especially relevant for classes 10 and 12. | WhatsApp-literate, may not install the app themselves | Accountability, marks improvement, value for money | Decision-maker for paid plans |

**MVP primary focus:** Urban Self-Learner and Semi-Urban Aspirant (English medium, CBSE). These segments have the highest activation likelihood, can provide early word-of-mouth, and represent a viable monetisation path.

---

## 4. Top 3 User Personas

### Persona 1: Riya — "The Consistent Achiever"

- **Grade:** 11 (Science — PCM)
- **Location:** Jaipur
- **Device:** Redmi Note (own phone), stable Wi-Fi at home
- **Context:** Attends coaching for JEE foundation. Gets 75-85% in school exams. Wants to break into 90%+ without spending 3 extra hours daily.
- **Goals:** Score 90%+ in boards. Build a habit of daily revision so she doesn't cram before exams. Track how much syllabus she has actually practised.
- **Frustrations:** Coaching covers topics but doesn't give enough practice. PYQ books are boring and she can't track what she's done. Video apps take too long — she doesn't want to watch a 40-minute lecture to solve 10 questions.
- **Motivation triggers:** Visible progress (% of chapter done), comparison with peers (not humiliation — just "am I on track?"), streaks that feel like a personal commitment.
- **Quote:** *"I don't need someone to teach me everything again. I need a place to practise every day and know I'm covering the right things."*

### Persona 2: Arjun — "The Last-Minute Warrior"

- **Grade:** 10 (CBSE)
- **Location:** Lucknow
- **Device:** Samsung Galaxy M-series, uses mobile data
- **Context:** Smart but inconsistent. Studies hard 2 weeks before exams, forgets everything a month later. Parents are worried he's "always on the phone but never studying."
- **Goals:** Pass boards with good marks (80%+). Wants to feel prepared without boring himself. Wants something on his phone that counts as studying so parents stop nagging.
- **Frustrations:** Can't sit through long study sessions. Finds textbooks dry. Doesn't know which PYQs matter. Starts study plans but drops them by day 3.
- **Motivation triggers:** Competitive nudges (friend scored higher today), very short sessions (5-10 min), instant feedback, rewards/badges he can show friends.
- **Quote:** *"If it feels like a quiz game, I'll do it. If it feels like homework, I won't open it."*

### Persona 3: Sunita (Parent) — "The Concerned Monitor"

- **Relationship:** Mother of a class 12 student
- **Location:** Indore
- **Device:** Uses WhatsApp and basic smartphone apps
- **Context:** Her son attends coaching but she suspects he's not practising enough at home. She can't evaluate his preparation herself.
- **Goals:** Know if her child is actually studying daily. See concrete progress (not just "he says he studied"). Feel confident the app is worth the money compared to a tuition teacher.
- **Frustrations:** Paid for multiple apps that her son stopped using after a week. No app tells her anything useful — just "your child logged in." She doesn't trust apps that feel too game-like and not academic.
- **Motivation triggers:** Weekly progress reports (simple, in Hindi/English), clear link between practice and expected marks, testimonials from other parents.
- **Quote:** *"I don't care if it's fun — I care if it actually helps him score better. But if it's fun AND he opens it daily, even better."*

---

## 5. Jobs to Be Done

| # | Job Statement | Context |
|---|---|---|
| 1 | **When** I have 10 free minutes between coaching and dinner, **I want to** practise a few PYQ questions on my phone, **so that** I feel I made progress today without needing a textbook. | Core daily use case — the "micro-practice moment" |
| 2 | **When** I'm starting a new chapter in school, **I want to** see all past PYQs for that chapter organised by difficulty, **so that** I know what the board actually asks. | Chapter-wise discovery — aligning practice with school pace |
| 3 | **When** exams are 4 weeks away, **I want to** follow a day-by-day revision plan covering all important chapters, **so that** I don't waste time deciding what to study. | Term/exam-wise plan — reduces decision fatigue |
| 4 | **When** I finish a practice set, **I want to** see how I did compared to yesterday and compared to others, **so that** I stay motivated to improve. | Progress + competition loop |
| 5 | **When** I get a question wrong, **I want to** understand *why* the correct answer is correct in under 30 seconds, **so that** I actually learn instead of just checking answers. | Micro-learning tied to practice — not standalone lessons |
| 6 | **When** my child has been using the app for a week, **I want to** receive a summary of what they practised and how they're doing, **so that** I feel this is worth continuing (and paying for). | Parent trust loop |
| 7 | **When** I'm bored or procrastinating, **I want to** open the app and do something quick and competitive, **so that** I feel productive instead of guilty. | Replacing doom-scrolling with micro-study |

---

## 6. Core User Needs — Students

1. **Effortless daily practice** — Open the app, start solving in under 5 seconds. No onboarding walls, no video intros, no "select your learning style" quizzes. The first screen should be a question.

2. **Curriculum alignment they can trust** — Questions must map to specific NCERT chapters and CBSE exam patterns. If a student is studying "Chemical Reactions and Equations" in school this week, the app should let them practise exactly that.

3. **Short, completable sessions** — A session should feel done in 5–10 minutes. Long sessions should be opt-in, never forced. The unit of progress is "I did my daily set" — not "I studied for 2 hours."

4. **Instant, clear explanations** — When they get a question wrong, show a concise explanation (not a 10-minute video). Text + key diagram is enough. Link to deeper content only as optional.

5. **Visible progress** — Students need to *see* they're moving forward: chapters covered, accuracy improving, streak maintained. This isn't just gamification — it's anxiety reduction ("I'm on track").

6. **Social proof and light competition** — See that peers are practising. Know where you stand. But framed as motivation, not ranking humiliation (more on this in Section 14).

7. **Offline-capable core flow** — The practice flow (question → answer → explanation) should work with minimal data. Pre-cache the daily set when online.

---

## 7. Core User Needs — Parents

1. **Proof of daily engagement** — Not just "app opened" but "solved 15 questions in Physics Chapter 3, got 11 right." Delivered via WhatsApp or in-app parent view.

2. **Marks-linked framing** — Parents think in terms of marks, not "learning outcomes." Show: "Your child has practised 70% of Chapter 5 PYQs. Students who complete this typically score 85%+ on this chapter." (Use aggregate data once available; use directional framing initially.)

3. **Trust in content quality** — Parents need to believe this is aligned with what the school teaches. NCERT/CBSE alignment is not a feature — it's a trust signal.

4. **Low-effort monitoring** — Parents should not need to install an app, create an account, or learn a dashboard. A weekly WhatsApp summary (auto-sent or shareable by the student) is the MVP path.

5. **Value clarity for paid conversion** — Free tier should be useful enough that the student builds a habit. Paid tier should unlock enough that the *parent* sees clear incremental value (full PYQ bank, mock tests, detailed analytics).

---

## 8. Product Principles for Teenage Engagement

### P1: "First question in 5 seconds"
The time from app open to solving the first question must be under 5 seconds. Every extra screen, tooltip, or animation between the student and practice is a dropout risk. Teenagers will not wait. This principle overrides visual polish in the MVP.

### P2: "Small wins, every session"
Every session — even a 3-minute one — must end with a visible win: a streak continued, accuracy improved, a badge earned, or a chapter % moved. The brain needs a dopamine signal to build a habit. Never let a session end with "nothing happened."

### P3: "Show me I'm not alone"
Teenagers are social learners. Even introverted ones want to know others are doing this too. Show activity signals: "4,200 students practised this chapter today," "Your friend Riya just completed a streak of 7 days." This creates normative pressure without requiring direct interaction.

### P4: "Don't make me decide"
Decision fatigue kills study habits. The app should always have a clear default action: "Here's your daily set" or "Continue where you left off." Let students choose chapters manually, but always offer a zero-decision path.

### P5: "Respect my time, reward my consistency"
Never punish a student for missing a day (harsh streak resets are demotivating). Instead, reward consistency progressively: 3-day streaks, 7-day streaks, monthly milestones. A missed day should feel like "I can catch up" — not "I failed."

### P6: "Fun is a means, not the goal"
Gamification should serve learning, not replace it. Every game mechanic (streaks, XP, leaderboard) must be tied to actual practice. No XP for just logging in. No badges for watching a video passively. The reward must follow effort.

### P7: "Parents see academic value, students feel product value"
The same product must communicate differently to two audiences. Students experience the app as engaging and fast. Parents see reports, marks predictions, and curriculum alignment. Never sacrifice one for the other.

---

## 9. MVP Goals

The MVP must validate three hypotheses within 90 days of launch:

| # | Hypothesis | Target Metric |
|---|---|---|
| H1 | Students will practise PYQs daily if the experience is fast, mobile-first, and rewarding. | **D7 retention ≥ 30%** (% of new users who return on day 7) |
| H2 | Short competitive/social loops increase daily practice frequency. | **Avg. sessions per active user per week ≥ 4** |
| H3 | Parents will perceive academic value if they receive structured progress reports. | **≥ 40% of active students share or enable parent reports within 30 days** |

**Non-goals for MVP:**
- Revenue or paid conversion (focus on habit formation first)
- Full syllabus coverage across all boards
- Video content or live classes
- Teacher/school B2B features

---

## 10. Must-Have MVP Features

### 10.1 Onboarding (< 60 seconds)
- Select grade (9, 10, 11, 12)
- Select stream (Science/Commerce/Arts — for 11-12)
- Select subjects (pre-filled based on stream, editable)
- Phone number + OTP login (no email, no password — Indian mobile-first standard)
- Skip any profile setup that isn't essential. Name is optional. Photo is optional.

**Why:** Indian teenagers will abandon onboarding if it takes more than 3 taps. Phone+OTP is familiar from every Indian app they use.

### 10.2 Daily Practice Set ("Today's Set")
- A curated set of 10–15 PYQ-based MCQs, generated daily based on the student's grade, subjects, and progress.
- Mix of chapters: some from recent school topics (if the student sets their school pace), some revision from older chapters.
- Each question shows: question text, 4 options, and on submission: correct/incorrect + 2-3 line explanation.
- Timer optional (not forced — anxiety-inducing for weaker students).
- Session completes with a summary: score, accuracy vs. yesterday, streak status.

**Why:** This is the atomic habit loop. The daily set is the reason students open the app every day. It must be frictionless, fast, and always ready.

### 10.3 Chapter-Wise Practice
- Browse by subject → chapter (aligned to NCERT textbook chapter list).
- Each chapter shows: total PYQs available, % completed by student, accuracy so far.
- Filter by year, difficulty, or question type (MCQ, assertion-reason, case-based — as per new CBSE pattern).
- Students can do a "quick 10" from any chapter or attempt all questions sequentially.

**Why:** Students often want to practise a specific chapter that was just taught in school or coaching. This is the second most common entry point after the daily set.

### 10.4 Exam/Term Practice Plan
- Pre-built 30-day and 60-day revision plans for Term 1 and Term 2 exams.
- Each day maps to specific chapters and a set number of questions.
- Students can start a plan and track daily completion.
- Missed days roll forward (don't just skip — redistribute the load).

**Why:** Exam-proximate students (especially class 10 and 12) need a structured countdown plan. This is high-intent, high-retention usage.

### 10.5 Instant Explanations
- Every question has a short text explanation (2-5 lines) for the correct answer.
- Include the NCERT reference (e.g., "See NCERT Class 10 Science, Chapter 1, Section 1.3").
- For tricky questions, include a "Why other options are wrong" expandable section.

**Why:** Explanations are where learning actually happens. But they must be concise — students solving 15 questions don't want to read a paragraph per question. The NCERT reference builds trust and bridges the app to their textbook.

### 10.6 Progress Dashboard (Student)
- Streak counter (current and longest)
- Subject-wise accuracy trend (last 7 days, last 30 days)
- Chapter completion % per subject (visual progress bar)
- Total questions solved (lifetime counter — big number = motivation)
- "Today's goal" status (daily set done / not done)

**Why:** This is the mirror that tells the student "you're improving." Without visible progress, consistency feels pointless.

### 10.7 Leaderboard (see Section 14 for detailed design)
- Weekly leaderboard, reset every Monday.
- Rank by XP earned from practice (not just accuracy — effort matters).
- Show top 20 + student's own rank and nearby ranks.
- Scope: school-level (if enough users) or city/region-level, plus an all-India board.

### 10.8 XP and Streak System
- XP earned per question attempted (more for correct, some for attempted).
- Bonus XP for completing daily set, maintaining streak, finishing a chapter.
- Streak: counted in days of completing the daily set. Visual flame/counter.
- Streak freeze: 1 free freeze per week (prevents harsh punishment for a single missed day).

**Why:** XP is the universal currency that powers the leaderboard and progress system. Streaks create daily commitment. The freeze prevents the "I missed one day so I quit" dropout pattern that plagues Duolingo clones.

### 10.9 Parent Progress Report
- Weekly auto-generated report: subjects practised, questions solved, accuracy, streak, chapters covered.
- Shareable as a WhatsApp message or image (student-initiated in MVP — parent dashboard is post-MVP).
- Framing: "Riya practised 87 questions this week across 4 subjects. Accuracy: 72% (up from 65% last week). Chapters covered: 3 new, 2 revised."

**Why:** Parents are the paying customers. A WhatsApp-friendly weekly report is the lowest-friction way to demonstrate value. Student-initiated sharing also builds trust (the student is proud enough to share).

### 10.10 Basic Profile and Settings
- Name, grade, stream, subjects (editable)
- Notification preferences (daily reminder time — default 7 PM, customisable)
- Language: English only for MVP (Hindi explanations as a fast-follow)

---

## 11. Nice-to-Have but NOT Required for MVP

| Feature | Why It's Deferred | When to Add |
|---|---|---|
| **Mock tests (full-length)** | High content effort, different use case (exam simulation vs. daily practice). Daily practice must be validated first. | Post-MVP, 2-3 months before board exams |
| **Video explanations** | Expensive to produce, shifts the product toward content consumption. MVP is about practice. | Only if text explanations show low satisfaction |
| **Friend system / social feed** | Adds complexity. Leaderboard provides enough social signal for MVP. | When D30 retention is proven |
| **Hindi / regional language support** | Essential for scale but multiplies content work. English-medium CBSE is the beachhead. | Post-MVP Phase 2, starting with Hindi |
| **Adaptive difficulty (AI-driven)** | Needs usage data to train. Start with static difficulty tags (easy/medium/hard from PYQ analysis). | Once 1M+ question attempts are logged |
| **Parent dashboard (in-app)** | WhatsApp report is sufficient for MVP. A full dashboard adds a separate user flow to maintain. | When parent engagement data justifies it |
| **Doubt-solving / Q&A** | Different product surface, moderation burden, and potential quality issues. | Only if core practice loop is strong |
| **School/teacher integration** | B2B complexity, sales cycles, customisation demands. Stay B2C for MVP. | Only if organic school-level adoption emerges |
| **Competitive exam content (JEE/NEET)** | Different question format, difficulty, and user expectation. Board exams first. | Post-MVP, as a separate "mode" |
| **Achievement badges beyond basics** | A few key badges (first streak, 100 questions, chapter master) are in MVP. Elaborate badge systems can wait. | When engagement data shows which milestones matter |
| **Dark mode** | Nice UX polish but not a retention driver. | Fast-follow based on user requests |

---

## 12. Things to Avoid in MVP

1. **Video-first content** — Do not build or license video content. The market is saturated with video. Your differentiation is *practice*, not *lectures*. Adding video dilutes focus, increases cost, and attracts "passive learner" users who churn fast.

2. **Complex onboarding flows** — No learning-style quizzes, goal-setting wizards, or "tell us about yourself" forms. Get the student to a question in under 60 seconds.

3. **Subscription paywalls before habit formation** — Do not gate the daily set or basic chapter practice behind a paywall. Let the student build a 2-week habit before showing any paid features. Premature monetisation kills D7 retention.

4. **Harsh streak punishment** — Never reset a streak to zero for missing one day. Use streak freezes and "recovery" mechanics. Research from Duolingo shows that harsh resets are the #1 cause of permanent churn after initial habit formation.

5. **Content for all boards at launch** — CBSE only. Don't spread thin across ICSE, state boards, and CBSE simultaneously. Depth beats breadth in MVP.

6. **AI-generated questions without human QA** — PYQ questions are gold because they're real exam questions. If you add AI-generated practice questions later, every one must be human-reviewed. A single wrong answer in the answer key destroys trust permanently.

7. **Community features (forums, chat, comments)** — Moderation burden is enormous for a teen audience. Sexual content, bullying, and spam will appear within days. Not worth the risk for MVP.

8. **Teacher/admin dashboards** — B2B features siphon engineering time and create feature requests that conflict with student UX. Stay B2C.

9. **Notification spam** — One daily reminder is acceptable. Multiple push notifications per day will lead to uninstalls. Indian teenagers are aggressive about notification management.

10. **"Edtech aesthetic"** — Avoid the generic blue-and-white, stock-photo-of-smiling-student look. The app should feel closer to a utility (like a to-do app or fitness tracker) than a coaching institute's website.

---

## 13. Suggested Habit Loop for Daily Usage

The daily habit loop follows the **Cue → Routine → Reward** framework:

```
┌─────────────────────────────────────────────────┐
│                  DAILY HABIT LOOP                │
├─────────────────────────────────────────────────┤
│                                                  │
│  CUE (Trigger)                                   │
│  ├─ Push notification at student's chosen time   │
│  │  (default: 7 PM — post-school, post-coaching) │
│  ├─ Message: "Your daily set is ready. 10 Qs,    │
│  │  ~8 min. Keep your 5-day streak alive."       │
│  └─ Streak-at-risk framing on days 3+ of streak │
│                                                  │
│  ROUTINE (Action)                                │
│  ├─ Open app → daily set is the first screen     │
│  ├─ Solve 10-15 MCQs (5-10 minutes)             │
│  ├─ Each question: tap answer → instant feedback │
│  ├─ Read explanation if wrong (10-15 seconds)    │
│  └─ Session auto-completes with summary screen   │
│                                                  │
│  REWARD (Payoff)                                 │
│  ├─ Streak counter increments (visual animation) │
│  ├─ XP earned + level progress bar moves         │
│  ├─ Accuracy compared to yesterday (improvement  │
│  │  highlighted in green)                        │
│  ├─ Leaderboard rank change shown                │
│  ├─ "Share with parent" card (weekly)            │
│  └─ Milestone badges at key thresholds           │
│     (7-day streak, 100 Qs, chapter complete)     │
│                                                  │
│  INVESTMENT (Raises switching cost)              │
│  ├─ Streak length grows — loss aversion kicks in │
│  ├─ Chapter completion % builds — progress feels │
│  │  "owned"                                      │
│  ├─ XP/level becomes part of identity            │
│  └─ Parent receives report — social accountability│
│                                                  │
└─────────────────────────────────────────────────┘
```

**Key timing considerations:**
- Default notification at 7 PM works for most students (post-school, post-coaching, before dinner/entertainment).
- Allow students to pick their own time — some prefer morning revision.
- Weekend sets can be slightly longer (15-20 questions) since students have more time.
- During exam season (Feb-March, Sept-Oct), increase urgency in messaging: "Board exams in 45 days. You've covered 62% of Physics PYQs."

---

## 14. Suggested Competition Model

### The Problem with Traditional Leaderboards
Standard rank-ordered leaderboards demotivate 80% of users. The top 10% feel great; everyone else feels they can never catch up. For an exam-prep app targeting students of *varied* academic levels, a pure ranking system will cause weaker students to disengage — the exact students who need the app most.

### Recommended Model: "Leagues + Personal Bests"

**Layer 1 — Leagues (Effort-Based, Weekly Reset)**
- Students are placed into leagues of ~50 people based on current XP tier (not accuracy).
- Leagues reset weekly. Top 5 promote to next league, bottom 5 demote.
- XP is earned primarily through *practice volume* (questions attempted) with a *bonus* for accuracy — so effort is the primary lever, not raw intelligence.
- League names follow a progression: Bronze → Silver → Gold → Platinum → Diamond.
- This is directly inspired by Duolingo's league system, which is proven to drive engagement without discouraging weaker learners, because you compete against people at a similar effort level.

**Why this works:** A student who solves 100 easy questions can rank higher than one who solved 20 hard questions perfectly. This rewards consistency and effort, not just talent. Weaker students can "win" by showing up daily.

**Layer 2 — Personal Bests (Self-Competition)**
- "Beat your best" challenges: highest daily accuracy, longest streak, most questions in a week.
- Shown prominently on the profile — students compete against their own history.
- Especially important for students not motivated by social comparison.

**Why this works:** Research on adolescent motivation shows that mastery-oriented goals (beating yourself) sustain motivation longer than performance-oriented goals (beating others), especially for students who are below average.

**Layer 3 — Chapter Challenges (Collaborative Competition)**
- Weekly challenge: "Who can complete the most questions from Chapter 5 this week?"
- Shows a live counter of how many questions have been solved across all students.
- Students contribute to a collective goal while competing individually.

**Why this works:** Creates a sense of community ("4,000 students are practising this chapter with me") while still having individual ranking within the challenge.

**Anti-Discouragement Safeguards:**
- Never show a student's rank if they're below the 50th percentile — show "Keep going! You're improving" instead.
- Celebrate *improvement* in rank, not just absolute rank. "You moved up 12 spots this week!" matters more than "You're ranked #38."
- Don't show accuracy-based comparisons. A student getting 40% shouldn't see that peers average 70%. Show them their own accuracy trend instead.
- Weekly reset ensures no one feels permanently "behind." Every Monday is a fresh start.

---

## 15. Recommended Subject/Grade/Board Scope for Launch

### Board: CBSE only

**Rationale:** CBSE is the largest single board in India (~25,000+ affiliated schools, ~20M+ students). It has a standardised syllabus (NCERT) and a well-documented PYQ bank. Starting with CBSE gives the largest addressable market with the most uniform content requirement.

### Grades: 10 and 12 first, then 9 and 11

**Rationale:**
- Class 10 and 12 have board exams — the highest-stakes, highest-motivation use case.
- Students (and parents) are most willing to adopt a new tool when exams are approaching.
- Class 9 and 11 have school-level exams but no board pressure — lower urgency, lower activation.
- Content for 9 and 11 can follow within 4-6 weeks of launch since NCERT chapters overlap significantly.

### Subjects for launch:

| Grade | Subjects | Rationale |
|---|---|---|
| **Class 10** | Science, Mathematics, Social Science | These 3 subjects have the highest PYQ density and are universally studied. English is subjective (not MCQ-friendly for MVP). Hindi/Sanskrit are lower priority. |
| **Class 12 Science** | Physics, Chemistry, Mathematics, Biology | Core board exam subjects. All have extensive MCQ PYQ banks, especially post-2021 (CBSE shifted to more MCQ-heavy papers). |
| **Class 12 Commerce** | Accountancy, Business Studies, Economics | High demand, underserved in practice apps. Defer to Phase 2 if content sourcing is slow. |

**Total content scope for MVP:**
- ~3 subjects × ~15 chapters each for Class 10 = ~45 chapter-level question sets
- ~4 subjects × ~15 chapters each for Class 12 Science = ~60 chapter-level question sets
- Estimated 5,000–8,000 unique PYQs across all subjects (sourcing from 2015–2025 papers, including sample papers and compartment papers)

### Content Sourcing Strategy:
1. Start with publicly available CBSE PYQs (2015–2025) — these are freely available and legally reproducible.
2. Tag each question with: year, chapter, topic, difficulty (easy/medium/hard), question type (MCQ, assertion-reason, case-based, competency-based).
3. Write concise explanations for each question (this is the primary content creation effort).
4. Quality-check every question-answer-explanation triplet before publishing.

---

## 16. Key Risks and Assumptions

### Assumptions (to validate)

| # | Assumption | How to Validate | Risk if Wrong |
|---|---|---|---|
| A1 | Students will open a practice app daily if the sessions are short enough (5-10 min). | D7 and D30 retention metrics. | The core product thesis fails. Pivot to exam-season-only tool. |
| A2 | PYQ-based practice is perceived as more valuable than generic question banks. | User interviews + activation rate for PYQ-tagged content vs. generic. | May need to invest in original question creation earlier. |
| A3 | A leaderboard with effort-based XP will motivate without discouraging weaker students. | Retention by student accuracy quartile. Check if bottom-25% students churn faster. | Redesign competition model. |
| A4 | Parents will engage with WhatsApp-based progress reports. | Open rate / share rate of parent reports. | Build in-app parent view earlier, or find another trust-building mechanism. |
| A5 | CBSE English-medium is a large enough beachhead for meaningful early traction. | Absolute user acquisition numbers in first 60 days. | Accelerate Hindi/regional language support. |
| A6 | Next.js on Vercel with client-side caching will deliver acceptable performance on mid-range Android devices with intermittent connectivity. | Core Web Vitals, TTI on target devices, offline practice completion rate. | May need a lighter tech approach (PWA optimisations, more aggressive caching, or consider React Native for native feel). |

### Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | **Content quality errors** — A wrong answer key or incorrect explanation destroys trust instantly and spreads via screenshots on social media. | Critical | 2-pass human review for every question. In-app "report error" button with fast response SLA (<24 hours). |
| R2 | **Low D7 retention** — Students download, try once, and don't return. The habit doesn't form. | Critical | Optimise notification timing. Add streak-recovery mechanics. Test different daily set lengths. Talk to churned users. |
| R3 | **Competitive apps copying the model** — Larger edtech players with existing user bases (e.g., PW, Testbook) add a similar daily practice feature. | High | Speed of execution and depth of habit-loop design are the moat. Larger players are optimised for long-session video; pivoting to micro-practice is harder than it looks for them. |
| R4 | **Cheating/gaming the leaderboard** — Students sharing answers, using multiple accounts, or scripting XP. | Medium | Rate-limit XP earning. Randomise question order per user. Flag statistical anomalies. Don't make leaderboard rewards so valuable that cheating is worth it. |
| R5 | **Parent apathy** — Parents don't engage with reports, making the "parent trust" thesis unvalidated. | Medium | Test multiple report formats and channels. Consider adding a simple "quiz your child" feature that parents can do at dinner. |
| R6 | **Performance issues on low-end devices** — Heavy client-side rendering may struggle on budget Android phones with 2-3GB RAM. | Medium | Performance budget: <3s TTI on Redmi 9. Lighthouse testing on real devices. Aggressive lazy loading. Minimal JS bundle for the practice flow. |
| R7 | **Content pipeline bottleneck** — Explanations take longer to write than expected, delaying chapter coverage. | Medium | Start with the 20 highest-frequency chapters per subject. Launch with partial coverage and expand weekly. Clearly label "coming soon" chapters. |

---

## 17. Success Metrics for MVP

### North Star Metric
**Weekly Active Practitioners (WAP):** Number of unique users who complete at least one daily practice set per week.

*Why this and not MAU:* "Active" is meaningless if it counts students who opened the app and left. Completing a practice set is the minimum meaningful action.

### Primary Metrics (review weekly)

| Metric | Target (90-day) | Why It Matters |
|---|---|---|
| **D1 retention** | ≥ 60% | Did the first session deliver enough value to come back tomorrow? |
| **D7 retention** | ≥ 30% | Is the habit forming? Industry benchmark for education apps is ~15-20%, so 30% would be exceptional. |
| **D30 retention** | ≥ 15% | Is the product sticky beyond novelty? |
| **Daily set completion rate** | ≥ 70% of sessions started | Are sessions the right length? Are students finishing or dropping mid-set? |
| **Avg. sessions/week (active users)** | ≥ 4 | Are students practising most days? |
| **Questions solved per user per week** | ≥ 50 | Volume of practice — proxy for learning impact. |

### Secondary Metrics (review bi-weekly)

| Metric | Target | Why It Matters |
|---|---|---|
| **Parent report share rate** | ≥ 40% of active students share at least once in 30 days | Parent engagement thesis validation. |
| **Streak length (median)** | ≥ 5 days | Are streaks driving retention? |
| **Leaderboard participation** | ≥ 50% of WAP check the leaderboard weekly | Is competition motivating? |
| **Accuracy improvement (per student, 30-day)** | ≥ 5 percentage points | Is the product actually improving outcomes? This is the ultimate credibility metric. |
| **NPS (Net Promoter Score)** | ≥ 40 | Would students recommend this? Critical for organic growth in a student audience (word of mouth >> paid ads). |
| **Error reports per 1000 questions served** | < 2 | Content quality monitoring. |

### Metrics to Track but NOT Optimise in MVP

| Metric | Reason to Defer |
|---|---|
| Revenue / ARPU | Monetisation is not an MVP goal. Premature optimisation for revenue will hurt retention. |
| App store rating | Volatile early on. Focus on retention, not rating. |
| Total downloads | Vanity metric. 100K downloads with 5% D7 retention is worse than 10K downloads with 30% D7. |

---

## 18. Product Thesis

**If we give Indian CBSE students a mobile app that delivers a curated set of 10-15 PYQ-based MCQs daily — completable in under 10 minutes, with instant explanations, visible progress, and a weekly competitive league — they will build a daily practice habit (D7 retention ≥ 30%) that neither textbooks, coaching, nor existing edtech apps have been able to create, because no current product optimises for the specific job of fast, rewarding, curriculum-aligned daily revision. Validating this habit loop with CBSE classes 10 and 12 will establish the foundation for expanding across boards, grades, and competitive exams — while parent-facing progress reports will build the trust needed to convert free users into paying families.**

---

*End of Product Foundation Document — v0.1*
