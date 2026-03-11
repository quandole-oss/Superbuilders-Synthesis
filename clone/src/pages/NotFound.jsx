import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="bg-starfield min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-6xl font-semibold text-white mb-4">404</h1>
        <p className="text-slate-400 text-lg mb-8">Page not found</p>
        <Link
          to="/"
          className="rounded-lg border-4 border-white bg-transparent text-white hover:bg-white/10 px-6 py-3 font-semibold no-underline transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
