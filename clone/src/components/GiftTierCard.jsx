export default function GiftTierCard({ tier, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect?.(tier)}
      className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-colors cursor-pointer bg-transparent ${
        selected
          ? "border-white text-white"
          : "border-white/20 text-slate-400 hover:border-white/40 hover:text-white"
      }`}
    >
      <span className="text-sm font-medium">{tier.name}</span>
      <span className="text-3xl font-semibold text-white">{tier.display}</span>
      <span className="text-xs text-slate-400">{tier.students}</span>
    </button>
  );
}
