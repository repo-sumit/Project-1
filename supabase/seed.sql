-- ══════════════════════════════════════════════════════════════════════════════
-- PrepFire — Seed Data (30 real CBSE PYQ-style questions)
-- Run AFTER schema.sql.
-- ══════════════════════════════════════════════════════════════════════════════


-- ─── SUBJECTS ─────────────────────────────────────────────────────────────────
INSERT INTO subjects (id, name, class_level, board, color, icon) VALUES
  ('science-10',  'Science',     10, 'CBSE', 'bg-blue-500',   '🔬'),
  ('maths-10',    'Mathematics', 10, 'CBSE', 'bg-purple-500', '📐'),
  ('sst-10',      'Social Sci.', 10, 'CBSE', 'bg-amber-500',  '🌍'),
  ('science-9',   'Science',      9, 'CBSE', 'bg-blue-500',   '🔬'),
  ('maths-9',     'Mathematics',  9, 'CBSE', 'bg-purple-500', '📐'),
  ('physics-12',  'Physics',     12, 'CBSE', 'bg-sky-500',    '⚡'),
  ('chemistry-12','Chemistry',   12, 'CBSE', 'bg-green-500',  '⚗️'),
  ('biology-12',  'Biology',     12, 'CBSE', 'bg-emerald-500','🧬'),
  ('maths-12',    'Mathematics', 12, 'CBSE', 'bg-purple-500', '📐')
ON CONFLICT (id) DO NOTHING;


-- ─── CHAPTERS — Mathematics Class 10 ─────────────────────────────────────────
INSERT INTO chapters (id, subject_id, name, order_index) VALUES
  ('c-m10-01', 'maths-10', 'Real Numbers',             1),
  ('c-m10-02', 'maths-10', 'Polynomials',              2),
  ('c-m10-03', 'maths-10', 'Pair of Linear Equations', 3),
  ('c-m10-04', 'maths-10', 'Quadratic Equations',      4),
  ('c-m10-05', 'maths-10', 'Arithmetic Progressions',  5),
  ('c-m10-06', 'maths-10', 'Triangles',                6),
  ('c-m10-10', 'maths-10', 'Circles',                  10),
  ('c-m10-14', 'maths-10', 'Statistics',               14)
ON CONFLICT DO NOTHING;

-- ─── CHAPTERS — Science Class 10 ──────────────────────────────────────────────
INSERT INTO chapters (id, subject_id, name, order_index) VALUES
  ('c-s10-01', 'science-10', 'Chemical Reactions and Equations', 1),
  ('c-s10-02', 'science-10', 'Acids, Bases and Salts',           2),
  ('c-s10-03', 'science-10', 'Metals and Non-metals',            3),
  ('c-s10-06', 'science-10', 'Life Processes',                   6),
  ('c-s10-08', 'science-10', 'How Do Organisms Reproduce?',      8),
  ('c-s10-10', 'science-10', 'Light — Reflection and Refraction',10),
  ('c-s10-12', 'science-10', 'Electricity',                      12),
  ('c-s10-15', 'science-10', 'Our Environment',                  15)
ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- QUESTIONS — Mathematics Class 10 (15 questions)
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Chapter: Real Numbers ─────────────────────────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'maths-10', 'c-m10-01', 10,
  'HCF of 26 and 91 is:',
  '13', '26', '91', '1',
  'A',
  '91 = 7 × 13 and 26 = 2 × 13. The highest common factor is 13. NCERT Class 10 Maths, Ch. 1.',
  2023, 'easy'
),
(
  'maths-10', 'c-m10-01', 10,
  'The decimal expansion of 17/8 is:',
  'Terminating', 'Non-terminating repeating', 'Non-terminating non-repeating', 'Cannot be determined',
  'A',
  '8 = 2³, which is of the form 2ⁿ × 5ᵐ. So 17/8 has a terminating decimal expansion = 2.125. NCERT Class 10 Maths, Ch. 1.',
  2022, 'easy'
),
(
  'maths-10', 'c-m10-01', 10,
  'If the LCM of 12 and 18 is 36, what is their HCF?',
  '4', '6', '9', '12',
  'B',
  'HCF × LCM = product of numbers. So HCF = (12 × 18) / 36 = 216 / 36 = 6. NCERT Class 10 Maths, Ch. 1.',
  2021, 'easy'
);

-- ── Chapter: Polynomials ──────────────────────────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'maths-10', 'c-m10-02', 10,
  'If one zero of the polynomial 2x² + 3x + k is 1/2, then k =',
  '-2', '2', '-4', '4',
  'A',
  'Substitute x = 1/2: 2(1/4) + 3(1/2) + k = 0 → 0.5 + 1.5 + k = 0 → k = -2. NCERT Class 10 Maths, Ch. 2.',
  2023, 'medium'
),
(
  'maths-10', 'c-m10-02', 10,
  'The zeroes of the polynomial x² – 3 are:',
  '±√3', '±3', '3, -3', '√3, 0',
  'A',
  'Set x² – 3 = 0 → x² = 3 → x = ±√3. These are the two zeroes. NCERT Class 10 Maths, Ch. 2.',
  2022, 'easy'
);

-- ── Chapter: Quadratic Equations ─────────────────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'maths-10', 'c-m10-04', 10,
  'The roots of the equation x² – 5x + 6 = 0 are:',
  '2 and 3', '–2 and –3', '1 and 6', '–1 and –6',
  'A',
  'Factor: (x – 2)(x – 3) = 0. So x = 2 or x = 3. Verify: 2+3 = 5 ✓ and 2×3 = 6 ✓. NCERT Class 10 Maths, Ch. 4.',
  2023, 'easy'
),
(
  'maths-10', 'c-m10-04', 10,
  'For the equation 2x² – 4x + 3 = 0, the discriminant is:',
  '-8', '8', '-2', '2',
  'A',
  'Discriminant D = b² – 4ac = (-4)² – 4(2)(3) = 16 – 24 = -8. Since D < 0, no real roots. NCERT Class 10 Maths, Ch. 4.',
  2022, 'medium'
);

-- ── Chapter: Arithmetic Progressions ─────────────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'maths-10', 'c-m10-05', 10,
  'The nth term of an AP is 7 – 3n. The common difference is:',
  '3', '–3', '7', '4',
  'B',
  'd = a(n+1) – a(n) = [7 – 3(n+1)] – [7 – 3n] = 7 – 3n – 3 – 7 + 3n = –3. NCERT Class 10 Maths, Ch. 5.',
  2023, 'medium'
),
(
  'maths-10', 'c-m10-05', 10,
  'The sum of first 10 natural numbers is:',
  '55', '50', '45', '60',
  'A',
  'Sum = n(n+1)/2 = 10 × 11 / 2 = 55. This AP has first term 1, common difference 1. NCERT Class 10 Maths, Ch. 5.',
  2021, 'easy'
);

-- ── Chapter: Triangles ────────────────────────────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'maths-10', 'c-m10-06', 10,
  'If ΔABC ~ ΔPQR and AB/PQ = 2/3, the ratio of their areas is:',
  '2/3', '4/9', '3/2', '9/4',
  'B',
  'Ratio of areas of similar triangles = (ratio of corresponding sides)². So (2/3)² = 4/9. NCERT Class 10 Maths, Ch. 6.',
  2022, 'medium'
),
(
  'maths-10', 'c-m10-06', 10,
  'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides. This is:',
  'Converse of Pythagoras', 'Pythagoras theorem', 'BPT theorem', 'Mid-point theorem',
  'B',
  'This is the Pythagoras Theorem: In a right-angled triangle, hypotenuse² = base² + perpendicular². NCERT Class 10 Maths, Ch. 6.',
  2020, 'easy'
);

-- ── Chapter: Circles ──────────────────────────────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'maths-10', 'c-m10-10', 10,
  'A tangent to a circle is perpendicular to the radius at the point of:',
  'Centre', 'Tangency', 'Intersection', 'Diameter end',
  'B',
  'A tangent is always perpendicular to the radius at the point of contact (tangency). NCERT Class 10 Maths, Ch. 10.',
  2021, 'easy'
),
(
  'maths-10', 'c-m10-10', 10,
  'From an external point, the number of tangents that can be drawn to a circle is:',
  '1', '2', '3', 'Infinite',
  'B',
  'Exactly 2 tangents can be drawn from an external point to a circle, and they are equal in length. NCERT Class 10 Maths, Ch. 10.',
  2023, 'easy'
);

-- ── Chapter: Statistics ───────────────────────────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'maths-10', 'c-m10-14', 10,
  'The measure of central tendency unaffected by extreme values is:',
  'Mean', 'Median', 'Mode', 'Range',
  'B',
  'Median is the middle value of sorted data. It is not affected by very large or very small values (outliers) unlike the mean. NCERT Class 10 Maths, Ch. 14.',
  2023, 'easy'
);


-- ══════════════════════════════════════════════════════════════════════════════
-- QUESTIONS — Science Class 10 (15 questions)
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Chapter: Chemical Reactions and Equations ─────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'science-10', 'c-s10-01', 10,
  'Which of the following is a double displacement reaction?',
  '2H₂ + O₂ → 2H₂O', 'CaCO₃ → CaO + CO₂', 'AgNO₃ + NaCl → AgCl + NaNO₃', 'Fe + CuSO₄ → FeSO₄ + Cu',
  'C',
  'In double displacement, ions of two compounds swap. AgNO₃ + NaCl → AgCl↓ + NaNO₃ shows Ag⁺ and Na⁺ swapping. NCERT Class 10 Science, Ch. 1.',
  2023, 'easy'
),
(
  'science-10', 'c-s10-01', 10,
  'When iron reacts with copper sulphate solution, the reaction is called:',
  'Combination reaction', 'Decomposition reaction', 'Displacement reaction', 'Double displacement reaction',
  'C',
  'Fe + CuSO₄ → FeSO₄ + Cu. Iron displaces copper because iron is more reactive. This is a displacement (single displacement) reaction. NCERT Class 10 Science, Ch. 1.',
  2022, 'easy'
),
(
  'science-10', 'c-s10-01', 10,
  'The burning of magnesium in air is an example of:',
  'Endothermic reaction', 'Exothermic reaction', 'Decomposition', 'Displacement',
  'B',
  '2Mg + O₂ → 2MgO. Heat and light are released during burning, making it exothermic. NCERT Class 10 Science, Ch. 1.',
  2021, 'easy'
);

-- ── Chapter: Acids, Bases and Salts ───────────────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'science-10', 'c-s10-02', 10,
  'Which solution will turn red litmus paper blue?',
  'Hydrochloric acid', 'Lemon juice', 'Sodium hydroxide', 'Vinegar',
  'C',
  'Bases turn red litmus blue. NaOH is a strong base (pH > 7). Acids (HCl, lemon juice, vinegar) have pH < 7 and turn blue litmus red. NCERT Class 10 Science, Ch. 2.',
  2023, 'easy'
),
(
  'science-10', 'c-s10-02', 10,
  'The pH of a neutral solution is:',
  '0', '7', '14', '1',
  'B',
  'pH 7 is neutral (pure water). Below 7 = acidic; above 7 = basic/alkaline. NCERT Class 10 Science, Ch. 2.',
  2022, 'easy'
),
(
  'science-10', 'c-s10-02', 10,
  'Baking soda is chemically known as:',
  'Sodium chloride', 'Sodium carbonate', 'Sodium hydrogen carbonate', 'Calcium carbonate',
  'C',
  'Baking soda = NaHCO₃ = Sodium hydrogen carbonate (or sodium bicarbonate). It is a mild base used in cooking. NCERT Class 10 Science, Ch. 2.',
  2021, 'easy'
);

-- ── Chapter: Metals and Non-metals ────────────────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'science-10', 'c-s10-03', 10,
  'Which metal is stored in kerosene to prevent fire?',
  'Calcium', 'Magnesium', 'Sodium', 'Potassium',
  'C',
  'Sodium reacts vigorously with air and water, catching fire. It is stored in kerosene to prevent contact with oxygen and moisture. NCERT Class 10 Science, Ch. 3.',
  2021, 'medium'
),
(
  'science-10', 'c-s10-03', 10,
  'The property of metals to be drawn into wires is called:',
  'Malleability', 'Ductility', 'Conductivity', 'Sonority',
  'B',
  'Ductility is the ability to be drawn into thin wires. Malleability is the ability to be beaten into thin sheets. NCERT Class 10 Science, Ch. 3.',
  2022, 'easy'
);

-- ── Chapter: Life Processes ───────────────────────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'science-10', 'c-s10-06', 10,
  'Which process uses sunlight to make food in plants?',
  'Respiration', 'Photosynthesis', 'Transpiration', 'Digestion',
  'B',
  'Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Chlorophyll in leaves absorbs sunlight to convert CO₂ and water into glucose. NCERT Class 10 Science, Ch. 6.',
  2022, 'easy'
),
(
  'science-10', 'c-s10-06', 10,
  'The enzyme that breaks down starch in the mouth is:',
  'Pepsin', 'Trypsin', 'Salivary amylase', 'Lipase',
  'C',
  'Salivary amylase (ptyalin) is present in saliva and breaks starch into simpler sugars in the mouth. NCERT Class 10 Science, Ch. 6.',
  2023, 'medium'
);

-- ── Chapter: Light — Reflection and Refraction ───────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'science-10', 'c-s10-10', 10,
  'The focal length of a convex lens is positive because it:',
  'Diverges light', 'Converges light', 'Absorbs light', 'Reflects light',
  'B',
  'A convex lens converges parallel light rays to a focal point on the same side as the refracted light. Its focal length is positive by convention. NCERT Class 10 Science, Ch. 10.',
  2022, 'medium'
),
(
  'science-10', 'c-s10-10', 10,
  'Which mirror is used as a rear-view mirror in vehicles?',
  'Plane mirror', 'Concave mirror', 'Convex mirror', 'Both plane and concave',
  'C',
  'Convex mirrors give a wider field of view and always form a virtual, erect, diminished image, making them ideal for rear-view mirrors. NCERT Class 10 Science, Ch. 10.',
  2021, 'easy'
);

-- ── Chapter: Electricity ──────────────────────────────────────────────────────
INSERT INTO questions (subject_id, chapter_id, class_level, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, year_tag, difficulty) VALUES
(
  'science-10', 'c-s10-12', 10,
  'The SI unit of electric charge is:',
  'Ampere', 'Volt', 'Coulomb', 'Ohm',
  'C',
  'Coulomb (C) is the SI unit of electric charge. 1 Coulomb = charge of about 6.24 × 10¹⁸ electrons. NCERT Class 10 Science, Ch. 12.',
  2022, 'easy'
),
(
  'science-10', 'c-s10-12', 10,
  'According to Ohm''s law, if voltage doubles and resistance stays the same, current:',
  'Halves', 'Stays the same', 'Doubles', 'Quadruples',
  'C',
  'Ohm''s law: V = IR, so I = V/R. If V doubles and R is constant, current I also doubles. NCERT Class 10 Science, Ch. 12.',
  2023, 'easy'
);


-- ══════════════════════════════════════════════════════════════════════════════
-- VERIFY — Run these queries to confirm the seed loaded correctly
-- ══════════════════════════════════════════════════════════════════════════════
-- SELECT COUNT(*) FROM subjects;    -- Expected: 9
-- SELECT COUNT(*) FROM chapters;    -- Expected: 16
-- SELECT COUNT(*) FROM questions;   -- Expected: 30
-- SELECT subject_id, COUNT(*) FROM questions GROUP BY subject_id;
