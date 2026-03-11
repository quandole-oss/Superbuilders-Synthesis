import { Link, useNavigate } from "react-router-dom";
import siteData from "../data/site-data.json";

const { activity } = siteData.pages;

export default function Activity() {
  const navigate = useNavigate();

  return (
    <div className="bg-starfield min-h-screen flex flex-col items-center px-4 pt-12">
      {/* Go Back link */}
      <div className="w-full max-w-2xl mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white text-sm no-underline transition-colors bg-transparent border-none cursor-pointer"
        >
          &larr; {activity.links[0].label}
        </button>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center text-center flex-1 justify-center">
        <h1 className="text-4xl font-semibold text-white mb-6">{activity.heading}</h1>
        <p className="text-slate-400 mb-8">{activity.emptyState}</p>

        <Link
          to="/"
          className="rounded-lg border-4 border-white bg-transparent text-white hover:bg-white/10 px-8 py-3 font-semibold no-underline transition-colors"
        >
          {activity.links[1].label}
        </Link>
      </div>
    </div>
  );
}
