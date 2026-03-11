const dotColors = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
  cyan: "bg-cyan-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
};

const borderColors = {
  blue: "border-blue-500/40",
  emerald: "border-emerald-500/40",
  purple: "border-purple-500/40",
  cyan: "border-cyan-500/40",
  rose: "border-rose-500/40",
  amber: "border-amber-500/40",
};

export default function GroupingDiagram({ total, groups, color = "cyan" }) {
  const perGroup = Math.floor(total / groups);
  const remainder = total % groups;
  const dotClass = dotColors[color] || "bg-cyan-500";
  const borderClass = borderColors[color] || "border-cyan-500/40";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap gap-3 justify-center">
        {Array.from({ length: groups }).map((_, g) => (
          <div
            key={g}
            className={`flex flex-wrap gap-1.5 p-3 rounded-xl border-2 border-dashed ${borderClass} min-w-[60px] justify-center`}
          >
            {Array.from({ length: perGroup }).map((_, d) => (
              <div
                key={d}
                className={`w-5 h-5 rounded-full ${dotClass} opacity-90`}
              />
            ))}
          </div>
        ))}

        {/* Remainder dots outside groups */}
        {remainder > 0 && (
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border-2 border-dashed border-slate-600 min-w-[60px] justify-center">
            {Array.from({ length: remainder }).map((_, d) => (
              <div
                key={d}
                className={`w-5 h-5 rounded-full ${dotClass} opacity-50`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-slate-400 text-sm m-0">
        {total} items → {groups} groups of {perGroup}
        {remainder > 0 && ` with ${remainder} left over`}
      </p>
    </div>
  );
}
