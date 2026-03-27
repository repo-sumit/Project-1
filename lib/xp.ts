import { XP } from './constants'

// ─── XP Calculation Logic ────────────────────────────────────────────────────

/**
 * How much XP is awarded for a single question answer.
 */
export function xpForAnswer(isCorrect: boolean): number {
  return isCorrect ? XP.CORRECT_ANSWER : XP.WRONG_ATTEMPT
}

/**
 * Total XP for a completed session.
 * Includes per-question XP + daily set completion bonus.
 */
export function xpForSession(
  correctCount: number,
  totalQuestions: number,
  isDailySet: boolean,
  currentStreak: number
): number {
  const perQuestion = correctCount * XP.CORRECT_ANSWER +
    (totalQuestions - correctCount) * XP.WRONG_ATTEMPT

  const completionBonus = isDailySet ? XP.DAILY_SET_COMPLETE : 0

  // Streak bonus: only if streak ≥ 2 days
  const streakBonus = currentStreak >= 2
    ? Math.min(currentStreak, 7) * XP.STREAK_BONUS
    : 0

  return perQuestion + completionBonus + streakBonus
}

/**
 * Calculate accuracy as a 0-100 percentage.
 */
export function accuracyPct(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

/**
 * Update streak based on today's practice.
 * - If last practice was yesterday → increment
 * - If last practice was today → no change (already counted)
 * - If last practice was 2+ days ago → reset to 1
 */
export function calculateNewStreak(
  currentStreak: number,
  longestStreak: number,
  lastCompletedDate: string | null,
  today: string
): { currentStreak: number; longestStreak: number } {
  if (lastCompletedDate === today) {
    // Already practised today — no change
    return { currentStreak, longestStreak }
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  const newCurrent =
    lastCompletedDate === yesterdayStr
      ? currentStreak + 1 // consecutive day
      : 1                 // reset (missed a day)

  return {
    currentStreak: newCurrent,
    longestStreak: Math.max(longestStreak, newCurrent),
  }
}
