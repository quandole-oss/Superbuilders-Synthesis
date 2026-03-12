import { Link, useNavigate } from "react-router-dom";

const lessons = [
  { id: 1, title: "Share the Cookies" },
  { id: 2, title: "Halves and Quarters" },
  { id: 3, title: "Comparing Fractions" },
  { id: 4, title: "Adding Fractions" },
  { id: 5, title: "Subtracting Fractions" },
  { id: 6, title: "Equivalent Fractions" },
  { id: 7, title: "Mixed Numbers" },
  { id: 8, title: "Fraction Challenge" },
];

export default function FractionsUnit() {
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
        <div className="w-20 h-20 rounded-2xl bg-amber-500/20 flex items-center justify-center text-4xl font-bold text-amber-400">
          &frac12;
        </div>
        <h1 className="text-3xl font-bold text-white m-0">Fractions</h1>
        <p className="text-slate-400 text-sm m-0">8 lessons — Master the world of fractions</p>
      </div>

      {/* Lesson grid */}
      <div className="max-w-3xl w-full mx-auto px-6 pb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/exploration/fractions/${lesson.id}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-slate-900 no-underline hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 bg-blue-500/20 text-blue-400">
              {lesson.id}
            </div>
            <span className="flex-1 font-medium text-sm text-white">
              {lesson.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
