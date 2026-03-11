import { useState } from "react";
import { Link } from "react-router-dom";
import siteData from "../data/site-data.json";

const { signup } = siteData.pages;

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app this would create the student
    window.location.href = "/students";
  };

  return (
    <div className="bg-starfield min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-white mb-8 text-center">{signup.heading}</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">{signup.fields[0]}</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">{signup.fields[1]}</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
              placeholder="Last name"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">{signup.fields[2]}</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg border-4 border-white bg-transparent text-white hover:bg-white/10 px-4 py-3 font-semibold transition-colors cursor-pointer mt-2"
          >
            {signup.ctaText}
          </button>
        </form>

        <p className="text-slate-500 text-xs text-center mt-6">{signup.note}</p>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-slate-400 hover:text-white text-sm no-underline transition-colors"
          >
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
