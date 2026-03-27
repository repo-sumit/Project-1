import type { Question } from '@/types'

// ─── Demo Mode Mock Questions ─────────────────────────────────────────────────
// Used when Supabase is NOT configured (no .env.local).
// This lets developers test the full UI flow before setting up the database.
// Replace these with real CBSE PYQs before going live.

export const MOCK_QUESTIONS: Question[] = [
  // ── Science (Class 10) ─────────────────────────────────────────────────────
  {
    id: 'mock-q1',
    chapterId: 'chemical-reactions',
    subjectId: 'science-10',
    questionText:
      'Which of the following is a double displacement reaction?',
    optionA: '2H₂ + O₂ → 2H₂O',
    optionB: 'CaCO₃ → CaO + CO₂',
    optionC: 'AgNO₃ + NaCl → AgCl + NaNO₃',
    optionD: 'Fe + CuSO₄ → FeSO₄ + Cu',
    yearTag: 2023,
    difficulty: 'easy',
  },
  {
    id: 'mock-q2',
    chapterId: 'chemical-reactions',
    subjectId: 'science-10',
    questionText:
      'The process by which green plants make their own food using sunlight is called:',
    optionA: 'Respiration',
    optionB: 'Photosynthesis',
    optionC: 'Transpiration',
    optionD: 'Digestion',
    yearTag: 2022,
    difficulty: 'easy',
  },
  {
    id: 'mock-q3',
    chapterId: 'acids-bases',
    subjectId: 'science-10',
    questionText:
      'Which of the following solutions will turn red litmus paper blue?',
    optionA: 'Hydrochloric acid',
    optionB: 'Lemon juice',
    optionC: 'Sodium hydroxide',
    optionD: 'Vinegar',
    yearTag: 2023,
    difficulty: 'easy',
  },
  {
    id: 'mock-q4',
    chapterId: 'metals-nonmetals',
    subjectId: 'science-10',
    questionText:
      'Which metal is stored in kerosene to prevent it from catching fire?',
    optionA: 'Calcium',
    optionB: 'Magnesium',
    optionC: 'Sodium',
    optionD: 'Potassium',
    yearTag: 2021,
    difficulty: 'medium',
  },
  {
    id: 'mock-q5',
    chapterId: 'electricity',
    subjectId: 'science-10',
    questionText:
      'The SI unit of electric charge is:',
    optionA: 'Ampere',
    optionB: 'Volt',
    optionC: 'Coulomb',
    optionD: 'Ohm',
    yearTag: 2022,
    difficulty: 'easy',
  },

  // ── Mathematics (Class 10) ─────────────────────────────────────────────────
  {
    id: 'mock-q6',
    chapterId: 'quadratic-equations',
    subjectId: 'maths-10',
    questionText:
      'The roots of the equation x² – 5x + 6 = 0 are:',
    optionA: '2 and 3',
    optionB: '–2 and –3',
    optionC: '1 and 6',
    optionD: '–1 and –6',
    yearTag: 2023,
    difficulty: 'easy',
  },
  {
    id: 'mock-q7',
    chapterId: 'triangles',
    subjectId: 'maths-10',
    questionText:
      'If ΔABC ~ ΔPQR and AB/PQ = 2/3, then the ratio of their areas is:',
    optionA: '2/3',
    optionB: '4/9',
    optionC: '3/2',
    optionD: '9/4',
    yearTag: 2022,
    difficulty: 'medium',
  },
  {
    id: 'mock-q8',
    chapterId: 'arithmetic-progressions',
    subjectId: 'maths-10',
    questionText:
      'The nth term of an AP is 7 – 3n. The common difference is:',
    optionA: '3',
    optionB: '–3',
    optionC: '7',
    optionD: '4',
    yearTag: 2023,
    difficulty: 'medium',
  },
  {
    id: 'mock-q9',
    chapterId: 'circles',
    subjectId: 'maths-10',
    questionText:
      'A tangent to a circle is perpendicular to the radius at the point of:',
    optionA: 'Centre',
    optionB: 'Tangency',
    optionC: 'Intersection',
    optionD: 'Diameter',
    yearTag: 2021,
    difficulty: 'easy',
  },
  {
    id: 'mock-q10',
    chapterId: 'statistics',
    subjectId: 'maths-10',
    questionText:
      'The measure of central tendency which is NOT affected by extreme values is:',
    optionA: 'Mean',
    optionB: 'Median',
    optionC: 'Mode',
    optionD: 'Range',
    yearTag: 2023,
    difficulty: 'easy',
  },
]

// ─── Correct answers for mock questions (server-side only) ───────────────────
// This map is used by the API route — NEVER sent to the client directly.
export const MOCK_ANSWERS: Record<string, { correctOption: string; explanation: string }> = {
  'mock-q1': {
    correctOption: 'C',
    explanation:
      'Double displacement reactions involve an exchange of ions between two compounds. AgNO₃ + NaCl → AgCl + NaNO₃ shows silver and sodium ions swapping partners. NCERT Class 10 Science, Ch. 1.',
  },
  'mock-q2': {
    correctOption: 'B',
    explanation:
      'Photosynthesis is the process by which green plants use sunlight, water, and CO₂ to produce glucose and oxygen. NCERT Class 10 Science, Ch. 6.',
  },
  'mock-q3': {
    correctOption: 'C',
    explanation:
      'Bases turn red litmus blue. Sodium hydroxide (NaOH) is a strong base with pH > 7. Acids (HCl, lemon juice, vinegar) have pH < 7 and turn blue litmus red. NCERT Class 10 Science, Ch. 2.',
  },
  'mock-q4': {
    correctOption: 'C',
    explanation:
      'Sodium is highly reactive and catches fire in air. It is stored in kerosene to prevent contact with oxygen and moisture. NCERT Class 10 Science, Ch. 3.',
  },
  'mock-q5': {
    correctOption: 'C',
    explanation:
      'The Coulomb (C) is the SI unit of electric charge. It equals the charge carried by approximately 6.24 × 10¹⁸ electrons. NCERT Class 10 Science, Ch. 12.',
  },
  'mock-q6': {
    correctOption: 'A',
    explanation:
      'Factor x² – 5x + 6 = (x – 2)(x – 3) = 0. So x = 2 or x = 3. You can verify: 2×3 = 6 ✓ and 2+3 = 5 ✓. NCERT Class 10 Maths, Ch. 4.',
  },
  'mock-q7': {
    correctOption: 'B',
    explanation:
      'For similar triangles, the ratio of areas = (ratio of corresponding sides)². So (2/3)² = 4/9. NCERT Class 10 Maths, Ch. 6.',
  },
  'mock-q8': {
    correctOption: 'B',
    explanation:
      'The common difference d = a(n+1) – a(n) = [7 – 3(n+1)] – [7 – 3n] = –3. NCERT Class 10 Maths, Ch. 5.',
  },
  'mock-q9': {
    correctOption: 'B',
    explanation:
      'A tangent to a circle is always perpendicular to the radius drawn to the point of tangency. This is a fundamental theorem. NCERT Class 10 Maths, Ch. 10.',
  },
  'mock-q10': {
    correctOption: 'B',
    explanation:
      'Median is the middle value of ordered data, so extreme values do not affect it. Mean is affected by outliers; mode may not exist. NCERT Class 10 Maths, Ch. 14.',
  },
}
