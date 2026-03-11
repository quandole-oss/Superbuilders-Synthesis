import { useNavigate } from "react-router-dom";

export default function LessonTopBar({ title, progress = 0, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-md">
        {/* Left: Back arrow */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-transparent border-none text-white cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Center: Title */}
        <h1 className="text-white text-sm font-semibold tracking-wide m-0">
          {title}
        </h1>

        {/* Right: Settings + Close */}
        <div className="flex items-center gap-2">
          <button
            className="bg-transparent border-none text-slate-400 hover:text-white cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Settings"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>
          <button
            onClick={onClose || (() => navigate(-1))}
            className="bg-transparent border-none text-slate-400 hover:text-white cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800 w-full">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
