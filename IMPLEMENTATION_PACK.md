# PrepFire MVP — Implementation Pack
**Version:** V1
**Scope:** Onboarding → Home → Practice Flow → Result → Progress

> Source: Product strategy + technical architecture defined in PRODUCT_FOUNDATION.md and TECHNICAL_ARCHITECTURE.md

---

## Build Scope Lock

### In Scope — V1
- Class selection, subject selection, name capture
- Daily Set of 10 questions
- One-question-at-a-time answering flow
- Instant feedback + explanation
- Result summary (score, XP, streak)
- Streak tracking
- Basic progress page

### Out of Scope — V1
- Leaderboard, parent report, 30-day plan
- Weak topic engine, chapter browser advanced filters
- Offline sync queue, PWA installability
- Phone OTP auth (localStorage UUID for V1)

---

## Route Map
| Route | Purpose |
|---|---|
| `/` | Landing router — check onboarding → redirect |
| `/onboarding/class` | Select class (9/10/11/12) |
| `/onboarding/subjects` | Select subjects |
| `/onboarding/name` | Enter display name |
| `/home` | Launch daily set, see streak |
| `/practice/session/[sessionId]` | Answer questions one-by-one |
| `/practice/result/[sessionId]` | Session outcome |
| `/progress` | Overall stats + history |
| `/profile` | User settings |

---

*Detailed specs in each section above.*
