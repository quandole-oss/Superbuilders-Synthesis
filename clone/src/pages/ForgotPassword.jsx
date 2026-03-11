import { useState } from "react";
import { Link } from "react-router-dom";
import siteData from "../data/site-data.json";

const { forgotPassword } = siteData.pages;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-starfield min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-white mb-8 text-center">
          {forgotPassword.heading}
        </h1>

        {submitted ? (
          <div className="text-center">
            <p className="text-slate-400 mb-6">
              If an account exists for that email, we've sent a reset link.
            </p>
            <Link
              to={forgotPassword.backLink.url}
              className="text-slate-400 hover:text-white text-sm no-underline transition-colors"
            >
              &larr; {forgotPassword.backLink.label}
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  {forgotPassword.fields[0]}
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg border-4 border-white bg-transparent text-white hover:bg-white/10 px-4 py-3 font-semibold transition-colors cursor-pointer mt-2"
              >
                {forgotPassword.ctaText}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                to={forgotPassword.backLink.url}
                className="text-slate-400 hover:text-white text-sm no-underline transition-colors"
              >
                &larr; {forgotPassword.backLink.label}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
