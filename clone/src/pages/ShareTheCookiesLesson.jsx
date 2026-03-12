import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const CHAR_EMOJI = { 1: "\u{1F469}", 2: "\u{1F468}" }; // 👩 👨

function makeCookies(n) {
  return Array.from({ length: n }, (_, i) => ({ id: i + 1, assignedTo: null }));
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function ShareTheCookiesLesson() {
  const navigate = useNavigate();

  /* ---------------- state ---------------- */
  const [stage, setStage] = useState(1);
  const [cookies, setCookies] = useState(() => makeCookies(4));
  const [selectedId, setSelectedId] = useState(null);
  const [hintActive, setHintActive] = useState(false);
  const [happyChar, setHappyChar] = useState(null);
  const [splitting, setSplitting] = useState(false);
  const [splitDone, setSplitDone] = useState(false);
  const [showEquation, setShowEquation] = useState(false);

  /* ---------------- drag state ---------------- */
  const [dragging, setDragging] = useState(null);       // { cookieId } or null
  const [dropHighlight, setDropHighlight] = useState(null); // 1 | 2 | null
  const ghostRef = useRef(null);
  const dragStartRef = useRef(null); // { x, y, cookieId, isDragging }
  const suppressClickRef = useRef(false);

  /* ---------------- derived ---------------- */
  const char1 = cookies.filter((c) => c.assignedTo === 1);
  const char2 = cookies.filter((c) => c.assignedTo === 2);
  const unassigned = cookies.filter((c) => c.assignedTo === null);
  const totalAssigned = char1.length + char2.length;
  const maxPerChar = Math.floor(cookies.length / 2);

  const stage1Done = stage === 1 && char1.length === 2 && char2.length === 2;
  const stage2Leftover =
    stage === 2 &&
    char1.length === 2 &&
    char2.length === 2 &&
    unassigned.length === 1;
  const stageComplete = stage1Done || (stage === 2 && splitDone);

  /* ---------------- effects ---------------- */
  // delayed equation reveal
  useEffect(() => {
    if (stageComplete && !showEquation) {
      const t = setTimeout(() => setShowEquation(true), 600);
      return () => clearTimeout(t);
    }
  }, [stageComplete, showEquation]);

  // reset happy character after bounce
  useEffect(() => {
    if (happyChar) {
      const t = setTimeout(() => setHappyChar(null), 500);
      return () => clearTimeout(t);
    }
  }, [happyChar]);

  /* ---------------- drag handlers ---------------- */
  const canDragCookie = useCallback(
    (cookieId) => {
      if (splitting || splitDone || stage1Done) return false;
      const cookie = cookies.find((c) => c.id === cookieId);
      if (!cookie || cookie.assignedTo !== null) return false;
      // last cookie in stage 2 is not draggable (split-only)
      if (stage2Leftover) return false;
      return true;
    },
    [cookies, splitting, splitDone, stage1Done, stage2Leftover],
  );

  function handleCookiePointerDown(e, cookieId) {
    if (!canDragCookie(cookieId)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      cookieId,
      isDragging: false,
    };
  }

  function handleCookiePointerMove(e) {
    const ds = dragStartRef.current;
    if (!ds) return;

    const dx = e.clientX - ds.x;
    const dy = e.clientY - ds.y;

    if (!ds.isDragging) {
      // threshold: 8px before entering drag mode
      if (dx * dx + dy * dy < 64) return;
      ds.isDragging = true;
      suppressClickRef.current = true;
      setDragging({ cookieId: ds.cookieId });
      setSelectedId(null); // clear any click-selection
    }

    // update ghost position via ref (no re-render)
    if (ghostRef.current) {
      ghostRef.current.style.left = `${e.clientX}px`;
      ghostRef.current.style.top = `${e.clientY}px`;
    }

    // hit-test for drop targets
    const els = document.elementsFromPoint(e.clientX, e.clientY);
    let target = null;
    for (const el of els) {
      const dt = el.closest("[data-drop-target]");
      if (dt) {
        target = dt;
        break;
      }
    }
    if (target) {
      const charId = Number(target.dataset.dropTarget);
      const plate = charId === 1 ? char1 : char2;
      // only highlight if drop would be accepted
      if (plate.length < maxPerChar && !splitting && !splitDone && !stage1Done) {
        setDropHighlight(charId);
      } else {
        setDropHighlight(null);
      }
    } else {
      setDropHighlight(null);
    }
  }

  function handleCookiePointerUp(e) {
    const ds = dragStartRef.current;
    dragStartRef.current = null;

    if (!ds || !ds.isDragging) {
      // was not dragging — let onClick handle it
      setDragging(null);
      setDropHighlight(null);
      return;
    }

    // check for drop target
    const els = document.elementsFromPoint(e.clientX, e.clientY);
    let target = null;
    for (const el of els) {
      const dt = el.closest("[data-drop-target]");
      if (dt) {
        target = dt;
        break;
      }
    }

    if (target) {
      const charId = Number(target.dataset.dropTarget);
      const plate = charId === 1 ? char1 : char2;
      if (
        plate.length < maxPerChar &&
        !splitting &&
        !splitDone &&
        !stage1Done
      ) {
        // assign cookie (same as handleCharacterClick)
        setCookies((prev) =>
          prev.map((c) =>
            c.id === ds.cookieId ? { ...c, assignedTo: charId } : c,
          ),
        );
        setHappyChar(charId);
      }
    }

    setDragging(null);
    setDropHighlight(null);
  }

  function handleCookiePointerCancel() {
    dragStartRef.current = null;
    setDragging(null);
    setDropHighlight(null);
  }

  /* ---------------- handlers ---------------- */
  function handleCookieClick(id) {
    // suppress click that fires after a drag gesture
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (splitting || splitDone || stage1Done) return;
    const cookie = cookies.find((c) => c.id === id);
    if (cookie.assignedTo !== null) return;

    // last cookie in stage 2 → split
    if (stage2Leftover) {
      setSplitting(true);
      setTimeout(() => {
        setSplitting(false);
        setSplitDone(true);
        setCookies((prev) =>
          prev.map((c) => (c.id === id ? { ...c, assignedTo: "split" } : c)),
        );
      }, 1200);
      return;
    }

    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleCharacterClick(charId) {
    if (selectedId === null || splitting || splitDone || stage1Done) return;
    const plate = charId === 1 ? char1 : char2;
    if (plate.length >= maxPerChar) return;

    setCookies((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, assignedTo: charId } : c)),
    );
    setSelectedId(null);
    setHappyChar(charId);
  }

  function handleHint() {
    setHintActive(true);
  }

  function handleContinue() {
    if (stage === 1) {
      setStage(2);
      setCookies(makeCookies(5));
      setSelectedId(null);
      setHintActive(false);
      setSplitting(false);
      setSplitDone(false);
      setShowEquation(false);
      setDragging(null);
      setDropHighlight(null);
    } else {
      navigate("/exploration/fractions");
    }
  }

  /* ---------------- instruction text ---------------- */
  function getInstruction() {
    if (stage === 1) {
      if (stage1Done) return null;
      if (hintActive && selectedId === null && totalAssigned === 0)
        return "First let\u2019s give each person 1 cookie.\n\nClick on any cookie.";
      if (selectedId !== null) return "Now click on one of the people.";
      if (totalAssigned === 0)
        return "Share 4 cookies.\n\nSee if you can divide these cookies evenly.";
      if (totalAssigned === 1)
        return "Great! Now give a cookie to the other person.";
      if (
        totalAssigned === 2 &&
        char1.length === 1 &&
        char2.length === 1
      )
        return "Ok, each person has a cookie.\n\nNow give them each another one.";
      if (totalAssigned === 2)
        return "The other person doesn\u2019t have any yet!\n\nGive them a cookie too.";
      if (totalAssigned === 3) return "One more cookie to go!";
      return "Keep sharing the cookies evenly.";
    }

    // Stage 2
    if (splitDone) return null;
    if (splitting) return "The cookie splits in half!";
    if (stage2Leftover)
      return "Hmm, there\u2019s one cookie left over.\n\nYou can\u2019t split it evenly\u2026 or can you?\n\nTry clicking on the last cookie.";
    if (selectedId !== null) return "Now click on one of the people.";
    if (totalAssigned === 0)
      return "Share 5 cookies equally.\n\nBut how about 5 cookies \u00F7 2 people?\n\nTry giving each person the same amount.";
    if (totalAssigned === 1)
      return "Now give a cookie to the other person.";
    if (
      totalAssigned === 2 &&
      char1.length === 1 &&
      char2.length === 1
    )
      return "Each person has one cookie.\n\nKeep going!";
    if (totalAssigned === 2)
      return "The other person needs cookies too!";
    if (totalAssigned === 3) return "One more to share!";
    return "Keep sharing the cookies evenly.";
  }

  const instruction = getInstruction();
  const showHint =
    !hintActive && !stageComplete && stage === 1 && totalAssigned === 0;

  /* ---------------- render ---------------- */
  return (
    <div className="h-[100dvh] w-screen flex overflow-hidden">
      {/* ---- Left sidebar ---- */}
      <aside className="w-80 shrink-0 bg-slate-900 flex flex-col border-r border-white/5">
        {/* Pause / back */}
        <nav className="p-4">
          <button
            onClick={() => navigate("/exploration/fractions")}
            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border-none cursor-pointer flex items-center justify-center transition-colors"
            aria-label="Back to Fractions"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          </button>
        </nav>

        {/* Instruction / equation */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          {instruction && (
            <p className="text-white text-lg leading-relaxed whitespace-pre-line m-0">
              {instruction}
            </p>
          )}

          {showEquation && stage === 1 && (
            <p className="text-[#4e86ff] text-xl font-bold leading-relaxed m-0 animate-fade-slide-in">
              4 cookies &divide; 2 people = 2 cookies each
            </p>
          )}

          {showEquation && stage === 2 && (
            <div className="animate-fade-slide-in flex flex-col gap-3">
              <p className="text-[#4e86ff] text-xl font-bold leading-relaxed m-0">
                5 cookies &divide; 2 people = 2&frac12; cookies each!
              </p>
              <p
                className="text-emerald-400 text-base m-0"
                style={{
                  opacity: 0,
                  animation: "fadeSlideIn 0.6s ease-out 0.8s forwards",
                }}
              >
                When you can&rsquo;t share evenly, you need fractions!
              </p>
            </div>
          )}
        </div>

        {/* Hint button */}
        {showHint && (
          <div className="flex justify-center pb-4">
            <button
              onClick={handleHint}
              className="w-14 h-14 rounded-full bg-[#282E4F] hover:bg-[#3a4270] border-none cursor-pointer text-2xl flex items-center justify-center transition-colors"
              aria-label="Get a hint"
            >
              <span role="img" aria-label="hint">
                🖐️
              </span>
            </button>
          </div>
        )}

        {/* Continue button */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handleContinue}
            disabled={!stageComplete}
            className={`w-14 h-14 rounded-full border-none flex items-center justify-center transition-all duration-300 ${
              stageComplete
                ? "bg-[#4e86ff] cursor-pointer hover:bg-[#5a94ff] animate-gentle-pulse"
                : "bg-[#4e86ff]/30 cursor-not-allowed"
            }`}
            aria-label="Continue"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ---- Right game canvas ---- */}
      <main
        className="flex-1 flex flex-col relative bg-starfield"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #1a1f3a 0%, #0f172a 40%, #020617 100%)",
        }}
      >
        {/* Decorative stars */}
        <Stars />

        {/* Cookie pool (upper 60%) */}
        <div className="flex-[6] flex items-center justify-center relative z-10">
          <div className="flex gap-6 flex-wrap justify-center px-8">
            {unassigned.map((cookie) => {
              const isSelected = selectedId === cookie.id;
              const isLastCookie = stage2Leftover && !splitting && !splitDone;
              const isSplitting =
                splitting && stage === 2 && unassigned.length === 1;
              const isBeingDragged = dragging?.cookieId === cookie.id;

              return (
                <button
                  key={cookie.id}
                  onClick={() => handleCookieClick(cookie.id)}
                  onPointerDown={(e) => handleCookiePointerDown(e, cookie.id)}
                  onPointerMove={handleCookiePointerMove}
                  onPointerUp={handleCookiePointerUp}
                  onPointerCancel={handleCookiePointerCancel}
                  style={{ touchAction: "none" }}
                  className={`
                    w-28 h-28 text-7xl flex items-center justify-center
                    bg-transparent border-none select-none rounded-full
                    transition-all duration-300
                    ${isSelected ? "ring-4 ring-yellow-400 scale-110 cursor-pointer" : ""}
                    ${!isSelected && !isSplitting ? "hover:scale-105 active:scale-95 cursor-pointer" : ""}
                    ${isLastCookie ? "animate-gentle-pulse cursor-pointer" : ""}
                    ${isSplitting ? "animate-cookie-split pointer-events-none" : ""}
                    ${isBeingDragged ? "opacity-30" : ""}
                  `}
                  aria-label={`Cookie ${cookie.id}`}
                >
                  🍪
                </button>
              );
            })}
          </div>
        </div>

        {/* Floor line */}
        <div className="h-[2px] bg-slate-600/40 mx-12 relative z-10" />

        {/* Characters (lower 40%) */}
        <div className="flex-[4] flex items-start justify-center pt-8 gap-24 sm:gap-32 relative z-10 px-4">
          {[1, 2].map((charId) => {
            const plate = charId === 1 ? char1 : char2;
            const isFull = plate.length >= maxPerChar;
            const isClickable = selectedId !== null && !isFull && !splitting && !splitDone && !stage1Done;
            const isHappy = happyChar === charId;

            return (
              <div key={charId} className="flex flex-col items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <button
                    onClick={() => handleCharacterClick(charId)}
                    disabled={!isClickable && !dragging}
                    data-drop-target={charId}
                    className={`
                      w-24 h-24 text-6xl flex items-center justify-center
                      rounded-full bg-transparent border-2 select-none
                      transition-all duration-300 touch-manipulation
                      ${
                        isClickable
                          ? "border-yellow-400/60 cursor-pointer hover:border-yellow-400 hover:bg-yellow-400/10"
                          : "border-transparent cursor-default"
                      }
                      ${isHappy ? "scale-125" : "scale-100"}
                      ${dropHighlight === charId ? "ring-4 ring-green-400 bg-green-400/15 scale-110" : ""}
                    `}
                    aria-label={`Person ${charId}`}
                  >
                    {CHAR_EMOJI[charId]}
                  </button>
                  {isHappy && (
                    <span className="absolute -top-3 -right-1 text-2xl animate-pop-in pointer-events-none">
                      🎉
                    </span>
                  )}
                </div>

                {/* Cookie plate */}
                <div className="flex gap-2 flex-wrap justify-center min-h-[56px] items-center">
                  {plate.map((c) => (
                    <span
                      key={c.id}
                      className="text-5xl select-none animate-pop-in"
                    >
                      🍪
                    </span>
                  ))}
                  {splitDone && (
                    <div
                      className="relative animate-pop-in"
                      style={{ animationDelay: "0.1s" }}
                    >
                      <span className="text-4xl opacity-60 select-none">
                        🍪
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                        &frac12;
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ghost cookie follows pointer during drag */}
        {dragging && (
          <div
            ref={ghostRef}
            className="fixed z-50 pointer-events-none text-7xl"
            style={{
              transform: "translate(-50%, -50%)",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
            }}
          >
            🍪
          </div>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Decorative stars                                                   */
/* ------------------------------------------------------------------ */
const STARS = [
  { l: "8%", t: "6%", s: 2, o: 0.6 },
  { l: "22%", t: "14%", s: 1.5, o: 0.4 },
  { l: "78%", t: "4%", s: 2.5, o: 0.5 },
  { l: "55%", t: "18%", s: 1, o: 0.3 },
  { l: "40%", t: "10%", s: 2, o: 0.7 },
  { l: "88%", t: "28%", s: 1.5, o: 0.4 },
  { l: "12%", t: "38%", s: 1, o: 0.3 },
  { l: "65%", t: "42%", s: 2, o: 0.5 },
  { l: "35%", t: "52%", s: 1.5, o: 0.4 },
  { l: "50%", t: "65%", s: 2, o: 0.6 },
  { l: "82%", t: "58%", s: 1, o: 0.3 },
  { l: "4%", t: "72%", s: 2.5, o: 0.5 },
  { l: "72%", t: "78%", s: 1.5, o: 0.4 },
  { l: "28%", t: "85%", s: 2, o: 0.6 },
  { l: "92%", t: "90%", s: 1, o: 0.3 },
];

function Stars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {STARS.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: s.l, top: s.t, width: s.s, height: s.s, opacity: s.o }}
        />
      ))}
    </div>
  );
}
