import { useState } from "react";
import { Link } from "react-router-dom";
import siteData from "../data/site-data.json";
import Sidebar from "../components/Sidebar";
import SubjectCard from "../components/SubjectCard";

const { accountBilling } = siteData.pages;
const student = siteData.students[0];
const subjects = siteData.subjects;

export default function Billing() {
  const [activeTab, setActiveTab] = useState(accountBilling.tabs[0]);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Student profile card */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-semibold text-white">
            {student.initial}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">{student.name}</h1>
          </div>
          <Link
            to="/"
            className="ml-auto rounded-lg border-4 border-white bg-transparent text-white hover:bg-white/10 px-5 py-2 font-semibold no-underline transition-colors text-sm"
          >
            Launch Tutor
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/10">
          {accountBilling.tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px bg-transparent cursor-pointer ${
                activeTab === tab
                  ? "border-white text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "Progress" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <SubjectCard key={subject.name} subject={subject} linkTo={
                {
                  "addition-icon": "/exploration/addition",
                  "subtraction-icon": "/exploration/subtraction",
                  "multiplication-icon": "/exploration/multiplication",
                  "division-icon": "/exploration/division",
                  "fractions-icon": "/exploration/fractions",
                  "numbers-place-value-icon": "/exploration/numbers-place-value",
                  "bonus-lessons-icon": "/exploration/bonus",
                }[subject.icon] || null
              } />
            ))}
          </div>
        )}

        {activeTab === "Timeline" && (
          <div className="text-center py-16">
            <p className="text-slate-400">No activity to display yet.</p>
            <Link
              to="/activity"
              className="text-blue-400 hover:text-blue-300 text-sm no-underline mt-2 inline-block"
            >
              View Activity Timeline
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
