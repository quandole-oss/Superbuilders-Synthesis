import { useRef, useCallback } from "react";

function gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }
function lcm(a, b) { return (a / gcd(a, b)) * b; }

/**
 * InteractiveFractionBar — the core manipulative for the equivalence lesson.
 *
 * Props:
 *  pieces        – total number of pieces (integer)
 *  shaded        – boolean[] indicating which pieces are shaded
 *  sizes         – optional array of { n, d } rational fractions for proportional widths
 *  color         – Tailwind bg color class (e.g. "bg-blue-500")
 *  interactive   – whether pieces respond to tap/click
 *  onTogglePiece – callback(index) when a piece is toggled
 *  label         – text label rendered below the bar (e.g. "1/2")
 *  matched       – triggers green glow animation when true
 */
export default function InteractiveFractionBar({
  pieces,
  shaded,
  sizes,
  color = "bg-blue-500",
  interactive = false,
  onTogglePiece,
  label,
  matched = false,
  activeMode = "shade",
}) {
  const animatingRef = useRef(new Set());
  const countShaded = shaded.filter(Boolean).length;

  let displayLabel;
  if (label) {
    displayLabel = label;
  } else if (sizes) {
    const lcd = sizes.reduce((l, s) => lcm(l, s.d), 1);
    const shadedUnits = shaded.reduce(
      (sum, s, i) => (s ? sum + sizes[i].n * (lcd / sizes[i].d) : sum),
      0
    );
    displayLabel = `${shadedUnits}/${lcd}`;
  } else {
    displayLabel = `${countShaded}/${pieces}`;
  }

  const handleToggle = useCallback(
    (index) => {
      if (!interactive || !onTogglePiece) return;
      onTogglePiece(index);
    },
    [interactive, onTogglePiece]
  );

  return (
    <div className="w-full">
      {/* Bar container */}
      <div
        className={`flex gap-[2px] w-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
          matched
            ? "border-emerald-400 animate-match-pulse"
            : "border-white/20"
        }`}
      >
        {shaded.map((isShaded, i) => {
          const Wrapper = interactive ? "button" : "div";
          const props = interactive
            ? {
                role: "switch",
                "aria-checked": isShaded,
                "aria-label": `Piece ${i + 1} of ${pieces}${
                  isShaded ? ", shaded" : ", empty"
                }`,
                onClick: () => handleToggle(i),
              }
            : {};

          // Mode-specific ring indicator
          const modeRing =
            interactive && activeMode === "split"
              ? "ring-2 ring-inset ring-cyan-400/40"
              : interactive && activeMode === "smash"
              ? "ring-2 ring-inset ring-orange-400/40"
              : "";

          return (
            <Wrapper
              key={`${pieces}-${i}-${sizes?.[i]?.d || 0}`}
              {...props}
              className={`
                min-h-[48px] rounded-sm relative
                transition-all duration-300 ease-out
                touch-manipulation
                ${isShaded ? `${color}` : "bg-slate-800"}
                ${
                  interactive
                    ? "cursor-pointer hover:brightness-110 active:scale-95 border-none p-0"
                    : ""
                }
                ${modeRing}
              `}
              style={{
                flex: `${sizes ? sizes[i].n / sizes[i].d : 1} 1 0%`,
              }}
            >
              {/* Split mode: dashed center line hint */}
              {interactive && activeMode === "split" && (
                <span
                  className="absolute inset-y-1 left-1/2 -translate-x-px w-0 border-l-2 border-dashed border-cyan-400/50 pointer-events-none"
                />
              )}
            </Wrapper>
          );
        })}
      </div>

      {/* Fraction label */}
      <p
        className={`text-center text-sm mt-2 font-semibold transition-colors duration-300 ${
          matched ? "text-emerald-400" : "text-slate-400"
        }`}
      >
        {displayLabel}
      </p>
    </div>
  );
}
