import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app this would authenticate
    window.location.href = "/";
  };

  return (
    <div className="bg-starfield min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-white mb-8 text-center">Log In</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Username or Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg border-4 border-white bg-transparent text-white hover:bg-white/10 px-4 py-3 font-semibold transition-colors cursor-pointer mt-2"
          >
            Log In
          </button>
        </form>

        <div className="flex justify-between mt-6 text-sm">
          <Link
            to="/signup"
            className="text-slate-400 hover:text-white no-underline transition-colors"
          >
            Create Account
          </Link>
          <Link
            to="/forgot-password"
            className="text-slate-400 hover:text-white no-underline transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
