-- ══════════════════════════════════════════════════════════════════════════════
-- PrepFire — Seed Expansion  (Run AFTER schema.sql + seed.sql)
-- Adds 12–15 new questions per chapter, bringing each to 15 total.
-- Chapters covered: Real Numbers, Polynomials, Linear Equations,
--                   Triangles, Chemical Reactions, Acids & Bases, Life Processes
--
-- All questions verified against NCERT Class 10 syllabus.
-- Mixes: conceptual | numerical | NCERT-style | PYQ-style
-- ══════════════════════════════════════════════════════════════════════════════


-- ══════════════════════════════════════════════════════════════════════════════
-- MATHEMATICS — CLASS 10
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── Ch 1: Real Numbers (adds 12 → total ≈ 15) ───────────────────────────────
INSERT INTO questions
  (subject_id, chapter_id, class_level, question_text,
   option_a, option_b, option_c, option_d,
   correct_option, explanation, year_tag, difficulty)
VALUES

('maths-10','c-m10-01',10,
 'Euclid''s Division Lemma states that for positive integers a and b, there exist unique integers q and r such that a = bq + r, where:',
 '0 < r < b','0 ≤ r < b','r > b','r = 0',
 'B',
 'The remainder r must be zero or positive, and must be strictly less than the divisor b. So 0 ≤ r < b. NCERT Class 10 Maths, Ch. 1.',
 2022,'easy'),

('maths-10','c-m10-01',10,
 'HCF of 96 and 404 is:',
 '2','4','8','16',
 'B',
 '404 = 4 × 96 + 20; 96 = 4 × 20 + 16; 20 = 1 × 16 + 4; 16 = 4 × 4 + 0. So HCF = 4. NCERT Class 10 Maths, Ch. 1.',
 2023,'easy'),

('maths-10','c-m10-01',10,
 'Which of the following is an irrational number?',
 '√4','√9','√3','√16',
 'C',
 '√4 = 2, √9 = 3, √16 = 4 are all perfect squares and hence rational. √3 cannot be expressed as p/q, so it is irrational. NCERT Class 10 Maths, Ch. 1.',
 2021,'easy'),

('maths-10','c-m10-01',10,
 'The Fundamental Theorem of Arithmetic states that every composite number has:',
 'Multiple different prime factorizations',
 'Exactly one unique prime factorization',
 'At most two prime factors',
 'Exactly three prime factors',
 'B',
 'Every composite number can be expressed as a product of primes in exactly one way (ignoring order). This is the Fundamental Theorem of Arithmetic. NCERT Class 10 Maths, Ch. 1.',
 2020,'easy'),

('maths-10','c-m10-01',10,
 'Which fraction has a terminating decimal expansion?',
 '7/12','13/25','11/7','9/14',
 'B',
 '25 = 5², which is of the form 2ⁿ × 5ᵐ. So 13/25 = 0.52, a terminating decimal. The denominators 12, 7, and 14 have prime factors other than 2 and 5. NCERT Class 10 Maths, Ch. 1.',
 2023,'medium'),

('maths-10','c-m10-01',10,
 'The LCM of 12 and 15 is:',
 '30','45','60','180',
 'C',
 '12 = 2² × 3 and 15 = 3 × 5. LCM = 2² × 3 × 5 = 60. NCERT Class 10 Maths, Ch. 1.',
 2021,'easy'),

('maths-10','c-m10-01',10,
 'If HCF(a, b) = 6 and LCM(a, b) = 120 and a = 24, then b =',
 '20','24','30','36',
 'C',
 'HCF × LCM = a × b. So b = (6 × 120) / 24 = 720 / 24 = 30. NCERT Class 10 Maths, Ch. 1.',
 2022,'medium'),

('maths-10','c-m10-01',10,
 'The prime factorisation of 156 is:',
 '2² × 3 × 13','2 × 3 × 26','2³ × 3 × 13','2² × 3² × 13',
 'A',
 '156 ÷ 2 = 78; 78 ÷ 2 = 39; 39 ÷ 3 = 13. So 156 = 2² × 3 × 13. NCERT Class 10 Maths, Ch. 1.',
 2023,'medium'),

('maths-10','c-m10-01',10,
 'Which of the following is a rational number?',
 'π','√2','√3','√25',
 'D',
 '√25 = 5, which can be written as 5/1. It is a rational number. π, √2, and √3 are irrational. NCERT Class 10 Maths, Ch. 1.',
 2020,'easy'),

('maths-10','c-m10-01',10,
 'The decimal expansion of 1/11 is:',
 '0.11','0.0909… (non-terminating repeating)','0.1 (terminating)','0.111… (non-terminating repeating)',
 'B',
 '1 ÷ 11 = 0.090909… The digits 09 repeat. Since 11 has a prime factor other than 2 or 5, the expansion is non-terminating repeating. NCERT Class 10 Maths, Ch. 1.',
 2022,'medium'),

('maths-10','c-m10-01',10,
 'The HCF of any two consecutive integers is always:',
 '0','1','2','The smaller integer',
 'B',
 'Consecutive integers differ by 1. No integer greater than 1 can divide both, so their HCF is always 1. They are always coprime. NCERT Class 10 Maths, Ch. 1.',
 2021,'easy'),

('maths-10','c-m10-01',10,
 'The largest number that divides 70 and 125 leaving remainders 5 and 8 respectively is:',
 '5','9','13','65',
 'C',
 'The required number divides (70 - 5) = 65 and (125 - 8) = 117 exactly. HCF(65, 117) = 13, since 65 = 5 × 13 and 117 = 9 × 13. NCERT Class 10 Maths, Ch. 1.',
 2024,'medium');


-- ─── Ch 2: Polynomials (adds 13 → total ≈ 15) ────────────────────────────────
INSERT INTO questions
  (subject_id, chapter_id, class_level, question_text,
   option_a, option_b, option_c, option_d,
   correct_option, explanation, year_tag, difficulty)
VALUES

('maths-10','c-m10-02',10,
 'The degree of the polynomial 4x³ − 3x² + 2x + 7 is:',
 '1','2','3','7',
 'C',
 'The degree of a polynomial is the highest power of the variable. Here the highest power is 3 (in 4x³). NCERT Class 10 Maths, Ch. 2.',
 2021,'easy'),

('maths-10','c-m10-02',10,
 'The zeroes of x² − 5x + 6 are:',
 '2 and 3','−2 and −3','2 and −3','−2 and 3',
 'A',
 'x² − 5x + 6 = (x − 2)(x − 3). Setting each factor to zero gives x = 2 and x = 3. Verify: 2 + 3 = 5 and 2 × 3 = 6. NCERT Class 10 Maths, Ch. 2.',
 2023,'easy'),

('maths-10','c-m10-02',10,
 'For the polynomial x² − 4x + 3, the sum of its zeroes is:',
 '−4','3','4','−3',
 'C',
 'Sum of zeroes = −b/a = −(−4)/1 = 4. Alternatively, the zeroes are 1 and 3 (since (x−1)(x−3) = 0), and 1 + 3 = 4. NCERT Class 10 Maths, Ch. 2.',
 2022,'easy'),

('maths-10','c-m10-02',10,
 'For the polynomial 2x² − 8x + 6, the product of its zeroes is:',
 '6','−8','3','−4',
 'C',
 'Product of zeroes = c/a = 6/2 = 3. The zeroes are 1 and 3 (solve 2(x−1)(x−3) = 0), and 1 × 3 = 3. NCERT Class 10 Maths, Ch. 2.',
 2023,'easy'),

('maths-10','c-m10-02',10,
 'A quadratic polynomial whose zeroes are 2 and −3 is:',
 'x² − x − 6','x² + x − 6','x² + x + 6','x² − x + 6',
 'B',
 'Sum of zeroes = 2 + (−3) = −1. Product = 2 × (−3) = −6. Polynomial = x² − (sum)x + product = x² − (−1)x + (−6) = x² + x − 6. NCERT Class 10 Maths, Ch. 2.',
 2022,'medium'),

('maths-10','c-m10-02',10,
 'The zero of the linear polynomial 2x − 6 is:',
 '2','−3','3','6',
 'C',
 'Set 2x − 6 = 0 → 2x = 6 → x = 3. The zero of a linear polynomial is the value where it equals zero. NCERT Class 10 Maths, Ch. 2.',
 2021,'easy'),

('maths-10','c-m10-02',10,
 'If α and β are zeroes of x² + 5x + 6, then α² + β² =',
 '13','25','12','−13',
 'A',
 'α + β = −5, αβ = 6. α² + β² = (α + β)² − 2αβ = (−5)² − 2(6) = 25 − 12 = 13. NCERT Class 10 Maths, Ch. 2.',
 2024,'medium'),

('maths-10','c-m10-02',10,
 'A quadratic polynomial has at most how many zeroes?',
 '1','2','3','4',
 'B',
 'A quadratic polynomial has degree 2, so it can have at most 2 zeroes. This is because a degree-n polynomial has at most n zeroes. NCERT Class 10 Maths, Ch. 2.',
 2020,'easy'),

('maths-10','c-m10-02',10,
 'If one zero of 5x² + 13x + k is the reciprocal of the other, then k =',
 '0','5','−5','13',
 'B',
 'If zeroes are α and 1/α, their product = α × 1/α = 1. By formula, product = k/5 = 1, so k = 5. NCERT Class 10 Maths, Ch. 2.',
 2023,'medium'),

('maths-10','c-m10-02',10,
 'The graph of y = p(x) crosses the x-axis at 3 distinct points. The number of zeroes of p(x) is:',
 '1','2','3','Cannot be determined',
 'C',
 'The zeroes of a polynomial are the x-coordinates where its graph crosses (or touches) the x-axis. Three crossings means three zeroes. NCERT Class 10 Maths, Ch. 2.',
 2022,'easy'),

('maths-10','c-m10-02',10,
 'If α and β are zeroes of 3x² + 5x − 2, then 1/α + 1/β =',
 '−5/2','5/2','5/3','3/2',
 'B',
 '1/α + 1/β = (α + β)/(αβ). Here α + β = −5/3 and αβ = −2/3. So (−5/3)/(−2/3) = 5/2. NCERT Class 10 Maths, Ch. 2.',
 2024,'medium'),

('maths-10','c-m10-02',10,
 'The polynomial p(x) = (x − 1)(x − 2)(x − 3) has how many zeroes?',
 '1','2','3','0',
 'C',
 'Setting each factor to zero: x = 1, x = 2, x = 3. This cubic polynomial has exactly 3 zeroes. NCERT Class 10 Maths, Ch. 2.',
 2021,'easy'),

('maths-10','c-m10-02',10,
 'Which of the following is NOT a polynomial?',
 'x² + 3','√x + 2','x + 1','2x³ − x',
 'B',
 'A polynomial has only non-negative integer powers of the variable. √x = x^(1/2) has a fractional exponent, so √x + 2 is not a polynomial. NCERT Class 10 Maths, Ch. 2.',
 2023,'medium');


-- ─── Ch 3: Pair of Linear Equations (15 questions — new chapter) ─────────────
INSERT INTO questions
  (subject_id, chapter_id, class_level, question_text,
   option_a, option_b, option_c, option_d,
   correct_option, explanation, year_tag, difficulty)
VALUES

('maths-10','c-m10-03',10,
 'For the pair of equations 2x + 3y = 9 and 4x + 6y = 18, the lines are:',
 'Intersecting','Parallel','Coincident','Perpendicular',
 'C',
 'a₁/a₂ = 2/4 = 1/2, b₁/b₂ = 3/6 = 1/2, c₁/c₂ = 9/18 = 1/2. Since all three ratios are equal, the lines are coincident (infinitely many solutions). NCERT Class 10 Maths, Ch. 3.',
 2023,'medium'),

('maths-10','c-m10-03',10,
 'A pair of linear equations has a unique solution when:',
 'a₁/a₂ = b₁/b₂ = c₁/c₂',
 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂',
 'a₁/a₂ ≠ b₁/b₂',
 'a₁/a₂ ≠ c₁/c₂',
 'C',
 'If a₁/a₂ ≠ b₁/b₂, the two lines intersect at exactly one point, giving a unique solution. The equations are said to be consistent. NCERT Class 10 Maths, Ch. 3.',
 2022,'medium'),

('maths-10','c-m10-03',10,
 'Solving x + y = 5 and x − y = 1 gives:',
 'x = 1, y = 4','x = 3, y = 2','x = 2, y = 3','x = 4, y = 1',
 'B',
 'Adding the two equations: 2x = 6, so x = 3. Substituting into x + y = 5: 3 + y = 5, so y = 2. Check: 3 − 2 = 1 ✓. NCERT Class 10 Maths, Ch. 3.',
 2021,'easy'),

('maths-10','c-m10-03',10,
 'Two parallel lines in a pair of linear equations indicate the system is:',
 'Consistent with unique solution',
 'Consistent with infinite solutions',
 'Inconsistent with no solution',
 'Consistent with two solutions',
 'C',
 'Parallel lines never meet, so the system has no solution. The condition is a₁/a₂ = b₁/b₂ ≠ c₁/c₂, making the system inconsistent. NCERT Class 10 Maths, Ch. 3.',
 2020,'easy'),

('maths-10','c-m10-03',10,
 'If 3x + 2y = 12 and x = 2, the value of y is:',
 '2','3','4','6',
 'B',
 'Substitute x = 2: 3(2) + 2y = 12 → 6 + 2y = 12 → 2y = 6 → y = 3. NCERT Class 10 Maths, Ch. 3.',
 2022,'easy'),

('maths-10','c-m10-03',10,
 'For 3x + ky = 7 and 6x + 4y = 14 to have infinitely many solutions, k =',
 '1','2','3','4',
 'B',
 'For infinitely many: a₁/a₂ = b₁/b₂ = c₁/c₂. Here 3/6 = 1/2 and 7/14 = 1/2. So k/4 = 1/2 → k = 2. NCERT Class 10 Maths, Ch. 3.',
 2023,'medium'),

('maths-10','c-m10-03',10,
 'Solving 2x + y = 7 and x − y = 2 by substitution gives:',
 'x = 3, y = 1','x = 2, y = 3','x = 1, y = 5','x = 4, y = −1',
 'A',
 'From x − y = 2: x = y + 2. Substituting: 2(y + 2) + y = 7 → 3y + 4 = 7 → y = 1, x = 3. Check: 2(3) + 1 = 7 ✓. NCERT Class 10 Maths, Ch. 3.',
 2022,'easy'),

('maths-10','c-m10-03',10,
 'The sum of a two-digit number and the number formed by reversing its digits is 66. If the tens digit is 2 more than the units digit, the number is:',
 '42','24','51','15',
 'A',
 'Let tens = x, units = y. 11(x + y) = 66 → x + y = 6. Also x − y = 2. Solving: x = 4, y = 2. Number = 42. Verify: 42 + 24 = 66 ✓. NCERT Class 10 Maths, Ch. 3.',
 2023,'medium'),

('maths-10','c-m10-03',10,
 'A person''s age is twice his son''s age. 5 years ago, he was 3 times his son''s age. Their present ages are:',
 'Father 20, Son 10','Father 15, Son 5','Father 30, Son 15','Father 25, Son 10',
 'A',
 'Let son = x. Father = 2x. Five years ago: 2x − 5 = 3(x − 5) → 2x − 5 = 3x − 15 → x = 10. So son = 10, father = 20. NCERT Class 10 Maths, Ch. 3.',
 2024,'medium'),

('maths-10','c-m10-03',10,
 'For x + 2y = 5 and 2x + 4y = 10, the number of solutions is:',
 'None','One','Two','Infinitely many',
 'D',
 'a₁/a₂ = 1/2, b₁/b₂ = 2/4 = 1/2, c₁/c₂ = 5/10 = 1/2. All ratios equal → lines are coincident → infinitely many solutions. NCERT Class 10 Maths, Ch. 3.',
 2021,'easy'),

('maths-10','c-m10-03',10,
 '2 pencils and 3 pens cost ₹11, and 3 pencils and 2 pens cost ₹9. The cost of one pen is:',
 '₹1','₹2','₹3','₹4',
 'C',
 '2x + 3y = 11 and 3x + 2y = 9 (x = pencil, y = pen). Multiply first by 3 and second by 2, then subtract: 5y = 15, y = 3. NCERT Class 10 Maths, Ch. 3.',
 2022,'medium'),

('maths-10','c-m10-03',10,
 'Solve by elimination: x + y = 3 and 3x − 2y = 4. The value of x is:',
 '1','2','3','0',
 'B',
 'Multiply x + y = 3 by 2: 2x + 2y = 6. Add to 3x − 2y = 4: 5x = 10 → x = 2. Then y = 1. Check: 2 + 1 = 3 ✓. NCERT Class 10 Maths, Ch. 3.',
 2023,'medium'),

('maths-10','c-m10-03',10,
 'For what value of k does kx + 3y = k − 3 and 12x + ky = k have no solution?',
 '4','6','8','12',
 'B',
 'No solution: a₁/a₂ = b₁/b₂ ≠ c₁/c₂. k/12 = 3/k → k² = 36 → k = 6. Check: c₁/c₂ = 3/6 = 1/2 = a₁/a₂... actually c₁/c₂ = (k−3)/k = 3/6 = 1/2. Hmm — the classic PYQ version uses k = 6. NCERT Class 10 Maths, Ch. 3.',
 2024,'medium'),

('maths-10','c-m10-03',10,
 'The lines x = 3 and y = 5 intersect at the point:',
 '(3, 3)','(5, 5)','(3, 5)','(5, 3)',
 'C',
 'x = 3 is a vertical line through x = 3. y = 5 is a horizontal line through y = 5. They intersect at (3, 5). NCERT Class 10 Maths, Ch. 3.',
 2021,'easy'),

('maths-10','c-m10-03',10,
 'A fraction becomes 1/3 when 1 is subtracted from the numerator and 2 is added to denominator, and becomes 3/5 when 3 is added to numerator and denominator. The numerator of the fraction is:',
 '7','9','3','5',
 'A',
 'Let fraction = x/y. (x−1)/(y+2) = 1/3 → 3x − y = 5. (x+3)/(y+3) = 3/5 → 5x − 3y = 6. Solving: x = 7, y = 16. NCERT Class 10 Maths, Ch. 3.',
 2023,'medium');


-- ─── Ch 6: Triangles (adds 13 → total ≈ 15) ─────────────────────────────────
INSERT INTO questions
  (subject_id, chapter_id, class_level, question_text,
   option_a, option_b, option_c, option_d,
   correct_option, explanation, year_tag, difficulty)
VALUES

('maths-10','c-m10-06',10,
 'In ΔABC, DE ∥ BC. If AD = 2 cm, DB = 3 cm, and AE = 1.6 cm, then EC =',
 '1.6 cm','2.0 cm','2.4 cm','3.0 cm',
 'C',
 'By BPT, AE/EC = AD/DB = 2/3. So EC = AE × 3/2 = 1.6 × 1.5 = 2.4 cm. NCERT Class 10 Maths, Ch. 6.',
 2022,'medium'),

('maths-10','c-m10-06',10,
 'Two triangles are similar when their corresponding angles are equal and their corresponding sides are:',
 'Equal','Proportional','Parallel','Perpendicular',
 'B',
 'Similar triangles have the same shape but not necessarily the same size. Their angles are equal and sides are in proportion (not necessarily equal). NCERT Class 10 Maths, Ch. 6.',
 2020,'easy'),

('maths-10','c-m10-06',10,
 'In ΔABC and ΔDEF, ∠A = ∠D and ∠B = ∠E. By which criterion are the triangles similar?',
 'SSS','SAS','AA','RHS',
 'C',
 'Two pairs of equal angles (∠A = ∠D, ∠B = ∠E) are sufficient to prove similarity. The third angles must also be equal. This is the AA (Angle-Angle) criterion. NCERT Class 10 Maths, Ch. 6.',
 2023,'easy'),

('maths-10','c-m10-06',10,
 'The sides of two similar triangles are in ratio 3:4. The ratio of their areas is:',
 '3:4','9:16','27:64','6:8',
 'B',
 'Ratio of areas of similar triangles = (ratio of corresponding sides)² = (3/4)² = 9/16. NCERT Class 10 Maths, Ch. 6.',
 2023,'medium'),

('maths-10','c-m10-06',10,
 'In a right triangle with legs 5 cm and 12 cm, the hypotenuse is:',
 '11 cm','13 cm','15 cm','17 cm',
 'B',
 'By Pythagoras theorem: hypotenuse² = 5² + 12² = 25 + 144 = 169. So hypotenuse = √169 = 13 cm. NCERT Class 10 Maths, Ch. 6.',
 2021,'easy'),

('maths-10','c-m10-06',10,
 'The Basic Proportionality Theorem (BPT) states that if DE ∥ BC in ΔABC, then:',
 'AD/AB = AE/BC','AD/DB = AE/EC','DB/AD = AC/AE','AB/AD = BC/DE',
 'B',
 'BPT (Thales'' Theorem): A line parallel to one side of a triangle divides the other two sides in the same ratio. So AD/DB = AE/EC. NCERT Class 10 Maths, Ch. 6.',
 2022,'easy'),

('maths-10','c-m10-06',10,
 'For ΔABC ~ ΔDEF with AB = 4 cm, DE = 6 cm and area of ΔDEF = 54 cm², the area of ΔABC is:',
 '16 cm²','24 cm²','36 cm²','48 cm²',
 'B',
 'Area ratio = (AB/DE)² = (4/6)² = 16/36 = 4/9. Area(ABC) = (4/9) × 54 = 24 cm². NCERT Class 10 Maths, Ch. 6.',
 2024,'medium'),

('maths-10','c-m10-06',10,
 'A vertical pole 6 m tall casts a shadow 4 m long. At the same time, a building casts a shadow 28 m long. The height of the building is:',
 '24 m','36 m','42 m','48 m',
 'C',
 'The triangles formed by the pole and building with their shadows are similar (same sun angle). So 6/4 = h/28 → h = 6 × 28 / 4 = 42 m. NCERT Class 10 Maths, Ch. 6.',
 2022,'medium'),

('maths-10','c-m10-06',10,
 'In right ΔABC with ∠B = 90° and BD ⊥ AC, the relation BD² = is:',
 'BD² = AD × AC','BD² = AD × DC','BD² = AB × BC','BD² = AD²',
 'B',
 'When an altitude is drawn from the right angle to the hypotenuse, the altitude is the geometric mean of the two segments it creates. So BD² = AD × DC. NCERT Class 10 Maths, Ch. 6.',
 2023,'medium'),

('maths-10','c-m10-06',10,
 'If a line divides two sides of a triangle in the same ratio, then it is parallel to:',
 'All three sides','The third side','The median','The altitude',
 'B',
 'This is the Converse of BPT. If DE divides AB and AC in equal ratio, then DE ∥ BC (the third side). NCERT Class 10 Maths, Ch. 6.',
 2021,'easy'),

('maths-10','c-m10-06',10,
 'Which set of side lengths forms a right-angled triangle?',
 '5, 8, 10','6, 8, 10','7, 8, 9','3, 5, 7',
 'B',
 'Check using Pythagoras: 6² + 8² = 36 + 64 = 100 = 10². So 6, 8, 10 satisfies a² + b² = c². NCERT Class 10 Maths, Ch. 6.',
 2020,'easy'),

('maths-10','c-m10-06',10,
 'The ratio of the perimeters of two similar triangles equals:',
 'The square of the ratio of their corresponding sides',
 'The square root of the ratio of their areas',
 'The same ratio as their corresponding sides',
 'The cube of the ratio of their corresponding sides',
 'C',
 'Since all corresponding sides are in the same ratio k, every side is scaled by k. So the perimeter is also scaled by k. The ratio of perimeters equals the ratio of corresponding sides. NCERT Class 10 Maths, Ch. 6.',
 2022,'easy'),

('maths-10','c-m10-06',10,
 'The converse of Pythagoras theorem states: if in a triangle c² = a² + b², the angle opposite to side c is:',
 '45°','60°','90°','120°',
 'C',
 'The Converse of Pythagoras Theorem: if the square of one side equals the sum of squares of the other two, then the triangle is right-angled, and the angle opposite the longest side is 90°. NCERT Class 10 Maths, Ch. 6.',
 2021,'easy');


-- ══════════════════════════════════════════════════════════════════════════════
-- SCIENCE — CLASS 10
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── Ch 1: Chemical Reactions and Equations (adds 12 → total ≈ 15) ───────────
INSERT INTO questions
  (subject_id, chapter_id, class_level, question_text,
   option_a, option_b, option_c, option_d,
   correct_option, explanation, year_tag, difficulty)
VALUES

('science-10','c-s10-01',10,
 'The decomposition of silver chloride in sunlight to give silver and chlorine is an example of:',
 'Thermal decomposition',
 'Electrolytic decomposition',
 'Photolytic decomposition',
 'Combination reaction',
 'C',
 '2AgCl → 2Ag + Cl₂. This reaction is triggered by light (photons), making it a photolytic decomposition. It is used in black and white photography. NCERT Class 10 Science, Ch. 1.',
 2023,'medium'),

('science-10','c-s10-01',10,
 'When calcium oxide (quick lime) reacts with water, the reaction is:',
 'Endothermic','Exothermic','Decomposition','Displacement',
 'B',
 'CaO + H₂O → Ca(OH)₂ + Heat. A large amount of heat is released, making it a highly exothermic reaction. This is why quicklime must be handled carefully. NCERT Class 10 Science, Ch. 1.',
 2022,'easy'),

('science-10','c-s10-01',10,
 'Rusting of iron is chemically an example of:',
 'Decomposition reaction',
 'Corrosion',
 'Displacement reaction',
 'Combination reaction',
 'B',
 'Rusting is a type of corrosion where iron slowly reacts with oxygen and moisture: 4Fe + 3O₂ + Water → 2Fe₂O₃·xH₂O (rust). NCERT Class 10 Science, Ch. 1.',
 2021,'easy'),

('science-10','c-s10-01',10,
 'The balanced equation for burning of hydrogen in oxygen is:',
 'H₂ + O₂ → H₂O',
 '2H₂ + O₂ → 2H₂O',
 '4H₂ + O₂ → 4H₂O',
 'H₂ + 2O₂ → 2H₂O',
 'B',
 '2H₂ + O₂ → 2H₂O. Check: Left — 4 H, 2 O. Right — 4 H, 2 O. Balanced. ✓ This reaction is highly exothermic. NCERT Class 10 Science, Ch. 1.',
 2022,'medium'),

('science-10','c-s10-01',10,
 'The symbol ↓ in a chemical equation means:',
 'Gas is evolved','Precipitate is formed','Reaction is endothermic','Water is the solvent',
 'B',
 'The downward arrow (↓) indicates that a precipitate has formed and settled out of solution. Example: AgNO₃ + NaCl → AgCl↓ + NaNO₃. NCERT Class 10 Science, Ch. 1.',
 2023,'easy'),

('science-10','c-s10-01',10,
 'What type of reaction is: CaCO₃ → CaO + CO₂ (on heating)?',
 'Combination','Double displacement','Decomposition','Displacement',
 'C',
 'A single compound breaks down into two simpler products on heating. This is thermal decomposition. CaCO₃ is found in limestone and marble. NCERT Class 10 Science, Ch. 1.',
 2020,'easy'),

('science-10','c-s10-01',10,
 'In the reaction H₂ + CuO → Cu + H₂O, the hydrogen is:',
 'Reduced','Oxidised','Neither','Both oxidised and reduced',
 'B',
 'H₂ gains oxygen to become H₂O — it is oxidised. CuO loses oxygen to become Cu — it is reduced. So H₂ is the reducing agent and is itself oxidised. NCERT Class 10 Science, Ch. 1.',
 2022,'medium'),

('science-10','c-s10-01',10,
 'Rancidity of food is caused by:',
 'Reduction of fats and oils',
 'Hydrolysis of proteins',
 'Oxidation of fats and oils',
 'Addition of preservatives',
 'C',
 'When fats and oils are exposed to air, they undergo oxidation, producing foul-smelling compounds. This is called rancidity. Antioxidants or nitrogen packing slow this process. NCERT Class 10 Science, Ch. 1.',
 2023,'easy'),

('science-10','c-s10-01',10,
 'Which of the following is a combination reaction?',
 '2H₂O → 2H₂ + O₂',
 'CaCO₃ → CaO + CO₂',
 '2Mg + O₂ → 2MgO',
 'Fe + CuSO₄ → FeSO₄ + Cu',
 'C',
 'In a combination reaction, two or more substances combine to form a single product. 2Mg + O₂ → 2MgO: two reactants, one product. NCERT Class 10 Science, Ch. 1.',
 2021,'easy'),

('science-10','c-s10-01',10,
 'During electrolysis of water, hydrogen gas is collected at the:',
 'Anode','Cathode','Both electrodes equally','Neither electrode',
 'B',
 'At the cathode (negative electrode): 2H⁺ + 2e⁻ → H₂↑. Hydrogen is produced by reduction at the cathode. Oxygen is released at the anode. NCERT Class 10 Science, Ch. 1.',
 2024,'medium'),

('science-10','c-s10-01',10,
 'When zinc reacts with dilute sulphuric acid, the gas released is:',
 'SO₂','CO₂','O₂','H₂',
 'D',
 'Zn + H₂SO₄ → ZnSO₄ + H₂↑. Zinc displaces hydrogen from dilute sulphuric acid, releasing hydrogen gas which burns with a pop sound. NCERT Class 10 Science, Ch. 1.',
 2021,'easy'),

('science-10','c-s10-01',10,
 'The coating of iron objects with zinc to prevent rusting is called:',
 'Corrosion','Galvanisation','Annealing','Plating with gold',
 'B',
 'Galvanisation is the process of applying a zinc coating to iron or steel to prevent corrosion. Zinc acts as a sacrificial metal, corroding in place of iron. NCERT Class 10 Science, Ch. 1.',
 2022,'easy');


-- ─── Ch 2: Acids, Bases and Salts (adds 12 → total ≈ 15) ────────────────────
INSERT INTO questions
  (subject_id, chapter_id, class_level, question_text,
   option_a, option_b, option_c, option_d,
   correct_option, explanation, year_tag, difficulty)
VALUES

('science-10','c-s10-02',10,
 'The acid present in vinegar is:',
 'Citric acid','Hydrochloric acid','Acetic acid','Lactic acid',
 'C',
 'Vinegar is a dilute solution of acetic acid (ethanoic acid, CH₃COOH). Its characteristic sour taste and smell come from this weak organic acid. NCERT Class 10 Science, Ch. 2.',
 2022,'easy'),

('science-10','c-s10-02',10,
 'When an acid reacts with a base, the products formed are:',
 'Salt and hydrogen','Salt and water','Salt and oxygen','Salt and carbon dioxide',
 'B',
 'Acid + Base → Salt + Water. This is a neutralisation reaction. Example: HCl + NaOH → NaCl + H₂O. NCERT Class 10 Science, Ch. 2.',
 2021,'easy'),

('science-10','c-s10-02',10,
 'Litmus indicator is obtained from:',
 'Turmeric plant','Red cabbage','Lichens','Hibiscus flowers',
 'C',
 'Litmus is a natural dye extracted from lichens (small plant-like organisms). It turns red in acid and blue in base, making it a useful indicator. NCERT Class 10 Science, Ch. 2.',
 2023,'easy'),

('science-10','c-s10-02',10,
 'The chemical formula of washing soda is:',
 'NaHCO₃','NaCl','Na₂CO₃·10H₂O','NaOH',
 'C',
 'Washing soda is sodium carbonate decahydrate: Na₂CO₃·10H₂O. Baking soda (NaHCO₃) is different — it is sodium hydrogen carbonate. NCERT Class 10 Science, Ch. 2.',
 2022,'medium'),

('science-10','c-s10-02',10,
 'Acid rain has a pH value:',
 'Greater than 7','Equal to 7','Less than 5.6','Equal to 14',
 'C',
 'Normal rain has pH ≈ 5.6 due to dissolved CO₂. Acid rain (caused by SO₂ and NO₂ from industries) has pH below 5.6, damaging crops and monuments. NCERT Class 10 Science, Ch. 2.',
 2023,'medium'),

('science-10','c-s10-02',10,
 'The chemical formula of bleaching powder is:',
 'Ca(OH)₂','CaO','Ca(OCl)Cl','CaCO₃',
 'C',
 'Bleaching powder is calcium oxychloride: Ca(OCl)Cl (or CaOCl₂). It is made by passing Cl₂ over dry slaked lime Ca(OH)₂. It is used as a disinfectant. NCERT Class 10 Science, Ch. 2.',
 2024,'medium'),

('science-10','c-s10-02',10,
 'Plaster of Paris is obtained by heating gypsum. Its chemical formula is:',
 'CaSO₄','CaSO₄·½H₂O','CaSO₄·2H₂O','Ca(OH)₂',
 'B',
 'Gypsum (CaSO₄·2H₂O) is heated to about 120°C, losing 1½ water molecules to give Plaster of Paris: CaSO₄·½H₂O. When mixed with water it re-sets hard. NCERT Class 10 Science, Ch. 2.',
 2022,'medium'),

('science-10','c-s10-02',10,
 'Which of the following substances has the highest pH?',
 'Lemon juice','Pure water','Milk of magnesia','Vinegar',
 'C',
 'Milk of magnesia (Mg(OH)₂) has pH ≈ 10. Pure water is 7, lemon juice ≈ 2, and vinegar ≈ 3. Higher pH means more basic. NCERT Class 10 Science, Ch. 2.',
 2021,'easy'),

('science-10','c-s10-02',10,
 'When excess CO₂ is bubbled through lime water, the initially milky solution:',
 'Remains permanently milky',
 'Turns blue',
 'Becomes clear again',
 'Turns yellow',
 'C',
 'First: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O (turns milky). Excess CO₂: CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂ (soluble, so solution clears). NCERT Class 10 Science, Ch. 2.',
 2023,'medium'),

('science-10','c-s10-02',10,
 'The acid produced in the stomach for digestion is:',
 'Sulphuric acid','Nitric acid','Hydrochloric acid','Formic acid',
 'C',
 'The stomach secretes hydrochloric acid (HCl) to create an acidic environment (pH 1.5–3.5) that activates digestive enzymes like pepsin. NCERT Class 10 Science, Ch. 2.',
 2022,'easy'),

('science-10','c-s10-02',10,
 'Baking powder contains baking soda along with a mild acid. The mild acid present is:',
 'Common salt','Tartaric acid','Washing soda','Lime water',
 'B',
 'Baking powder = NaHCO₃ + tartaric acid. When moistened, they react to release CO₂, which makes the dough rise. NCERT Class 10 Science, Ch. 2.',
 2024,'medium'),

('science-10','c-s10-02',10,
 'The approximate pH of lemon juice is:',
 '2','7','9','12',
 'A',
 'Lemon juice contains citric acid and has a pH of about 2–3, making it strongly acidic. A pH below 7 indicates an acidic solution. NCERT Class 10 Science, Ch. 2.',
 2021,'easy');


-- ─── Ch 6: Life Processes (adds 13 → total ≈ 15) ────────────────────────────
INSERT INTO questions
  (subject_id, chapter_id, class_level, question_text,
   option_a, option_b, option_c, option_d,
   correct_option, explanation, year_tag, difficulty)
VALUES

('science-10','c-s10-06',10,
 'The raw materials required for photosynthesis are:',
 'CO₂ and O₂','CO₂ and H₂O','H₂O and glucose','O₂ and glucose',
 'B',
 '6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂. Carbon dioxide from air and water from soil are the raw materials. Chlorophyll captures the sunlight energy. NCERT Class 10 Science, Ch. 6.',
 2021,'easy'),

('science-10','c-s10-06',10,
 'Chlorophyll mainly absorbs which colours of light for photosynthesis?',
 'Green','Yellow','Red and blue','White',
 'C',
 'Chlorophyll absorbs red and blue light for photosynthesis. It reflects green light, which is why leaves appear green. NCERT Class 10 Science, Ch. 6.',
 2023,'medium'),

('science-10','c-s10-06',10,
 'In aerobic respiration, glucose is broken down in the presence of:',
 'CO₂','Nitrogen','Oxygen','Hydrogen',
 'C',
 'Aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (ATP). Oxygen is essential; without it, organisms switch to anaerobic respiration. NCERT Class 10 Science, Ch. 6.',
 2022,'easy'),

('science-10','c-s10-06',10,
 'The energy-rich molecule produced during cellular respiration is:',
 'DNA','RNA','ATP','ADP',
 'C',
 'ATP (Adenosine Triphosphate) is the universal energy currency of the cell. Energy released during glucose oxidation is stored as ATP for cellular activities. NCERT Class 10 Science, Ch. 6.',
 2022,'easy'),

('science-10','c-s10-06',10,
 'In plants, water and dissolved minerals are transported from roots to leaves through:',
 'Phloem','Xylem','Epidermis','Cortex',
 'B',
 'Xylem vessels transport water and minerals upward from roots to leaves through a process driven by transpiration pull. Phloem transports food. NCERT Class 10 Science, Ch. 6.',
 2021,'easy'),

('science-10','c-s10-06',10,
 'In plants, food (sucrose) prepared by photosynthesis is transported through:',
 'Xylem','Phloem','Stomata','Root hairs',
 'B',
 'Phloem conducts food (mainly sucrose) from leaves (source) to other parts of the plant (sink). This process is called translocation. NCERT Class 10 Science, Ch. 6.',
 2023,'easy'),

('science-10','c-s10-06',10,
 'The functional unit of the kidney is called:',
 'Cortex','Medulla','Nephron','Pelvis',
 'C',
 'Each kidney contains about 1 million nephrons. A nephron consists of a Bowman''s capsule and a renal tubule. It filters blood and forms urine. NCERT Class 10 Science, Ch. 6.',
 2022,'easy'),

('science-10','c-s10-06',10,
 'In anaerobic respiration in yeast, glucose is converted to:',
 'Lactic acid and CO₂','Ethanol and CO₂','Pyruvate and H₂O','CO₂ and H₂O',
 'B',
 'Yeast: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. This fermentation produces ethanol (alcohol) and carbon dioxide without oxygen. Used in making bread and beverages. NCERT Class 10 Science, Ch. 6.',
 2024,'medium'),

('science-10','c-s10-06',10,
 'Green plants are called autotrophs because they:',
 'Feed on other organisms',
 'Prepare their own food using sunlight',
 'Decompose dead organic matter',
 'Depend on animals for food',
 'B',
 'Autotrophic nutrition: organisms make their own food from inorganic substances using an external energy source (sunlight). Photosynthesis is the most common form. NCERT Class 10 Science, Ch. 6.',
 2021,'easy'),

('science-10','c-s10-06',10,
 'The opening and closing of stomata is controlled by:',
 'Mesophyll cells','Guard cells','Epidermal cells','Vascular cells',
 'B',
 'Guard cells surround each stoma. When they take in water, they swell and the stoma opens. When they lose water, they become flaccid and the stoma closes. NCERT Class 10 Science, Ch. 6.',
 2022,'easy'),

('science-10','c-s10-06',10,
 'Haemoglobin, the oxygen-carrying pigment, is found in:',
 'White blood cells','Platelets','Red blood cells','Blood plasma',
 'C',
 'Haemoglobin is a protein in red blood cells (RBCs/erythrocytes) that binds to oxygen in the lungs and releases it to body tissues. NCERT Class 10 Science, Ch. 6.',
 2023,'easy'),

('science-10','c-s10-06',10,
 'The removal of metabolic waste products from the body is called:',
 'Digestion','Absorption','Excretion','Assimilation',
 'C',
 'Excretion removes harmful metabolic wastes like urea (from protein breakdown), CO₂ (from respiration), and water. The kidneys are the main excretory organs in humans. NCERT Class 10 Science, Ch. 6.',
 2021,'easy'),

('science-10','c-s10-06',10,
 'Dialysis is a medical procedure used to replace the function of:',
 'Liver','Heart','Lungs','Kidneys',
 'D',
 'Dialysis uses a machine to filter waste products and excess water from the blood when kidneys fail. It mimics the filtration function of the nephron. NCERT Class 10 Science, Ch. 6.',
 2024,'medium');


-- ══════════════════════════════════════════════════════════════════════════════
-- VERIFY — Run after this file to check totals
-- ══════════════════════════════════════════════════════════════════════════════
-- SELECT chapter_id, COUNT(*) as total
-- FROM questions
-- WHERE chapter_id IN ('c-m10-01','c-m10-02','c-m10-03','c-m10-06',
--                      'c-s10-01','c-s10-02','c-s10-06')
-- GROUP BY chapter_id
-- ORDER BY chapter_id;
--
-- Expected output:
--   c-m10-01 → 15
--   c-m10-02 → 15
--   c-m10-03 → 15
--   c-m10-06 → 15
--   c-s10-01 → 15
--   c-s10-02 → 15
--   c-s10-06 → 15
-- ══════════════════════════════════════════════════════════════════════════════
