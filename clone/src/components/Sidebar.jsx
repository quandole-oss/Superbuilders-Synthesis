import { Link, useLocation } from "react-router-dom";
import siteData from "../data/site-data.json";

const { sidebar } = siteData.navigation;

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-black border-r border-white/5 flex flex-col p-6">
      {/* Logo */}
      <Link to="/students" className="text-xl font-semibold text-white no-underline mb-10">
        {sidebar.logo}
      </Link>

      {/* Nav links */}
      <nav className="flex flex-col gap-2 flex-1">
        {sidebar.tabs.map((tab) => {
          const isActive =
            location.pathname === tab.url ||
            (tab.url === "/account/subscribe" && location.pathname.startsWith("/account"));
          return (
            <Link
              key={tab.label}
              to={tab.url}
              className={`px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Contact Us */}
      <a
        href={sidebar.contactUs.href}
        className="text-slate-400 hover:text-white text-sm no-underline transition-colors mt-auto"
      >
        {sidebar.contactUs.label}
      </a>
    </aside>
  );
}
