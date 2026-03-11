import { Link, useNavigate } from "react-router-dom";

const activities = [
  {
    id: "flashcard_frenzy_multiply",
    title: "Flashcard Frenzy",
    description: "Rapid-fire multiplication practice",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    accent: "border-amber-500/40 hover:border-amber-400",
    iconBg: "bg-amber-500/20 text-amber-400",
    route: "/exploration/flashcard_frenzy_multiply",
  },
  {
    id: "number_puzzles",
    title: "Number Puzzles",
    description: "Logic puzzles with numbers",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    accent: "border-purple-500/40 hover:border-purple-400",
    iconBg: "bg-purple-500/20 text-purple-400",
    route: null,
  },
  {
    id: "math_arcade",
    title: "Math Arcade",
    description: "Gamified math practice",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4" />
        <path d="M8 10v4" />
        <circle cx="15" cy="11" r="1" />
        <circle cx="18" cy="13" r="1" />
      </svg>
    ),
    accent: "border-cyan-500/40 hover:border-cyan-400",
    iconBg: "bg-cyan-500/20 text-cyan-400",
    route: null,
  },
  {
    id: "speed_challenge",
    title: "Speed Challenge",
    description: "Timed math exercises",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    accent: "border-rose-500/40 hover:border-rose-400",
    iconBg: "bg-rose-500/20 text-rose-400",
    route: null,
  },
];

export default function BonusUnit() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-starfield flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-4 p-6">
        <button
          onClick={() => navigate("/account/billing")}
          className="flex items-center gap-2 bg-transparent border-none text-slate-400 hover:text-white cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-4xl text-yellow-400">
          &#9733;
        </div>
        <h1 className="text-3xl font-bold text-white m-0">Bonus Lessons</h1>
        <p className="text-slate-400 text-sm m-0">Fun activities to boost your math skills</p>
      </div>

      {/* Activities grid */}
      <div className="max-w-3xl w-full mx-auto px-6 pb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activities.map((activity) => {
          const isAvailable = activity.route !== null;
          const Wrapper = isAvailable ? Link : "div";
          const wrapperProps = isAvailable ? { to: activity.route } : {};

          return (
            <Wrapper
              key={activity.id}
              {...wrapperProps}
              className={`flex flex-col gap-3 p-5 rounded-xl border-2 bg-slate-900 no-underline transition-all duration-200 ${
                isAvailable
                  ? `${activity.accent} cursor-pointer`
                  : "border-white/5 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg ${activity.iconBg} flex items-center justify-center`}>
                  {activity.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base m-0">{activity.title}</h3>
                  <p className="text-slate-400 text-xs m-0 mt-1">{activity.description}</p>
                </div>
              </div>
              {!isAvailable && (
                <span className="text-slate-500 text-xs">Coming soon</span>
              )}
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
