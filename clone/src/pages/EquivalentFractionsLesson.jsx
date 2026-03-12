import { useReducer, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LessonTopBar from "../components/LessonTopBar";
import InteractiveFractionBar from "../components/visuals/InteractiveFractionBar";
import {
  EXPLORE_STEPS,
  PRACTICE_STEPS,
  CHECK_STEPS,
} from "../data/equivalence-script";

/* ------------------------------------------------------------------ */
/*  Fraction helpers                                                   */
/* ------------------------------------------------------------------ */

function gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }
function lcm(a, b) { return (a / gcd(a, b)) * b; }
function addFracs(a, b) {
  const n = a.n * b.d + b.n * a.d;
  const d = a.d * b.d;
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
function fracEq(a, b) { return a.n * b.d === b.n * a.d; }

function makeBar(denom) {
  return Array.from({ length: denom }, () => ({ size: { n: 1, d: denom }, shaded: false }));
}

/* ------------------------------------------------------------------ */
/*  Chat helpers                                                       */
/* ------------------------------------------------------------------ */

function ChatMessage({ from, text }) {
  const isTutor = from === "tutor";
  return (
    <div className={`flex ${isTutor ? "justify-start" : "justify-end"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
          isTutor
            ? "bg-slate-800 text-slate-200"
            : "bg-blue-600/30 text-blue-100"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-slate-800 rounded-xl px-4 py-2 flex gap-1 items-center">
        <span
          className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Phase stepper                                                      */
/* ------------------------------------------------------------------ */

const PHASES = ["Explore", "Practice", "Check"];

function PhaseStepper({ currentPhase }) {
  const phaseIndex = PHASES.indexOf(
    currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)
  );
  return (
    <div className="flex items-center gap-2 justify-center mb-4">
      {PHASES.map((p, i) => (
        <div key={p} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
              i < phaseIndex
                ? "bg-emerald-500 text-white"
                : i === phaseIndex
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-400"
            }`}
          >
            {i < phaseIndex ? "✓" : i + 1}
          </div>
          <span
            className={`text-xs font-medium ${
              i === phaseIndex ? "text-white" : "text-slate-500"
            }`}
          >
            {p}
          </span>
          {i < PHASES.length - 1 && (
            <div
              className={`w-8 h-0.5 ${
                i < phaseIndex ? "bg-emerald-500" : "bg-slate-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reducer                                                            */
/* ------------------------------------------------------------------ */

const initialState = {
  phase: "explore",
  stepIndex: 0,
  bar: makeBar(2),
  reference: { numerator: 1, denominator: 2, shaded: [true, false] },
  chat: [],
  isTyping: false,
  waitingFor: null,
  matched: false,
  checkCorrect: 0,
  selectedChoice: null,
  answered: false,
  lessonComplete: false,
  activeMode: "shade",
};

function reducer(state, action) {
  switch (action.type) {
    case "TUTOR_MESSAGE":
      return {
        ...state,
        chat: [...state.chat, { from: "tutor", text: action.text }],
        isTyping: false,
      };

    case "STUDENT_MESSAGE":
      return {
        ...state,
        chat: [...state.chat, { from: "student", text: action.text }],
      };

    case "SET_TYPING":
      return { ...state, isTyping: action.value };

    case "SET_WAITING":
      return { ...state, waitingFor: action.value };

    case "SET_MODE":
      return {
        ...state,
        activeMode: state.activeMode === action.mode ? "shade" : action.mode,
      };

    case "SPLIT_PIECE": {
      if (state.bar.length >= 8) return state;
      const idx = action.index;
      const piece = state.bar[idx];
      const halfSize = { n: piece.size.n, d: piece.size.d * 2 };
      const newBar = [
        ...state.bar.slice(0, idx),
        { size: halfSize, shaded: piece.shaded },
        { size: halfSize, shaded: piece.shaded },
        ...state.bar.slice(idx + 1),
      ];
      return { ...state, bar: newBar, matched: false };
    }

    case "COMBINE_PIECE": {
      if (state.bar.length <= 1) return state;
      const ci = action.index;
      // Determine neighbor index: prefer right, fall back to left
      const ni = ci < state.bar.length - 1 ? ci + 1 : ci - 1;
      if (state.bar[ci].shaded !== state.bar[ni].shaded) {
        return {
          ...state,
          chat: [
            ...state.chat,
            {
              from: "tutor",
              text: "Both pieces must match — both shaded or both empty — to smash them together!",
            },
          ],
        };
      }
      // Merge: keep the lower-index piece with combined size, remove the higher
      const keepIdx = Math.min(ci, ni);
      const removeIdx = Math.max(ci, ni);
      const combinedSize = addFracs(state.bar[keepIdx].size, state.bar[removeIdx].size);
      const newBar = state.bar
        .map((p, i) => (i === keepIdx ? { ...p, size: combinedSize } : p))
        .filter((_, i) => i !== removeIdx);
      return { ...state, bar: newBar, matched: false };
    }

    case "TOGGLE_SHADE": {
      const newBar = state.bar.map((p, i) =>
        i === action.index ? { ...p, shaded: !p.shaded } : p
      );
      return { ...state, bar: newBar, matched: false };
    }

    case "MATCH_DETECTED":
      return { ...state, matched: true };

    case "RESET_BAR":
      return {
        ...state,
        bar: makeBar(state.reference.denominator),
        matched: false,
      };

    case "NEXT_STEP":
      return {
        ...state,
        stepIndex: state.stepIndex + 1,
        matched: false,
        selectedChoice: null,
        answered: false,
      };

    case "SET_PHASE": {
      const ref = action.reference || state.reference;
      return {
        ...state,
        phase: action.phase,
        stepIndex: 0,
        matched: false,
        selectedChoice: null,
        answered: false,
        activeMode: "shade",
        reference: ref,
        bar: makeBar(ref.denominator),
      };
    }

    case "INIT_PRACTICE_STEP": {
      const step = PRACTICE_STEPS[action.stepIndex];
      const refShaded = Array(step.reference.denominator).fill(false);
      for (let i = 0; i < step.reference.numerator; i++) refShaded[i] = true;
      return {
        ...state,
        reference: {
          numerator: step.reference.numerator,
          denominator: step.reference.denominator,
          shaded: refShaded,
        },
        bar: makeBar(step.reference.denominator),
        matched: false,
      };
    }

    case "SELECT_CHOICE":
      if (state.answered) return state;
      return { ...state, selectedChoice: action.index };

    case "SUBMIT_ANSWER":
      return { ...state, answered: true };

    case "INCREMENT_CORRECT":
      return { ...state, checkCorrect: state.checkCorrect + 1 };

    case "RETRY":
      return { ...state, selectedChoice: null, answered: false };

    case "FINISH":
      return { ...state, lessonComplete: true };

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function EquivalentFractionsLesson() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const chatEndRef = useRef(null);
  const timersRef = useRef([]);

  // Clear all timers helper
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.chat, state.isTyping]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  /* ---- Explore phase driver ---- */
  useEffect(() => {
    if (state.phase !== "explore") return;
    const step = EXPLORE_STEPS[state.stepIndex];
    if (!step) return;

    clearTimers();
    dispatch({ type: "SET_TYPING", value: true });

    addTimer(() => {
      dispatch({ type: "TUTOR_MESSAGE", text: step.tutorSays });
      dispatch({ type: "SET_WAITING", value: step.waitFor });

      if (step.autoAdvanceMs) {
        addTimer(() => {
          dispatch({ type: "NEXT_STEP" });
        }, step.autoAdvanceMs);
      }

      if (step.hint && step.hintDelayMs) {
        addTimer(() => {
          dispatch({
            type: "TUTOR_MESSAGE",
            text: `💡 Hint: ${step.hint}`,
          });
        }, step.hintDelayMs);
      }
    }, 800);
  }, [state.phase, state.stepIndex, clearTimers, addTimer]);

  /* ---- Practice phase driver ---- */
  useEffect(() => {
    if (state.phase !== "practice") return;
    const step = PRACTICE_STEPS[state.stepIndex];
    if (!step) return;

    clearTimers();
    dispatch({ type: "INIT_PRACTICE_STEP", stepIndex: state.stepIndex });
    dispatch({ type: "SET_TYPING", value: true });

    addTimer(() => {
      dispatch({ type: "TUTOR_MESSAGE", text: step.tutorSays });
      dispatch({ type: "SET_WAITING", value: "match" });

      if (step.hint && step.hintDelayMs) {
        addTimer(() => {
          dispatch({
            type: "TUTOR_MESSAGE",
            text: `💡 Hint: ${step.hint}`,
          });
        }, step.hintDelayMs);
      }
    }, 800);
  }, [state.phase, state.stepIndex, clearTimers, addTimer]);

  /* ---- Check phase driver ---- */
  useEffect(() => {
    if (state.phase !== "check") return;
    const step = CHECK_STEPS[state.stepIndex];
    if (!step) return;

    clearTimers();
    dispatch({ type: "SET_TYPING", value: true });

    addTimer(() => {
      dispatch({ type: "TUTOR_MESSAGE", text: step.tutorSays });
      dispatch({ type: "SET_WAITING", value: "choice" });
    }, 800);
  }, [state.phase, state.stepIndex, clearTimers, addTimer]);

  /* ---- Match detection (explore + practice) ---- */
  useEffect(() => {
    if (state.matched) return;
    const shadedCount = state.bar.filter((p) => p.shaded).length;

    if (state.phase === "explore" && state.waitingFor === "shade") {
      const step = EXPLORE_STEPS[state.stepIndex];
      if (step?.target?.shadedCount && shadedCount === step.target.shadedCount) {
        dispatch({ type: "MATCH_DETECTED" });
        dispatch({ type: "SET_WAITING", value: null });
        addTimer(() => dispatch({ type: "NEXT_STEP" }), 800);
      }
    }

    if (state.phase === "practice" && state.waitingFor === "match") {
      const { numerator, denominator } = state.reference;
      // Compute shaded area as rational fraction
      const shadedArea = state.bar
        .filter((p) => p.shaded)
        .reduce((sum, p) => addFracs(sum, p.size), { n: 0, d: 1 });
      // Equivalent if area matches and structure differs
      if (
        state.bar.length !== denominator &&
        shadedArea.n * denominator === numerator * shadedArea.d &&
        shadedArea.n > 0
      ) {
        dispatch({ type: "MATCH_DETECTED" });
        dispatch({ type: "SET_WAITING", value: null });

        const step = PRACTICE_STEPS[state.stepIndex];
        // Compute display fraction using LCD of all piece sizes
        const lcd = state.bar.reduce((l, p) => lcm(l, p.size.d), 1);
        const shadedUnits = state.bar
          .filter((p) => p.shaded)
          .reduce((sum, p) => sum + p.size.n * (lcd / p.size.d), 0);
        const fracStr = `${shadedUnits}/${lcd}`;
        const praise = step.onMatch.replace("%FRAC%", fracStr);

        clearTimers();
        dispatch({ type: "SET_TYPING", value: true });
        addTimer(() => {
          dispatch({ type: "TUTOR_MESSAGE", text: praise });
          addTimer(() => {
            if (state.stepIndex < PRACTICE_STEPS.length - 1) {
              dispatch({ type: "NEXT_STEP" });
            } else {
              // Move to check phase
              dispatch({ type: "SET_PHASE", phase: "check", reference: { numerator: 1, denominator: 2, shaded: [true, false] } });
            }
          }, 2000);
        }, 800);
      }
    }
  }, [state.bar, state.phase, state.waitingFor, state.stepIndex, state.matched, state.reference, clearTimers, addTimer]);

  /* ---- Split detection (explore) ---- */
  useEffect(() => {
    if (state.phase !== "explore" || state.waitingFor !== "split") return;
    const step = EXPLORE_STEPS[state.stepIndex];
    if (step?.target?.pieces && state.bar.length === step.target.pieces) {
      dispatch({ type: "SET_WAITING", value: null });
      addTimer(() => dispatch({ type: "NEXT_STEP" }), 500);
    }
  }, [state.bar.length, state.phase, state.waitingFor, state.stepIndex, addTimer]);

  /* ---- Action handlers ---- */

  function handleSetMode(mode) {
    dispatch({ type: "SET_MODE", mode });
  }

  function handlePieceClick(index) {
    if (state.activeMode === "split") {
      dispatch({ type: "SPLIT_PIECE", index });
    } else if (state.activeMode === "smash") {
      dispatch({ type: "COMBINE_PIECE", index });
    } else {
      dispatch({ type: "TOGGLE_SHADE", index });
    }
  }

  function handleConfirm() {
    dispatch({ type: "STUDENT_MESSAGE", text: "Got it!" });
    dispatch({ type: "SET_WAITING", value: null });
    const nextIdx = state.stepIndex + 1;
    if (nextIdx < EXPLORE_STEPS.length) {
      dispatch({ type: "NEXT_STEP" });
    } else {
      // Move to practice phase with first practice reference
      const firstPractice = PRACTICE_STEPS[0];
      const refShaded = Array(firstPractice.reference.denominator).fill(false);
      for (let i = 0; i < firstPractice.reference.numerator; i++) refShaded[i] = true;
      dispatch({
        type: "SET_PHASE",
        phase: "practice",
        reference: {
          ...firstPractice.reference,
          shaded: refShaded,
        },
      });
    }
  }

  function handleReset() {
    dispatch({ type: "RESET_BAR" });
  }

  function handleSelectChoice(index) {
    dispatch({ type: "SELECT_CHOICE", index });
  }

  function handleSubmitAnswer() {
    if (state.selectedChoice === null || state.answered) return;
    dispatch({ type: "SUBMIT_ANSWER" });

    const step = CHECK_STEPS[state.stepIndex];
    const correct = state.selectedChoice === step.correctIndex;

    dispatch({
      type: "STUDENT_MESSAGE",
      text: `I think it's ${step.choices[state.selectedChoice]}`,
    });

    if (correct) {
      dispatch({ type: "INCREMENT_CORRECT" });
    }

    dispatch({ type: "SET_TYPING", value: true });
    addTimer(() => {
      dispatch({
        type: "TUTOR_MESSAGE",
        text: correct ? step.onCorrect : step.onWrong,
      });
    }, 800);
  }

  function handleCheckNext() {
    if (!state.answered) return;

    const step = CHECK_STEPS[state.stepIndex];
    const wasCorrect = state.selectedChoice === step.correctIndex;

    if (!wasCorrect) {
      // Let them retry the same question
      dispatch({ type: "RETRY" });
      return;
    }

    if (state.stepIndex < CHECK_STEPS.length - 1) {
      dispatch({ type: "NEXT_STEP" });
    } else {
      // Lesson complete
      dispatch({ type: "SET_TYPING", value: true });
      addTimer(() => {
        dispatch({
          type: "TUTOR_MESSAGE",
          text: `Amazing work! You got ${state.checkCorrect} out of ${CHECK_STEPS.length} correct. You really understand equivalent fractions now!`,
        });
        dispatch({ type: "FINISH" });
      }, 800);
    }
  }

  /* ---- Progress calculation ---- */
  const totalSteps =
    EXPLORE_STEPS.length + PRACTICE_STEPS.length + CHECK_STEPS.length;
  let completedSteps = 0;
  if (state.phase === "explore") completedSteps = state.stepIndex;
  else if (state.phase === "practice")
    completedSteps = EXPLORE_STEPS.length + state.stepIndex;
  else if (state.phase === "check")
    completedSteps =
      EXPLORE_STEPS.length + PRACTICE_STEPS.length + state.stepIndex;
  if (state.lessonComplete) completedSteps = totalSteps;
  const progress = (completedSteps / totalSteps) * 100;

  /* ---- Determine what buttons to show ---- */
  const showSplit =
    state.phase === "explore" || state.phase === "practice";
  const showCombine =
    state.phase === "explore" || state.phase === "practice";
  const showReset = state.phase === "practice";
  const showConfirm =
    state.phase === "explore" && state.waitingFor === "confirm";

  /* ---- Check phase state ---- */
  const checkStep = state.phase === "check" ? CHECK_STEPS[state.stepIndex] : null;

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col">
      <LessonTopBar
        title="Equivalent Fractions"
        progress={progress}
        onClose={() => navigate("/exploration/fractions")}
      />

      {/* Spacer for fixed top bar */}
      <div className="h-14" />

      {/* Main content — stacked on mobile, side-by-side on md+ */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Workspace panel */}
        <div className="flex-[7] flex flex-col p-6 gap-5 overflow-y-auto">
          <PhaseStepper currentPhase={state.phase} />

          {/* Manipulative area (explore + practice) */}
          {(state.phase === "explore" || state.phase === "practice") && (
            <div className="flex flex-col gap-6 items-center max-w-lg mx-auto w-full">
              {/* Reference bar */}
              <div className="w-full">
                <p className="text-xs text-slate-500 mb-1 text-center uppercase tracking-wider">
                  Reference
                </p>
                <InteractiveFractionBar
                  pieces={state.reference.denominator}
                  shaded={state.reference.shaded}
                  color="bg-blue-500"
                  interactive={false}
                  label={`${state.reference.numerator}/${state.reference.denominator}`}
                />
              </div>

              {/* Alignment indicator */}
              {state.matched && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Equivalent!
                </div>
              )}

              {/* Student bar */}
              <div className="w-full">
                <p className="text-xs text-slate-500 mb-1 text-center uppercase tracking-wider">
                  Your bar
                </p>
                <InteractiveFractionBar
                  pieces={state.bar.length}
                  shaded={state.bar.map((p) => p.shaded)}
                  sizes={state.bar.map((p) => p.size)}
                  color="bg-amber-500"
                  interactive={state.waitingFor === "shade" || state.waitingFor === "split" || state.phase === "practice"}
                  onTogglePiece={handlePieceClick}
                  matched={state.matched}
                  activeMode={state.activeMode}
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                {showSplit && (
                  <button
                    onClick={() => handleSetMode("split")}
                    className={`px-5 py-3 rounded-lg border-2 font-semibold transition-all touch-manipulation touch-target cursor-pointer ${
                      state.activeMode === "split"
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-white/20 text-white bg-transparent hover:bg-white/10"
                    }`}
                  >
                    ✂️ Split
                  </button>
                )}
                {showCombine && (
                  <button
                    onClick={() => handleSetMode("smash")}
                    className={`px-5 py-3 rounded-lg border-2 font-semibold transition-all touch-manipulation touch-target cursor-pointer ${
                      state.activeMode === "smash"
                        ? "border-orange-400 bg-orange-400/10 text-orange-300"
                        : "border-white/20 text-white bg-transparent hover:bg-white/10"
                    }`}
                  >
                    🔗 Smash
                  </button>
                )}
                {showReset && (
                  <button
                    onClick={handleReset}
                    className="px-5 py-3 rounded-lg border-2 border-white/10 text-slate-400 bg-transparent hover:bg-white/5 cursor-pointer font-medium transition-all touch-manipulation touch-target"
                  >
                    ↺ Reset
                  </button>
                )}
                {showConfirm && (
                  <button
                    onClick={handleConfirm}
                    className="px-6 py-3 rounded-lg border-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 cursor-pointer font-semibold transition-all touch-manipulation touch-target"
                  >
                    Got it!
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Check phase — multiple choice */}
          {state.phase === "check" && checkStep && (
            <div className="flex flex-col gap-6 items-center max-w-lg mx-auto w-full">
              <div className="flex flex-wrap gap-3 justify-center">
                {checkStep.choices.map((choice, i) => {
                  let btnClasses =
                    "px-6 py-3 rounded-lg border-2 text-lg font-semibold cursor-pointer transition-all duration-200 touch-manipulation touch-target ";

                  if (state.answered && i === checkStep.correctIndex) {
                    btnClasses +=
                      "bg-green-500/20 border-green-500 text-green-300";
                  } else if (
                    state.answered &&
                    i === state.selectedChoice &&
                    state.selectedChoice !== checkStep.correctIndex
                  ) {
                    btnClasses += "bg-red-500/20 border-red-500 text-red-300";
                  } else if (i === state.selectedChoice) {
                    btnClasses +=
                      "bg-blue-500/20 border-blue-500 text-blue-300";
                  } else {
                    btnClasses +=
                      "bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectChoice(i)}
                      disabled={state.answered}
                      className={btnClasses}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4">
                {!state.answered ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={state.selectedChoice === null}
                    className={`px-8 py-3 rounded-lg border-4 font-semibold transition-all duration-200 touch-manipulation touch-target ${
                      state.selectedChoice === null
                        ? "border-slate-600 text-slate-600 cursor-not-allowed bg-transparent"
                        : "border-white text-white bg-transparent hover:bg-white/10 cursor-pointer"
                    }`}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleCheckNext}
                    className="px-8 py-3 rounded-lg border-4 border-white text-white bg-transparent hover:bg-white/10 cursor-pointer font-semibold transition-all duration-200 touch-manipulation touch-target"
                  >
                    {state.answered &&
                    state.selectedChoice !== checkStep.correctIndex
                      ? "Try Again"
                      : state.stepIndex < CHECK_STEPS.length - 1
                      ? "Next"
                      : "Finish Lesson"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Lesson complete */}
          {state.lessonComplete && (
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="text-5xl">🎉</div>
              <h2 className="text-xl font-bold text-white">Lesson Complete!</h2>
              <p className="text-slate-400 text-sm text-center">
                You scored {state.checkCorrect}/{CHECK_STEPS.length} on the
                check questions.
              </p>
              <button
                onClick={() => navigate("/exploration/fractions")}
                className="px-8 py-3 rounded-lg border-4 border-white text-white bg-transparent hover:bg-white/10 cursor-pointer font-semibold transition-all duration-200 touch-manipulation"
              >
                Back to Fractions
              </button>
            </div>
          )}
        </div>

        {/* Chat panel */}
        <div className="flex-[3] border-t md:border-t-0 md:border-l border-white/10 bg-slate-950 flex flex-col max-h-[35vh] md:max-h-none">
          {/* Chat header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10 shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a5 5 0 015 5v3H7V7a5 5 0 015-5z" />
                <rect x="3" y="10" width="18" height="12" rx="2" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-semibold m-0">Tutor</p>
              <p className="text-green-400 text-xs m-0">Online</p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {state.chat.map((msg, i) => (
              <ChatMessage key={i} from={msg.from} text={msg.text} />
            ))}
            {state.isTyping && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
