-- ─────────────────────────────────────────────────────────────────────────────
-- PrepFire — Seed Data
-- Run AFTER schema.sql.
-- Supabase Dashboard → SQL Editor → Run this file.
-- ─────────────────────────────────────────────────────────────────────────────


-- ─── SUBJECTS ─────────────────────────────────────────────────────────────────
INSERT INTO subjects (id, name, class_level, board, color, icon) VALUES
  ('science-10',  'Science',     10, 'CBSE', 'bg-blue-500',    '🔬'),
  ('maths-10',    'Mathematics', 10, 'CBSE', 'bg-purple-500',  '📐'),
  ('sst-10',      'Social Sci.', 10, 'CBSE', 'bg-amber-500',   '🌍'),
  ('science-9',   'Science',      9, 'CBSE', 'bg-blue-500',    '🔬'),
  ('maths-9',     'Mathematics',  9, 'CBSE', 'bg-purple-500',  '📐'),
  ('physics-12',  'Physics',     12, 'CBSE', 'bg-sky-500',     '⚡'),
  ('chemistry-12','Chemistry',   12, 'CBSE', 'bg-green-500',   '⚗️'),
  ('biology-12',  'Biology',     12, 'CBSE', 'bg-emerald-500', '🧬'),
  ('maths-12',    'Mathematics', 12, 'CBSE', 'bg-purple-500',  '📐')
ON CONFLICT (id) DO NOTHING;


-- ─── CHAPTERS (Class 10 Science sample) ──────────────────────────────────────
INSERT INTO chapters (id, subject_id, name, order_index) VALUES
  ('c-sci10-01', 'science-10', 'Chemical Reactions and Equations', 1),
  ('c-sci10-02', 'science-10', 'Acids, Bases and Salts',           2),
  ('c-sci10-03', 'science-10', 'Metals and Non-metals',            3),
  ('c-sci10-04', 'science-10', 'Life Processes',                   4),
  ('c-sci10-12', 'science-10', 'Electricity',                      12)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, subject_id, name, order_index) VALUES
  ('c-math10-01', 'maths-10', 'Real Numbers',                 1),
  ('c-math10-04', 'maths-10', 'Quadratic Equations',          4),
  ('c-math10-05', 'maths-10', 'Arithmetic Progressions',      5),
  ('c-math10-06', 'maths-10', 'Triangles',                    6),
  ('c-math10-10', 'maths-10', 'Circles',                      10),
  ('c-math10-14', 'maths-10', 'Statistics',                   14)
ON CONFLICT DO NOTHING;


-- ─── QUESTIONS (Class 10 Science — Chemical Reactions) ───────────────────────
-- NOTE: Replace these with real CBSE PYQs before going live.
-- Each question: subject, chapter, class, text, 4 options, CORRECT answer, explanation.

INSERT INTO questions
  (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty)
VALUES
(
  'science-10',
  'c-sci10-01',
  10,
  'Which of the following is a double displacement reaction?',
  '2H₂ + O₂ → 2H₂O',
  'CaCO₃ → CaO + CO₂',
  'AgNO₃ + NaCl → AgCl + NaNO₃',
  'Fe + CuSO₄ → FeSO₄ + Cu',
  'C',
  'Double displacement reactions involve an exchange of ions between two compounds. AgNO₃ + NaCl → AgCl + NaNO₃ shows silver and sodium ions swapping partners. NCERT Class 10 Science, Ch. 1.',
  2023, 'easy'
),
(
  'science-10',
  'c-sci10-02',
  10,
  'Which of the following solutions will turn red litmus paper blue?',
  'Hydrochloric acid',
  'Lemon juice',
  'Sodium hydroxide',
  'Vinegar',
  'C',
  'Bases turn red litmus blue. Sodium hydroxide (NaOH) is a strong base with pH > 7. Acids (HCl, lemon juice, vinegar) have pH < 7. NCERT Class 10 Science, Ch. 2.',
  2023, 'easy'
),
(
  'science-10',
  'c-sci10-03',
  10,
  'Which metal is stored in kerosene to prevent it from catching fire?',
  'Calcium',
  'Magnesium',
  'Sodium',
  'Potassium',
  'C',
  'Sodium is highly reactive and catches fire in air. It is stored in kerosene to prevent contact with oxygen and moisture. NCERT Class 10 Science, Ch. 3.',
  2021, 'medium'
),
(
  'science-10',
  'c-sci10-12',
  10,
  'The SI unit of electric charge is:',
  'Ampere',
  'Volt',
  'Coulomb',
  'Ohm',
  'C',
  'The Coulomb (C) is the SI unit of electric charge. It equals the charge carried by approximately 6.24 × 10¹⁸ electrons. NCERT Class 10 Science, Ch. 12.',
  2022, 'easy'
),
(
  'science-10',
  'c-sci10-04',
  10,
  'The process by which plants make their food using sunlight is called:',
  'Respiration',
  'Photosynthesis',
  'Transpiration',
  'Digestion',
  'B',
  'Photosynthesis is the process by which green plants use sunlight, water, and CO₂ to produce glucose and oxygen. NCERT Class 10 Science, Ch. 6.',
  2022, 'easy'
);


-- ─── QUESTIONS (Class 10 Mathematics) ────────────────────────────────────────
INSERT INTO questions
  (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty)
VALUES
(
  'maths-10',
  'c-math10-04',
  10,
  'The roots of the equation x² – 5x + 6 = 0 are:',
  '2 and 3',
  '–2 and –3',
  '1 and 6',
  '–1 and –6',
  'A',
  'Factor x² – 5x + 6 = (x – 2)(x – 3) = 0. So x = 2 or x = 3. Verify: 2×3 = 6 ✓ and 2+3 = 5 ✓. NCERT Class 10 Maths, Ch. 4.',
  2023, 'easy'
),
(
  'maths-10',
  'c-math10-06',
  10,
  'If ΔABC ~ ΔPQR and AB/PQ = 2/3, then the ratio of their areas is:',
  '2/3',
  '4/9',
  '3/2',
  '9/4',
  'B',
  'For similar triangles, ratio of areas = (ratio of corresponding sides)². So (2/3)² = 4/9. NCERT Class 10 Maths, Ch. 6.',
  2022, 'medium'
),
(
  'maths-10',
  'c-math10-05',
  10,
  'The nth term of an AP is 7 – 3n. The common difference is:',
  '3',
  '–3',
  '7',
  '4',
  'B',
  'The common difference d = a(n+1) – a(n) = [7 – 3(n+1)] – [7 – 3n] = –3. NCERT Class 10 Maths, Ch. 5.',
  2023, 'medium'
),
(
  'maths-10',
  'c-math10-10',
  10,
  'A tangent to a circle is perpendicular to the radius at the point of:',
  'Centre',
  'Tangency',
  'Intersection',
  'Diameter end',
  'B',
  'A tangent to a circle is always perpendicular to the radius drawn to the point of tangency. This is a fundamental theorem. NCERT Class 10 Maths, Ch. 10.',
  2021, 'easy'
),
(
  'maths-10',
  'c-math10-14',
  10,
  'The measure of central tendency which is NOT affected by extreme values is:',
  'Mean',
  'Median',
  'Mode',
  'Range',
  'B',
  'Median is the middle value of ordered data, so extreme values (outliers) do not affect it. Mean is heavily affected by outliers. NCERT Class 10 Maths, Ch. 14.',
  2023, 'easy'
);


-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFY: Run these to confirm data loaded correctly
-- ─────────────────────────────────────────────────────────────────────────────
-- SELECT COUNT(*) FROM subjects;    -- Should be 9
-- SELECT COUNT(*) FROM chapters;    -- Should be 11
-- SELECT COUNT(*) FROM questions;   -- Should be 10
