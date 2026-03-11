import { Link, useNavigate, useParams } from "react-router-dom";
import { subjects } from "../data/lessons-data";

function StatusIcon({ status }) {
  if (status === "completed") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  if (status === "locked") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    );
  }
  // available — play icon
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6" stroke="none">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

export default function UnitPage() {
  const { subjectSlug } = useParams();
  const navigate = useNavigate();

  const subject = subjects[subjectSlug];

  if (!subject) {
    return (
      <div className="min-h-screen bg-starfield flex items-center justify-center flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">Subject not found</h2>
        <button
          onClick={() => navigate("/account/billing")}
          className="px-6 py-2 rounded-lg border-2 border-white/20 text-white bg-transparent hover:bg-white/10 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

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
        <div className={`w-20 h-20 rounded-2xl ${subject.iconBg} flex items-center justify-center text-4xl font-bold ${subject.iconColor}`}>
          {subject.icon}
        </div>
        <h1 className="text-3xl font-bold text-white m-0">{subject.title}</h1>
        <p className="text-slate-400 text-sm m-0">{subject.subtitle}</p>
      </div>

      {/* Lesson grid */}
      <div className="max-w-3xl w-full mx-auto px-6 pb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subject.lessons.map((lesson) => {
          const isClickable = lesson.status !== "locked";
          const Card = isClickable ? Link : "div";
          const cardProps = isClickable
            ? { to: `/exploration/${subjectSlug}/${lesson.id}` }
            : {};

          return (
            <Card
              key={lesson.id}
              {...cardProps}
              className={`flex items-center gap-4 p-4 rounded-xl border bg-slate-900 no-underline transition-colors ${
                lesson.status === "locked"
                  ? "border-white/5 opacity-50 cursor-not-allowed"
                  : "border-white/10 hover:bg-white/5 cursor-pointer"
              }`}
            >
              {/* Lesson number */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                lesson.status === "completed"
                  ? "bg-green-500/20 text-green-400"
                  : lesson.status === "available"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-slate-700/50 text-slate-500"
              }`}>
                {lesson.id}
              </div>

              {/* Title */}
              <span className={`flex-1 font-medium text-sm ${
                lesson.status === "locked" ? "text-slate-500" : "text-white"
              }`}>
                {lesson.title}
              </span>

              {/* Status icon */}
              <StatusIcon status={lesson.status} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
