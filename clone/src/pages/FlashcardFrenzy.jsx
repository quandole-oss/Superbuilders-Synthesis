import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LessonTopBar from "../components/LessonTopBar";

/* ------------------------------------------------------------------ */
/*  Generate random multiplication problems                            */
/* ------------------------------------------------------------------ */
function generateProblems(count = 10) {
  const problems = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * 10) + 2; // 2–11
    const b = Math.floor(Math.random() * 10) + 2;
    problems.push({ a, b, answer: a * b });
  }
  return problems;
}

/* ------------------------------------------------------------------ */
/*  Number pad button                                                  */
/* ------------------------------------------------------------------ */
function PadButton({ label, onClick, variant = "default" }) {
  const base =
    "w-16 h-16 rounded-xl font-semibold text-xl flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 border-none ";
  const variants = {
    default: "bg-slate-800 text-white hover:bg-slate-700",
    submit: "bg-blue-600 text-white hover:bg-blue-500",
    delete: "bg-slate-700 text-slate-300 hover:bg-slate-600",
  };
  return (
    <button className={base + variants[variant]} onClick={onClick}>
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function FlashcardFrenzy() {
  const navigate = useNavigate();

  const [problems] = useState(() => generateProblems(10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(0);
  const [flash, setFlash] = useState(null); // "correct" | "wrong" | null
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef(null);

  // Start timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Stop timer when finished
  useEffect(() => {
    if (isFinished && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [isFinished]);

  const problem = problems[currentIndex];
  const progress = (currentIndex / problems.length) * 100;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleDigit = useCallback(
    (digit) => {
      if (isFinished || flash) return;
      setInput((prev) => {
        if (prev.length >= 4) return prev;
        return prev + digit;
      });
    },
    [isFinished, flash]
  );

  const handleBackspace = useCallback(() => {
    if (isFinished || flash) return;
    setInput((prev) => prev.slice(0, -1));
  }, [isFinished, flash]);

  const handleSubmit = useCallback(() => {
    if (isFinished || flash || input === "") return;
    const userAnswer = parseInt(input, 10);
    const correct = userAnswer === problem.answer;

    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setFlash("correct");
    } else {
      setStreak(0);
      setFlash("wrong");
      setShowCorrectAnswer(true);
    }

    setTimeout(() => {
      setFlash(null);
      setShowCorrectAnswer(false);
      setInput("");
      if (currentIndex < problems.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setIsFinished(true);
      }
    }, correct ? 800 : 1500);
  }, [input, problem, currentIndex, problems.length, isFinished, flash]);

  // Keyboard support
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key >= "0" && e.key <= "9") {
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Enter") {
        handleSubmit();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDigit, handleBackspace, handleSubmit]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <LessonTopBar
        title="Flashcard Frenzy"
        progress={progress}
        onClose={() => navigate("/exploration/bonus")}
      />

      {/* Spacer for fixed top bar */}
      <div className="h-14" />

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 py-4 text-sm">
        <span className="text-slate-400">
          Score: <span className="text-white font-semibold">{score}/{problems.length}</span>
        </span>
        <span className="text-slate-400">
          Time: <span className="text-white font-semibold">{formatTime(timer)}</span>
        </span>
        {streak >= 2 && (
          <span className="text-amber-400 font-semibold">
            {streak} streak
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 pb-8">
        {isFinished ? (
          /* ---- Finished screen ---- */
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold m-0">Great Work!</h2>
            <p className="text-slate-400 text-lg m-0">
              You got <span className="text-white font-semibold">{score}</span> out of{" "}
              <span className="text-white font-semibold">{problems.length}</span> correct
            </p>
            <p className="text-slate-500 text-sm m-0">
              Time: {formatTime(timer)}
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => navigate("/exploration/bonus")}
                className="px-6 py-3 rounded-lg border-4 border-white text-white bg-transparent hover:bg-white/10 cursor-pointer font-semibold transition-colors"
              >
                Back to Bonus
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-lg border-4 border-blue-500 text-blue-400 bg-transparent hover:bg-blue-500/10 cursor-pointer font-semibold transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ---- Flashcard ---- */}
            <div
              className={`w-full max-w-sm rounded-2xl border-2 p-10 flex flex-col items-center gap-6 transition-all duration-300 ${
                flash === "correct"
                  ? "bg-green-500/20 border-green-500"
                  : flash === "wrong"
                    ? "bg-red-500/20 border-red-500"
                    : "bg-slate-900 border-white/10"
              }`}
            >
              {/* Problem */}
              <p className="text-4xl font-bold m-0 tracking-wider">
                {problem.a} &times; {problem.b} = ?
              </p>

              {/* Feedback text */}
              {flash === "correct" && (
                <p className="text-green-400 font-semibold text-lg m-0">Correct!</p>
              )}
              {flash === "wrong" && showCorrectAnswer && (
                <p className="text-red-400 font-semibold text-lg m-0">
                  Answer: {problem.answer}
                </p>
              )}

              {/* Input display */}
              {!flash && (
                <div className="w-full max-w-[200px] h-14 rounded-lg border-2 border-white/20 bg-black flex items-center justify-center text-3xl font-bold tracking-widest text-white">
                  {input || <span className="text-slate-600">...</span>}
                </div>
              )}
            </div>

            {/* ---- Number pad ---- */}
            {!flash && (
              <div className="flex flex-col gap-2 items-center">
                {/* Row 1: 1–3 */}
                <div className="flex gap-2">
                  {[1, 2, 3].map((n) => (
                    <PadButton key={n} label={String(n)} onClick={() => handleDigit(String(n))} />
                  ))}
                </div>
                {/* Row 2: 4–6 */}
                <div className="flex gap-2">
                  {[4, 5, 6].map((n) => (
                    <PadButton key={n} label={String(n)} onClick={() => handleDigit(String(n))} />
                  ))}
                </div>
                {/* Row 3: 7–9 */}
                <div className="flex gap-2">
                  {[7, 8, 9].map((n) => (
                    <PadButton key={n} label={String(n)} onClick={() => handleDigit(String(n))} />
                  ))}
                </div>
                {/* Row 4: backspace, 0, submit */}
                <div className="flex gap-2">
                  <PadButton
                    label={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                        <line x1="18" y1="9" x2="12" y2="15" />
                        <line x1="12" y1="9" x2="18" y2="15" />
                      </svg>
                    }
                    onClick={handleBackspace}
                    variant="delete"
                  />
                  <PadButton label="0" onClick={() => handleDigit("0")} />
                  <PadButton
                    label={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    }
                    onClick={handleSubmit}
                    variant="submit"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
