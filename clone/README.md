# Synthesis Tutor Clone — Fraction Equivalence Lesson

A single self-contained lesson teaching **fraction equivalence** through an interactive digital manipulative and conversational tutor. Built as a React web app optimized for iPad browsers.

## Setup

```bash
npm install
npm run dev
```

Open the dev server URL in a browser (or iPad Safari).

## How to Reach the Lesson

1. Navigate to `/account/billing` (the home/dashboard page)
2. Click **Fractions** subject card
3. Click **Lesson 6 — Equivalent Fractions**

Direct URL: `/exploration/fractions/6`

## Lesson Flow

The lesson has **3 phases**:

### 1. Explore
The tutor walks the student through discovering that 1/2 = 2/4 = 4/8 by guiding them to **split** a fraction bar and **shade** pieces. The student interacts with the manipulative (tap to shade, buttons to split/combine) while the tutor provides step-by-step dialogue.

### 2. Practice
Three open-ended challenges where the student must create an equivalent fraction (e.g., make something equivalent to 1/3). The student freely splits, shades, and combines pieces. Match detection fires automatically when the student's bar represents an equivalent fraction.

### 3. Check for Understanding
Three multiple-choice questions testing equivalence knowledge, with branching tutor dialogue for correct/incorrect answers.

## Technical Approach

- **React + Vite + Tailwind CSS** — no additional runtime dependencies
- **`useReducer` state machine** drives all lesson state (phase, step, bar pieces, chat history, etc.)
- **InteractiveFractionBar** component: each piece is a `<button>` with `role="switch"` for accessibility. Touch targets are ≥48px. `touch-action: manipulation` prevents double-tap zoom on iPad.
- **CSS transitions** for smooth split/shade animations (width, background-color, transform)
- **Declarative tutor script** (`src/data/equivalence-script.js`): all dialogue, hints, and branching logic are data — no tutor logic in the component
- **iPad optimization**: `min-h-[100dvh]` for Safari viewport, stacked layout on portrait, side-by-side on landscape, coarse-pointer media query for touch targets

## Key Files

| File | Purpose |
|------|---------|
| `src/pages/EquivalentFractionsLesson.jsx` | Main lesson page with reducer + 3-phase flow |
| `src/components/visuals/InteractiveFractionBar.jsx` | Touch/click interactive fraction bar |
| `src/data/equivalence-script.js` | Declarative tutor dialogue for all 3 phases |
| `src/index.css` | Animations (matchPulse, shadePop) + touch helpers |
| `src/App.jsx` | Route `/exploration/fractions/6` |
| `src/pages/FractionsUnit.jsx` | Lesson 6 unlocked |
