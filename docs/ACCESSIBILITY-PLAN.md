# Accessibility Plan (Including iPad)

*Saved from conversation — March 2025*

Plan to make the Synthesis Tutor app more accessible while keeping **iPad** as a first-class target (touch, VoiceOver, optional external keyboard).

---

## Scope and Goals

- **Target:** WCAG 2.1 Level AA where feasible; usable with **keyboard**, **touch (iPad)**, and **screen reader (e.g. VoiceOver on iPad)**.
- **Priority:** The **Equivalent Fractions** lesson and **lesson shell** (MCQ) are the core; then dashboard, auth, and billing.
- **iPad:** All interactions must work with **touch** (no mouse required), **VoiceOver on iPad**, and **external keyboard** when attached.

---

## Current State (Brief)

| Area | What exists | Gaps |
|------|-------------|------|
| **Interactive fraction bar** | `role="switch"`, `aria-checked`, `aria-label` per piece; 48px height; `touch-manipulation` | No keyboard (Space/Enter); no live region when "Equivalent!"; reference/your bar not grouped/labeled for SR |
| **Lesson controls** | Split, Smash, Reset, Got it — touch targets, `touch-target` class | No `aria-label` where icon-only or ambiguous; no `aria-pressed` for mode toggles |
| **Chat / tutor** | Messages in a scrollable div | No `aria-live` for new messages; no landmark/heading for "Tutor" |
| **Top bar** | Back, Settings, Close have `aria-label` | Progress bar not exposed to SR; no skip link to main content |
| **MCQ (LessonShell + Check phase)** | Buttons for choices | No `role="radiogroup"` + `aria-label`; no association of prompt + choices; visuals not described |
| **Forms** | Focus styles on inputs | Need to confirm `<label>` or `aria-label` on every field |
| **Layout / iPad** | `min-h-[100dvh]`, `touch-manipulation`, `touch-target` (48px on coarse) | No `env(safe-area-inset*)` for notches; no `prefers-reduced-motion` |

---

## Phase 1: Foundation (App-Wide, iPad-Safe)

### 1.1 Document and Page

- **`index.html`:** Keep `<html lang="en">`; add a **skip link** as the first focusable element: "Skip to main content" → `#main-content`. Style so it's visible on focus.
- **Main landmarks:** Wrap the primary content area in `<main id="main-content">`. Use `<nav>`, `<aside>` where they already exist. Ensure only one `<main>` per view.

### 1.2 Focus and Keyboard

- **Visible focus:** Every interactive element must have a **visible focus ring** (at least 2px, sufficient contrast). On iPad, focus should be visible when using **external keyboard** or when **VoiceOver** moves focus.
- **Focus order:** Tab order should follow visual order: skip link → top bar → main content → chat panel. No positive `tabindex`; fix order by DOM order if needed.

### 1.3 iPad-Specific

- **Touch targets:** Keep `touch-target` (48×48px minimum on coarse pointer) on all interactive elements in lessons and dashboard.
- **Viewport and safe area:** Use `min-h-[100dvh]` for full-height lesson/dashboard. Add `padding: env(safe-area-inset-*)` on the root layout or fixed top bar so content isn't hidden by notches/Dynamic Island on iPad.
- **Reduced motion:** Respect `prefers-reduced-motion: reduce`: disable or shorten `matchPulse` and `shadePop` when the user prefers reduced motion.

---

## Phase 2: Equivalent Fractions Lesson (Manipulative + Chat)

### 2.1 Interactive Fraction Bar

- **Keyboard:** Add **Space** (and **Enter**) to toggle the switch. Ensure focus can move between pieces with **Tab** / **Shift+Tab**.
- **Screen reader:** Optionally add a short **live region** that announces the current fraction when it changes. When **"Equivalent!"** appears, announce it via an `aria-live="polite"` region.
- **Context:** Wrap "Reference" bar and "Your bar" with `aria-label="Reference fraction"` and `aria-label="Your fraction bar"` (or use a visible label that's associated).

### 2.2 Mode Buttons (Split / Smash / Reset / Got it)

- Add `aria-pressed={state.activeMode === "split"}` and `aria-pressed={state.activeMode === "smash"}`. Use `aria-label="Split piece"` and `aria-label="Combine pieces"` (or "Smash") if the emoji isn't announced meaningfully. Reset: `aria-label="Reset fraction bar"`.

### 2.3 Phase Stepper

- Mark the stepper with `aria-label="Lesson progress"` and `aria-current="step"` on the current phase so VoiceOver can say "Step 2 of 3, Practice".

### 2.4 Check Phase (Multiple Choice)

- Wrap the choices in a `<div role="radiogroup" aria-label="Choose the equivalent fraction">`. Associate the question text with the group via `aria-labelledby`. Each choice button: clear `aria-label`; Submit: "Check answer"; Next: "Next question" or "Finish lesson" as appropriate.

### 2.5 Tutor Chat Panel

- The area where tutor messages appear should be an **live region**: e.g. `<div aria-live="polite" aria-atomic="false" aria-label="Tutor messages">`. Mark the typing indicator with `aria-live="polite"` and `aria-busy="true"`, and provide text like "Tutor is typing…" for screen readers (visible or sr-only).

---

## Phase 3: Generic Lesson Shell (MCQ + Visuals)

- **Prompt:** Use a single `<h2>` for the question prompt with an `id`. Wrap choices in `role="radiogroup"` with `aria-labelledby` pointing to that id.
- **Visuals:** Each visual (NumberLine, FractionBar, ArrayGrid, etc.) should have a short **text description** via `aria-label` or `aria-describedby`, or a visually hidden paragraph (e.g. `sr-only`) referenced by `aria-describedby`. If purely decorative, use `aria-hidden="true"`.

---

## Phase 4: Dashboard, Auth, and Global UI

- **Sidebar:** Current page link should have `aria-current="page"`. Logo link: `aria-label` if the logo has no text.
- **Subject cards:** Use a list or ensure cards are in a landmark with `aria-label`. Each card: clear name (subject + "View lessons" or similar). Progress: expose to SR (e.g. "Fractions: 3 of 8 lessons completed").
- **Forms:** Every input must have an associated `<label>` (with `for`/`id`) or `aria-label`. Error messages: link via `aria-describedby` and use `aria-invalid="true"` when the field has an error.
- **Lesson top bar:** Add `role="progressbar"` and `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-label="Lesson progress"` (or "Progress: 45%") so SR can announce it.

---

## Phase 5: Testing and Validation (Including iPad)

### 5.1 Keyboard-Only

- Use only **Tab**, **Shift+Tab**, **Enter**, **Space** (and **Escape** if you add modals). Complete: signup → pick student → open Fractions → do Equivalent Fractions (Explore, Practice, Check) → return. Same for one LessonShell MCQ lesson.

### 5.2 VoiceOver on iPad

- Enable **VoiceOver** (Settings → Accessibility → VoiceOver). Use **swipe** to move focus and **double-tap** to activate. Go through the same flow; confirm skip link, top bar, phase stepper, fraction bar (piece by piece, toggle with double-tap), Split/Smash/Reset/Got it, tutor messages (new message announced), Check phase choices, Submit, Next. Confirm **external keyboard** on iPad: Tab order and Space/Enter match.

### 5.3 Automated and Contrast

- Run **axe DevTools** or **Lighthouse** (Accessibility) on the main routes. Check **color contrast** for text and focus rings (4.5:1 for normal text, 3:1 for large text and UI).

### 5.4 Touch on iPad

- Use the app **only with touch**: all buttons and fraction bar pieces must be easy to tap (48px minimum), no accidental zoom from double-tap. Confirm safe areas on a notched iPad (portrait and landscape).

---

## Summary Checklist (By Phase)

| Phase | Focus | iPad-Related |
|-------|--------|----------------|
| **1** | Skip link, `<main>`, landmarks, visible focus, focus order | Safe-area insets, reduced motion, 48px touch targets |
| **2** | Fraction bar keyboard + live region; "Equivalent!" announcement; mode buttons `aria-pressed`; phase stepper `aria-current`; Check radiogroup; chat `aria-live` | Same touch targets; VoiceOver test on iPad |
| **3** | MCQ radiogroup + labels; visual descriptions (aria-label / sr-only) | — |
| **4** | Sidebar `aria-current`; form labels and errors; progress bar `role="progressbar"` | — |
| **5** | Keyboard run-through; VoiceOver on iPad; axe/Lighthouse; contrast; touch-only iPad | Full flow on device |
