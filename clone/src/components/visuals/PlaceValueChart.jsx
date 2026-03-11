const highlightGlow = {
  hundreds: "ring-2 ring-rose-400/50 bg-rose-500/10",
  tens: "ring-2 ring-amber-400/50 bg-amber-500/10",
  ones: "ring-2 ring-blue-400/50 bg-blue-500/10",
};

export default function PlaceValueChart({ number = 0, highlightDigit }) {
  const hundreds = Math.floor(number / 100);
  const tens = Math.floor((number % 100) / 10);
  const ones = number % 10;

  const columns = [
    { label: "Hundreds", count: hundreds, digit: "hundreds", color: "bg-rose-500" },
    { label: "Tens", count: tens, digit: "tens", color: "bg-amber-500" },
    { label: "Ones", count: ones, digit: "ones", color: "bg-blue-500" },
  ];

  // Only show hundreds column if number >= 100
  const visibleColumns = number >= 100 ? columns : columns.slice(1);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-4 justify-center">
        {visibleColumns.map((col) => {
          const isHighlighted = highlightDigit === col.digit;
          return (
            <div
              key={col.digit}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl min-w-[80px] ${
                isHighlighted ? highlightGlow[col.digit] : "bg-white/5"
              }`}
            >
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                {col.label}
              </span>
              <span className="text-white text-2xl font-bold">{col.count}</span>
              <div className="flex flex-wrap gap-1 justify-center min-h-[40px]">
                {Array.from({ length: col.count }).map((_, i) => {
                  if (col.digit === "hundreds") {
                    return (
                      <div key={i} className={`w-8 h-8 rounded ${col.color} opacity-80`} />
                    );
                  }
                  if (col.digit === "tens") {
                    return (
                      <div key={i} className={`w-2 h-8 rounded-sm ${col.color} opacity-80`} />
                    );
                  }
                  // ones
                  return (
                    <div key={i} className={`w-2 h-2 rounded-sm ${col.color} opacity-80`} />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-slate-400 text-sm m-0">
        {number >= 100
          ? `${hundreds} hundreds + ${tens} tens + ${ones} ones = ${number}`
          : `${tens} tens + ${ones} ones = ${number}`}
      </p>
    </div>
  );
}
