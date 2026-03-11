const dotColors = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
  cyan: "bg-cyan-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
};

export default function ArrayGrid({ rows, cols, color = "purple" }) {
  const dotClass = dotColors[color] || "bg-purple-500";
  const total = rows * cols;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="inline-grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, 24px)` }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full ${dotClass} opacity-90`}
          />
        ))}
      </div>
      <p className="text-slate-400 text-sm m-0">
        {rows} rows × {cols} columns = {total}
      </p>
    </div>
  );
}
