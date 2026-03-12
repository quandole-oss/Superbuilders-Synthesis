/* ------------------------------------------------------------------ */
/*  Per-lesson question banks for the Fractions module                 */
/* ------------------------------------------------------------------ */

export const fractionLessons = {
  /* ---- Lesson 1: What is a Fraction? ---- */
  1: {
    title: "What is a Fraction?",
    questions: [
      {
        prompt: "What fraction of the bar is shaded?",
        totalParts: 2,
        shadedParts: 1,
        color: "bg-blue-500",
        choices: ["1/2", "1/3", "2/1", "1/4"],
        correctIndex: 0,
        tutorIntro:
          "Welcome! A fraction tells us how many equal parts are shaded. Count the total parts, then count the shaded ones.",
        hintOnWrong:
          "The bar has 2 equal parts, and 1 is shaded. The fraction is shaded parts over total parts.",
        praiseOnCorrect:
          "That's right! 1 out of 2 equal parts is shaded — that's 1/2. The top number (numerator) is how many are shaded, and the bottom (denominator) is the total.",
      },
      {
        prompt: "What fraction of the bar is shaded?",
        totalParts: 4,
        shadedParts: 1,
        color: "bg-purple-500",
        choices: ["1/2", "1/4", "1/3", "4/1"],
        correctIndex: 1,
        tutorIntro:
          "Here's another one! Remember: count total parts, then count shaded parts.",
        hintOnWrong:
          "Count carefully — the bar is split into 4 equal pieces, and only 1 is shaded.",
        praiseOnCorrect:
          "Excellent! 1 out of 4 parts is shaded, so the fraction is 1/4. We call this a 'unit fraction' because the numerator is 1.",
      },
      {
        prompt: "What fraction of the bar is shaded?",
        totalParts: 3,
        shadedParts: 2,
        color: "bg-emerald-500",
        choices: ["1/3", "2/4", "2/3", "3/2"],
        correctIndex: 2,
        tutorIntro:
          "This time more than one part is shaded. How many parts total, and how many are colored in?",
        hintOnWrong:
          "There are 3 parts total and 2 are shaded. Put the shaded count on top!",
        praiseOnCorrect:
          "You got it! 2 out of 3 parts are shaded — that's 2/3. The numerator doesn't have to be 1!",
      },
      {
        prompt: "What fraction of the bar is shaded?",
        totalParts: 4,
        shadedParts: 3,
        color: "bg-amber-500",
        choices: ["3/4", "1/4", "4/3", "3/3"],
        correctIndex: 0,
        tutorIntro:
          "Almost all of this bar is shaded! What fraction do you see?",
        hintOnWrong:
          "There are 4 parts total and 3 are colored in. The fraction is 3 over 4.",
        praiseOnCorrect:
          "Nice work! 3 out of 4 parts — that's 3/4. Notice how most of the bar is shaded? That means 3/4 is close to a whole!",
      },
      {
        prompt: "What fraction of the bar is shaded?",
        totalParts: 8,
        shadedParts: 3,
        color: "bg-rose-500",
        choices: ["3/4", "3/8", "5/8", "1/3"],
        correctIndex: 1,
        tutorIntro:
          "This one has more parts! Take your time and count carefully.",
        hintOnWrong:
          "Count all the sections — there are 8. Now count the shaded ones — there are 3.",
        praiseOnCorrect:
          "Perfect! 3 out of 8 parts are shaded, so it's 3/8. You're a natural with fractions!",
      },
    ],
  },

  /* ---- Lesson 2: Halves and Quarters ---- */
  2: {
    title: "Halves and Quarters",
    questions: [
      {
        prompt: "What fraction of the bar is shaded?",
        totalParts: 2,
        shadedParts: 1,
        color: "bg-blue-500",
        choices: ["1/4", "1/2", "2/2", "1/3"],
        correctIndex: 1,
        tutorIntro:
          "Let's learn about halves! When something is split into 2 equal parts, each part is called a 'half.'",
        hintOnWrong:
          "The bar is split into 2 equal parts and 1 is shaded. That's one half.",
        praiseOnCorrect:
          "That's right — 1/2! One half means one out of two equal parts. You see halves everywhere: half a sandwich, half an hour!",
      },
      {
        prompt: "What fraction of the bar is shaded?",
        totalParts: 4,
        shadedParts: 1,
        color: "bg-purple-500",
        choices: ["1/2", "1/3", "1/4", "4/4"],
        correctIndex: 2,
        tutorIntro:
          "Now let's learn about quarters! When something is split into 4 equal parts, each part is a 'quarter.'",
        hintOnWrong:
          "The bar has 4 equal pieces and 1 is shaded. One out of four is one quarter.",
        praiseOnCorrect:
          "Exactly! 1/4 is one quarter. A quarter is smaller than a half because you're splitting into more pieces!",
      },
      {
        prompt: "What fraction of the bar is shaded?",
        totalParts: 4,
        shadedParts: 2,
        color: "bg-emerald-500",
        choices: ["1/2", "2/4", "1/4", "3/4"],
        correctIndex: 1,
        tutorIntro:
          "Two pieces are shaded this time. What fraction of the bar is that?",
        hintOnWrong:
          "There are 4 parts total and 2 are shaded. That's 2 over 4.",
        praiseOnCorrect:
          "Yes, it's 2/4! And here's something cool — 2/4 covers the same amount as 1/2. They're the same size!",
      },
      {
        prompt: "What fraction of the bar is shaded?",
        totalParts: 4,
        shadedParts: 3,
        color: "bg-amber-500",
        choices: ["3/4", "1/4", "2/4", "4/4"],
        correctIndex: 0,
        tutorIntro:
          "Most of the bar is shaded! What fraction do you see?",
        hintOnWrong:
          "Count the shaded pieces — there are 3 out of 4 total. That's three quarters.",
        praiseOnCorrect:
          "That's 3/4 — three quarters! Only one piece is left unshaded. Three quarters is more than half!",
      },
      {
        prompt: "What fraction of the bar is shaded?",
        totalParts: 4,
        shadedParts: 4,
        color: "bg-rose-500",
        choices: ["3/4", "4/4", "1/2", "4/1"],
        correctIndex: 1,
        tutorIntro:
          "Every single piece is shaded! What fraction is this?",
        hintOnWrong:
          "All 4 parts are shaded out of 4 total. That's 4 over 4.",
        praiseOnCorrect:
          "It's 4/4 — and that equals 1 whole! When every part is shaded, you have the entire thing. Four quarters make a whole!",
      },
    ],
  },

  /* ---- Lesson 3: Comparing Fractions ---- */
  3: {
    title: "Comparing Fractions",
    questions: [
      {
        prompt: "Which fraction is larger: 1/2 or 1/4?",
        totalParts: 2,
        shadedParts: 1,
        color: "bg-blue-500",
        choices: ["1/2", "1/4"],
        correctIndex: 0,
        tutorIntro:
          "Let's compare fractions! The bar shows 1/2. Think about this: would you rather have 1 out of 2 slices, or 1 out of 4?",
        hintOnWrong:
          "Imagine splitting a pizza. 2 slices means each piece is big. 4 slices means each piece is smaller. Which single piece is bigger?",
        praiseOnCorrect:
          "Yes! 1/2 is larger than 1/4. When the top number is the same, fewer total parts means each part is bigger!",
      },
      {
        prompt: "Which fraction is larger: 2/4 or 3/4?",
        totalParts: 4,
        shadedParts: 3,
        color: "bg-emerald-500",
        choices: ["2/4", "3/4"],
        correctIndex: 1,
        tutorIntro:
          "Both fractions have the same bottom number (4). The bar shows 3/4. Which has more shaded?",
        hintOnWrong:
          "When the denominator is the same, just compare the numerators. 3 shaded pieces vs 2 shaded pieces — which is more?",
        praiseOnCorrect:
          "That's right! 3/4 > 2/4. When the bottom numbers match, the bigger top number wins!",
      },
      {
        prompt: "Which fraction is larger: 1/3 or 1/2?",
        totalParts: 3,
        shadedParts: 1,
        color: "bg-purple-500",
        choices: ["1/3", "1/2"],
        correctIndex: 1,
        tutorIntro:
          "The bar shows 1/3. Now think: is one third bigger or smaller than one half?",
        hintOnWrong:
          "Splitting something into 3 pieces makes each piece smaller than splitting into 2. So 1/3 is smaller than 1/2.",
        praiseOnCorrect:
          "Correct! 1/2 is larger. Thirds are smaller pieces than halves because you're cutting into more parts!",
      },
      {
        prompt: "Which fraction is larger: 2/3 or 2/4?",
        totalParts: 3,
        shadedParts: 2,
        color: "bg-amber-500",
        choices: ["2/3", "2/4"],
        correctIndex: 0,
        tutorIntro:
          "Both fractions have the same top number (2). The bar shows 2/3. Which covers more of the whole?",
        hintOnWrong:
          "Both have 2 shaded parts, but thirds are bigger pieces than quarters. So 2 thirds covers more!",
        praiseOnCorrect:
          "Yes! 2/3 > 2/4. When the numerators are the same, the fraction with the smaller denominator is larger — because each piece is bigger!",
      },
      {
        prompt: "Which fraction is larger: 3/4 or 1/2?",
        totalParts: 4,
        shadedParts: 3,
        color: "bg-rose-500",
        choices: ["1/2", "3/4"],
        correctIndex: 1,
        tutorIntro:
          "The bar shows 3/4. Is three quarters more or less than one half?",
        hintOnWrong:
          "Think about it: 1/2 is the same as 2/4. Is 3/4 more or less than 2/4?",
        praiseOnCorrect:
          "You got it! 3/4 is larger than 1/2. A great trick: convert to the same denominator (1/2 = 2/4), then compare!",
      },
    ],
  },

  /* ---- Lesson 4: Adding Fractions ---- */
  4: {
    title: "Adding Fractions",
    questions: [
      {
        prompt: "What is 1/4 + 1/4?",
        totalParts: 4,
        shadedParts: 2,
        color: "bg-blue-500",
        choices: ["1/4", "2/4", "2/8", "1/2"],
        correctIndex: 1,
        tutorIntro:
          "Time to add fractions! The bar shows the answer — 1 quarter plus 1 quarter. How many quarters is that?",
        hintOnWrong:
          "When the bottom numbers are the same, just add the top numbers: 1 + 1 = 2. The bottom stays 4.",
        praiseOnCorrect:
          "That's right! 1/4 + 1/4 = 2/4. When fractions have the same denominator, just add the numerators!",
      },
      {
        prompt: "What is 1/3 + 1/3?",
        totalParts: 3,
        shadedParts: 2,
        color: "bg-emerald-500",
        choices: ["2/6", "1/3", "2/3", "3/3"],
        correctIndex: 2,
        tutorIntro:
          "Same idea — add the top numbers. The bar shows the result!",
        hintOnWrong:
          "Both fractions are thirds. 1 third + 1 third = ? thirds. Add the numerators!",
        praiseOnCorrect:
          "Yes! 1/3 + 1/3 = 2/3. You're getting the pattern — same bottom number, add the tops!",
      },
      {
        prompt: "What is 1/4 + 2/4?",
        totalParts: 4,
        shadedParts: 3,
        color: "bg-purple-500",
        choices: ["3/8", "3/4", "2/4", "4/4"],
        correctIndex: 1,
        tutorIntro:
          "Now the top numbers are different. Can you add 1 quarter plus 2 quarters?",
        hintOnWrong:
          "The denominator is 4 for both. Add the numerators: 1 + 2 = 3. So it's 3 over 4.",
        praiseOnCorrect:
          "Perfect! 1/4 + 2/4 = 3/4. The denominator stays the same — only the numerators add up!",
      },
      {
        prompt: "What is 2/8 + 3/8?",
        totalParts: 8,
        shadedParts: 5,
        color: "bg-amber-500",
        choices: ["5/16", "5/8", "6/8", "1/8"],
        correctIndex: 1,
        tutorIntro:
          "More pieces this time! The bar shows eighths. Add the shaded parts together.",
        hintOnWrong:
          "Both fractions are eighths. 2 + 3 = 5, and the bottom stays 8. What's the answer?",
        praiseOnCorrect:
          "You got it! 2/8 + 3/8 = 5/8. Even with more pieces, the rule is the same: add the tops, keep the bottom!",
      },
      {
        prompt: "What is 1/6 + 3/6?",
        totalParts: 6,
        shadedParts: 4,
        color: "bg-rose-500",
        choices: ["4/12", "4/6", "3/6", "2/6"],
        correctIndex: 1,
        tutorIntro:
          "Last one! The bar shows sixths. Add the numerators and keep the denominator.",
        hintOnWrong:
          "1 sixth plus 3 sixths — add the top numbers: 1 + 3 = 4. The bottom stays 6.",
        praiseOnCorrect:
          "Excellent! 1/6 + 3/6 = 4/6. You've mastered adding fractions with the same denominator!",
      },
    ],
  },
};
