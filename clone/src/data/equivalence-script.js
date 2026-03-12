/* ------------------------------------------------------------------ */
/*  Equivalence lesson script — declarative tutor dialogue + actions   */
/* ------------------------------------------------------------------ */

export const EXPLORE_STEPS = [
  {
    tutorSays:
      "Welcome! Today we're going to discover something amazing about fractions. Ready?",
    waitFor: null,
    target: null,
    hint: null,
    hintDelayMs: null,
    autoAdvanceMs: 2500,
  },
  {
    tutorSays:
      "Look at the reference bar above — it's split into 2 equal pieces, and one is shaded. Can you shade your bar to match? Tap a piece!",
    waitFor: "shade",
    target: { shadedCount: 1 },
    hint: "Tap one of the two pieces to shade it.",
    hintDelayMs: 6000,
    autoAdvanceMs: null,
  },
  {
    tutorSays:
      "That's 1/2 — one out of two equal pieces! Now let's see what happens when we split. Tap the Split button, then tap each piece to cut it in half!",
    waitFor: "split",
    target: { pieces: 4 },
    hint: "Tap the Split button, then tap a piece to split it!",
    hintDelayMs: 6000,
    autoAdvanceMs: null,
  },
  {
    tutorSays:
      "Look — you split each piece, but the shaded area didn't change! 2 out of 4 pieces are shaded now, and it covers the exact same amount. 1/2 = 2/4!",
    waitFor: "confirm",
    target: null,
    hint: null,
    hintDelayMs: null,
    autoAdvanceMs: null,
  },
  {
    tutorSays:
      "Let's keep going. Tap Split, then tap each piece to split them again!",
    waitFor: "split",
    target: { pieces: 8 },
    hint: "Tap Split, then tap each piece to split them!",
    hintDelayMs: 6000,
    autoAdvanceMs: null,
  },
  {
    tutorSays:
      "Now you have 8 pieces! The shaded area still covers the same amount as 1/2 — that's 4/8!",
    waitFor: null,
    target: null,
    hint: null,
    hintDelayMs: null,
    autoAdvanceMs: 3500,
  },
  {
    tutorSays:
      "1/2 = 2/4 = 4/8 — they all represent the same amount! When you split every piece equally, the fraction stays equivalent.",
    waitFor: null,
    target: null,
    hint: null,
    hintDelayMs: null,
    autoAdvanceMs: 3500,
  },
  {
    tutorSays:
      "Great job exploring! Now let's practice making equivalent fractions on your own. Tap Got It! when you're ready.",
    waitFor: "confirm",
    target: null,
    hint: null,
    hintDelayMs: null,
    autoAdvanceMs: null,
  },
];

export const PRACTICE_STEPS = [
  {
    tutorSays:
      "Make a fraction equivalent to 1/3. Tap Split, then tap pieces to divide them. Shade pieces until your bar matches!",
    reference: { numerator: 1, denominator: 3 },
    waitFor: "match",
    hint: "Tap Split, then tap each piece to get 6 pieces. Shade 2 of them.",
    hintDelayMs: 12000,
    onMatch: "Awesome! You showed that 1/3 = %FRAC%. You're getting the hang of this!",
  },
  {
    tutorSays:
      "Now try 3/4. Tap Split, then tap pieces to divide them. Shade to make an equivalent fraction!",
    reference: { numerator: 3, denominator: 4 },
    waitFor: "match",
    hint: "Tap Split, then tap each piece to get 8 pieces. Shade 6 of them.",
    hintDelayMs: 12000,
    onMatch: "Perfect! 3/4 = %FRAC%. Equivalent fractions are everywhere!",
  },
  {
    tutorSays:
      "Last one — make a fraction equivalent to 2/3. You've got this!",
    reference: { numerator: 2, denominator: 3 },
    waitFor: "match",
    hint: "Tap Split, then tap each piece to get 6 pieces. Shade 4 of them.",
    hintDelayMs: 12000,
    onMatch: "You nailed it! 2/3 = %FRAC%. You're an equivalence expert!",
  },
];

export const CHECK_STEPS = [
  {
    tutorSays: "Quick check — which fraction is equivalent to 1/2?",
    choices: ["1/3", "2/4", "3/5", "1/4"],
    correctIndex: 1,
    onCorrect: "That's right! 2/4 is the same as 1/2. Both cover half the bar!",
    onWrong:
      "Not quite. Think about it — if you split each half into 2 pieces, you get 2 out of 4. Try again!",
  },
  {
    tutorSays: "Which fraction is equivalent to 2/3?",
    choices: ["3/4", "4/6", "2/6", "3/6"],
    correctIndex: 1,
    onCorrect: "Yes! 4/6 = 2/3. You multiplied both parts by 2!",
    onWrong:
      "Hmm, not that one. If you split each third into 2 pieces, 2 shaded becomes 4 shaded out of 6. Try again!",
  },
  {
    tutorSays: "Last question — which fraction is equivalent to 3/4?",
    choices: ["6/8", "4/6", "3/8", "5/8"],
    correctIndex: 0,
    onCorrect:
      "Perfect! 6/8 = 3/4. You've mastered equivalent fractions!",
    onWrong:
      "Not quite. If each quarter is split in half, 3 shaded becomes 6 out of 8. Try again!",
  },
  {
    tutorSays: "Which pair of fractions are NOT equivalent?",
    choices: ["1/2 and 3/6", "2/5 and 4/10", "3/4 and 6/8", "1/3 and 2/5"],
    correctIndex: 3,
    onCorrect:
      "Correct! 1/3 and 2/5 are not equivalent. 1/3 ≈ 0.33, while 2/5 = 0.4.",
    onWrong:
      "Not quite. Check each pair: 1/2 = 3/6 ✓, 2/5 = 4/10 ✓, 3/4 = 6/8 ✓. Which pair doesn't match?",
  },
  {
    tutorSays:
      "If a fraction is equivalent to 1/4, which of these could it be?",
    choices: ["2/8", "2/6", "3/10", "1/5"],
    correctIndex: 0,
    onCorrect:
      "Correct! 2/8 = 1/4 because both represent one quarter of a whole.",
    onWrong:
      "Not quite. 1/4 means one out of four equal parts. Which fraction represents that same amount?",
  },
];
