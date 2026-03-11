const colorMap = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
  amber: "bg-amber-500",
  cyan: "bg-cyan-500",
  rose: "bg-rose-500",
};

export default function FractionBar({ totalParts, shadedParts, color = "blue" }) {
  const bgClass = colorMap[color] || color;
  return (
    <div className="flex gap-1 w-full max-w-md mx-auto">
      {Array.from({ length: totalParts }).map((_, i) => (
        <div
          key={i}
          className={`h-16 flex-1 rounded-md border border-white/20 transition-colors duration-300 ${
            i < shadedParts ? bgClass : "bg-slate-800"
          }`}
        />
      ))}
    </div>
  );
}
