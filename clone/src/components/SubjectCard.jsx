import { Link } from "react-router-dom";

const iconMap = {
  "addition-icon": "+",
  "subtraction-icon": "\u2212",
  "multiplication-icon": "\u00d7",
  "division-icon": "\u00f7",
  "fractions-icon": "\u00bd",
  "numbers-place-value-icon": "#",
  "bonus-lessons-icon": "\u2605",
};

const colorMap = {
  "addition-icon": "bg-blue-500/20 text-blue-400",
  "subtraction-icon": "bg-emerald-500/20 text-emerald-400",
  "multiplication-icon": "bg-purple-500/20 text-purple-400",
  "division-icon": "bg-cyan-500/20 text-cyan-400",
  "fractions-icon": "bg-amber-500/20 text-amber-400",
  "numbers-place-value-icon": "bg-rose-500/20 text-rose-400",
  "bonus-lessons-icon": "bg-yellow-500/20 text-yellow-400",
};

export default function SubjectCard({ subject, linkTo }) {
  const symbol = iconMap[subject.icon] || "?";
  const colorClasses = colorMap[subject.icon] || "bg-white/10 text-white";

  const content = (
    <>
      <div
        className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center text-xl font-bold`}
      >
        {symbol}
      </div>
      <span className="text-white font-medium">{subject.name}</span>
      {linkTo && (
        <svg className="ml-auto text-slate-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </>
  );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black hover:bg-white/5 transition-colors cursor-pointer no-underline"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black hover:bg-white/5 transition-colors cursor-pointer">
      {content}
    </div>
  );
}
